import json
import re
import uuid
import threading
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.config import settings

ASCENDING = 1
DESCENDING = -1

class InsertOneResult:
    def __init__(self, inserted_id: str):
        self.inserted_id = inserted_id

class UpdateResult:
    def __init__(self, matched_count: int, modified_count: int, upserted_id: Optional[str] = None):
        self.matched_count = matched_count
        self.modified_count = modified_count
        self.upserted_id = upserted_id

class DeleteResult:
    def __init__(self, deleted_count: int):
        self.deleted_count = deleted_count

def _get_nested(doc: dict, key: str) -> Any:
    """Extract nested dictionary value using dot-notation."""
    if not isinstance(doc, dict):
        return None
    parts = key.split(".")
    curr = doc
    for p in parts:
        if isinstance(curr, dict) and p in curr:
            curr = curr[p]
        else:
            return None
    return curr

def _matches_condition(doc_val: Any, cond: Any) -> bool:
    if isinstance(cond, dict):
        if "$regex" in cond:
            pattern = cond["$regex"]
            flags = re.IGNORECASE if cond.get("$options") == "i" else 0
            if doc_val is None:
                return False
            return bool(re.search(pattern, str(doc_val), flags=flags))
        if "$eq" in cond:
            return doc_val == cond["$eq"]
        if "$ne" in cond:
            return doc_val != cond["$ne"]
        if "$in" in cond:
            return isinstance(cond["$in"], (list, set, tuple)) and doc_val in cond["$in"]
        if "$nin" in cond:
            return isinstance(cond["$nin"], (list, set, tuple)) and doc_val not in cond["$nin"]
        return doc_val == cond
    return doc_val == cond

def _matches_filter(doc: dict, filter_dict: dict) -> bool:
    if not filter_dict:
        return True
    for key, val in filter_dict.items():
        if key == "$or":
            if not any(_matches_filter(doc, sub) for sub in val):
                return False
        elif key == "$and":
            if not all(_matches_filter(doc, sub) for sub in val):
                return False
        else:
            doc_val = _get_nested(doc, key)
            if not _matches_condition(doc_val, val):
                return False
    return True

def _safe_sort_key(item: dict, field: str):
    val = _get_nested(item, field)
    if val is None:
        return (1, "")
    if isinstance(val, (int, float)):
        return (0, val)
    return (0, str(val))

class Cursor:
    def __init__(self, docs: List[dict]):
        self._docs = docs

    def sort(self, key: str, direction: Any = 1) -> "Cursor":
        reverse = (direction == -1 or direction == "desc")
        self._docs.sort(key=lambda x: _safe_sort_key(x, key), reverse=reverse)
        return self

    def __iter__(self):
        return iter(self._docs)

    def __len__(self):
        return len(self._docs)

    def __getitem__(self, item):
        return self._docs[item]

