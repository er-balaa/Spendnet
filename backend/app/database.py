import certifi
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, ConfigurationError
from app.config import settings

def create_mongo_client() -> MongoClient:
    """Create MongoDB client configured for both local and Atlas connections."""
    client_kwargs = {
        "serverSelectionTimeoutMS": 6000,
        "connectTimeoutMS": 10000,
        "socketTimeoutMS": 30000,
        "maxPoolSize": 50,
        "minPoolSize": 2,
        "retryWrites": True
    }
    
    # Enable TLS root CA certificate verification for Atlas or TLS-enabled clusters
    is_atlas = "mongodb+srv://" in settings.mongodb_url
    is_tls = "tls=true" in settings.mongodb_url.lower() or "ssl=true" in settings.mongodb_url.lower()
    if is_atlas or is_tls:
        try:
            client_kwargs["tlsCAFile"] = certifi.where()
        except Exception:
            pass

    return MongoClient(settings.mongodb_url, **client_kwargs)

client = create_mongo_client()
db = client[settings.database_name]

def init_db():
    """Ensure required collections and unique compound indexes exist."""
    # Composite identity rule: (source_type, source_id) must be strictly unique
    db.conversations.create_index(
        [("source_type", ASCENDING), ("source_id", ASCENDING)],
        unique=True,
        name="unique_source_identity",
        background=True
    )
    db.conversations.create_index([("record_ref", ASCENDING)], name="idx_record_ref", background=True)
    db.conversations.create_index([("applied_revision", ASCENDING)], name="idx_revision", background=True)
    db.conversations.create_index([("review_status", ASCENDING)], name="idx_review_status", background=True)
    db.conversations.create_index([("assigned_routes", ASCENDING)], name="idx_assigned_routes", background=True)
    db.conversations.create_index([("has_usable_transcript", ASCENDING)], name="idx_has_usable_transcript", background=True)
    db.conversations.create_index([("person_name", ASCENDING)], name="idx_person_name", background=True)
    
    # Import batches history index
    db.import_batches.create_index([("batch_id", ASCENDING), ("imported_at", ASCENDING)], name="idx_import_batch", background=True)

def get_db():
    return db
