import os
from pathlib import Path
from urllib.parse import urlparse
from pydantic import BaseModel
from dotenv import load_dotenv

# Automatically load .env from backend directory or project root
BACKEND_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = BACKEND_DIR.parent
load_dotenv(BACKEND_DIR / ".env")
load_dotenv(BASE_DIR / ".env")

# Resolve data paths robustly
def find_data_file(filename: str) -> Path:
    candidates = [
        BACKEND_DIR / "data" / filename,
        BASE_DIR / "data" / filename,
        BASE_DIR / "candidate-v1.0 (3)_layout_fixed (1)(2) (3)" / "candidate" / "data" / filename,
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]

DEFAULT_INITIAL_PATH = find_data_file("01_initial.json")
DEFAULT_UPDATE_PATH = find_data_file("02_update.json")
DEFAULT_EXPORTS_DIR = BACKEND_DIR / "exports" if (BACKEND_DIR / "exports").exists() else BASE_DIR / "exports"

def get_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "")
    if raw.strip():
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

def get_database_name(mongo_url: str) -> str:
    explicit = os.getenv("DATABASE_NAME", "").strip()
    if explicit:
        return explicit
    try:
        parsed = urlparse(mongo_url)
        path = parsed.path.lstrip("/")
        if path:
            return path.split("?")[0]
    except Exception:
        pass
    return "spendnest_revenue_intelligence"

class Settings(BaseModel):
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = get_database_name(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    initial_data_path: Path = Path(os.getenv("INITIAL_DATA_PATH", str(DEFAULT_INITIAL_PATH)))
    update_data_path: Path = Path(os.getenv("UPDATE_DATA_PATH", str(DEFAULT_UPDATE_PATH)))
    exports_dir: Path = Path(os.getenv("EXPORTS_DIR", str(DEFAULT_EXPORTS_DIR)))
    cors_origins: list[str] = get_cors_origins()
    port: int = int(os.getenv("PORT", 8000))
    host: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