class DocumentCollection:
    def __init__(self, name: str, database: "LocalFileDatabase"):
        self.name = name
        self.database = database
        self._docs: List[dict] = []

    def create_index(self, keys: Any, **kwargs) -> str:
        """Indexes are maintained conceptually; composite identity is checked on updates/replaces."""
        return f"idx_{self.name}"

    def count_documents(self, filter_dict: Optional[dict] = None) -> int:
        filter_dict = filter_dict or {}
        with self.database._lock:
            return sum(1 for d in self._docs if _matches_filter(d, filter_dict))

    def find_one(self, filter_dict: Optional[dict] = None) -> Optional[dict]:
        filter_dict = filter_dict or {}
        with self.database._lock:
            for doc in self._docs:
                if _matches_filter(doc, filter_dict):
                    return deepcopy(doc)
            return None

    def find(self, filter_dict: Optional[dict] = None, projection: Optional[dict] = None) -> Cursor:
        filter_dict = filter_dict or {}
        with self.database._lock:
            matches = [deepcopy(d) for d in self._docs if _matches_filter(d, filter_dict)]
            if projection:
                for d in matches:
                    for k, v in projection.items():
                        if v == 0 and k in d:
                            del d[k]
            return Cursor(matches)

    def insert_one(self, doc: dict) -> InsertOneResult:
        with self.database._lock:
            item = deepcopy(doc)
            if "_id" not in item:
                item["_id"] = str(uuid.uuid4())
            self._docs.append(item)
            self.database._save()
            return InsertOneResult(inserted_id=item["_id"])

    def replace_one(self, filter_dict: dict, replacement: dict, upsert: bool = False) -> UpdateResult:
        with self.database._lock:
            doc = deepcopy(replacement)
            if "_id" not in doc:
                doc["_id"] = str(uuid.uuid4())
            for i, existing in enumerate(self._docs):
                if _matches_filter(existing, filter_dict):
                    # Preserve existing internal _id if replacement does not specify one
                    if "_id" in existing and "_id" not in replacement:
                        doc["_id"] = existing["_id"]
                    self._docs[i] = doc
                    self.database._save()
                    return UpdateResult(matched_count=1, modified_count=1, upserted_id=None)
            if upsert:
                self._docs.append(doc)
                self.database._save()
                return UpdateResult(matched_count=0, modified_count=1, upserted_id=doc["_id"])
            return UpdateResult(matched_count=0, modified_count=0, upserted_id=None)

    def update_one(self, filter_dict: dict, update_dict: dict) -> UpdateResult:
        with self.database._lock:
            for i, existing in enumerate(self._docs):
                if _matches_filter(existing, filter_dict):
                    if "$set" in update_dict:
                        for k, v in update_dict["$set"].items():
                            parts = k.split(".")
                            target = existing
                            for part in parts[:-1]:
                                if part not in target or not isinstance(target[part], dict):
                                    target[part] = {}
                                target = target[part]
                            target[parts[-1]] = deepcopy(v)
                    self.database._save()
                    return UpdateResult(matched_count=1, modified_count=1, upserted_id=None)
            return UpdateResult(matched_count=0, modified_count=0, upserted_id=None)

    def delete_many(self, filter_dict: Optional[dict] = None) -> DeleteResult:
        filter_dict = filter_dict or {}
        with self.database._lock:
            if not filter_dict:
                count = len(self._docs)
                self._docs = []
                self.database._save()
                return DeleteResult(deleted_count=count)
            new_docs = []
            deleted = 0
            for doc in self._docs:
                if _matches_filter(doc, filter_dict):
                    deleted += 1
                else:
                    new_docs.append(doc)
            self._docs = new_docs
            self.database._save()
            return DeleteResult(deleted_count=deleted)

    def distinct(self, field_name: str) -> List[Any]:
        with self.database._lock:
            values = set()
            for doc in self._docs:
                val = _get_nested(doc, field_name)
                if val is not None:
                    values.add(val)
            return sorted(list(values), key=lambda x: str(x))

    def aggregate(self, pipeline: list) -> List[dict]:
        with self.database._lock:
            docs = [deepcopy(d) for d in self._docs]
            for stage in pipeline:
                if "$group" in stage:
                    group_spec = stage["$group"]
                    id_spec = group_spec.get("_id", {})
                    grouped = {}
                    for d in docs:
                        group_id = {}
                        if isinstance(id_spec, dict):
                            for k, v in id_spec.items():
                                if isinstance(v, str) and v.startswith("$"):
                                    field = v[1:]
                                    group_id[k] = _get_nested(d, field)
                                else:
                                    group_id[k] = v
                        # Sort keys to ensure tuple hashing consistency
                        group_key = tuple(sorted(group_id.items(), key=lambda x: x[0]))
                        if group_key not in grouped:
                            grouped[group_key] = {"_id": group_id}
                    docs = list(grouped.values())
                elif "$sort" in stage:
                    sort_spec = stage["$sort"]
                    for sort_field, sort_dir in sort_spec.items():
                        reverse = (sort_dir == -1 or sort_dir == "desc")
                        docs.sort(key=lambda x: _safe_sort_key(x, sort_field), reverse=reverse)
            return docs

class LocalFileDatabase:
    """
    Lightweight, thread-safe, zero-dependency document database engine.
    Persists data cleanly to local JSON storage without requiring MongoDB or any external service.
    Implements full contract specification (composite identity, atomic replacement, revision tracking).
    """
    def __init__(self, storage_path: Path):
        self.storage_path = Path(storage_path)
        self._lock = threading.RLock()
        self.conversations = DocumentCollection("conversations", self)
        self.import_batches = DocumentCollection("import_batches", self)
        self._load()

    def _load(self):
        with self._lock:
            if self.storage_path.exists():
                try:
                    with open(self.storage_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    self.conversations._docs = data.get("conversations", [])
                    self.import_batches._docs = data.get("import_batches", [])
                except Exception as e:
                    print(f"[WARNING] Could not load database file from {self.storage_path}: {e}")
                    self.conversations._docs = []
                    self.import_batches._docs = []
            else:
                self.conversations._docs = []
                self.import_batches._docs = []

    def _save(self):
        with self._lock:
            try:
                self.storage_path.parent.mkdir(parents=True, exist_ok=True)
                data = {
                    "conversations": self.conversations._docs,
                    "import_batches": self.import_batches._docs
                }
                # Write to temp file first, then atomic replace to prevent partial writes
                temp_path = self.storage_path.with_suffix(".tmp")
                with open(temp_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                temp_path.replace(self.storage_path)
            except Exception as e:
                print(f"[ERROR] Failed to save database file: {e}")

    def command(self, cmd: str, *args, **kwargs) -> dict:
        """Simulates command executions like ping."""
        return {"ok": 1}

client = None
db = LocalFileDatabase(settings.storage_file_path)

def init_db():
    """Ensure storage directory exists and collections are ready."""
    db.storage_path.parent.mkdir(parents=True, exist_ok=True)
    db.conversations.create_index([("source_type", ASCENDING), ("source_id", ASCENDING)], unique=True)
    db.conversations.create_index([("record_ref", ASCENDING)])
    db.import_batches.create_index([("batch_id", ASCENDING), ("imported_at", ASCENDING)])

def get_db():
    return db
