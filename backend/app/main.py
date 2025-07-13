from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .routers import images, analysis, files


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(images.router, prefix="/api", tags=["images"])
    app.include_router(analysis.router, prefix="/api", tags=["analysis"])
    app.include_router(files.router, prefix="/api", tags=["files"])

    @app.get("/")
    async def root():
        return {"message": "Pyama Scientific Image Processing API"}

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return app


app = create_app()