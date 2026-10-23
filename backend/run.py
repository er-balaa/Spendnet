import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("ENV", "production").lower() in ("dev", "development")
    print(f"Starting SpendNest Revenue Intelligence Backend on {host}:{port} (reload={reload})...")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
