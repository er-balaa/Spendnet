from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import db, init_db
from app.services.import_service import reset_and_seed
from app.routers import conversations, dashboard, imports, brief, exports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB indexes
    try:
        init_db()
        # Check if empty; if so, seed in final demo state (both batches)
        count = db.conversations.count_documents({})
        if count == 0:
            reset_and_seed("both")
    except Exception as e:
        print(f"[WARNING] Database connection initialization notice: {e}")
    yield

app = FastAPI(
    title="SpendNest Revenue Intelligence Inbox API",
    description="Production-grade REST API supporting Conversation Inbox, Routing Taxonomy, Batch Replay & Revisions, Manager Brief, and Exports.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Include routers
app.include_router(dashboard.router, prefix="/api")
app.include_router(conversations.router, prefix="/api")
app.include_router(imports.router, prefix="/api")
app.include_router(brief.router, prefix="/api")
app.include_router(exports.router, prefix="/api")

@app.get("/api/health")
def health_check():
    try:
        db.command("ping")
        count = db.conversations.count_documents({})
        return {
            "status": "healthy",
            "database": "connected",
            "storage_engine": "Local File Store (Zero-Dependency)",
            "database_name": settings.database_name,
            "unique_records": count
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database_error": str(e)
        }

@app.get("/health")
def health_check_root():
    return health_check()

# Mount built frontend if available
potential_dist_paths = [
    Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
    Path(__file__).resolve().parent.parent / "frontend" / "dist",
    Path("/app/frontend/dist")
]
frontend_dist = next((p for p in potential_dist_paths if p.exists()), None)

if frontend_dist and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Do not intercept API routes with SPA fallback
        if full_path.startswith("api/") or full_path == "api" or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "service": "SpendNest Revenue Intelligence API",
            "status": "online",
            "docs_url": "/docs",
            "version": "1.0.0"
        }
