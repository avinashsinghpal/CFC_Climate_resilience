from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import connect_to_mongo, close_mongo_connection
from app.routers import sensors, reports, forecast, integrity, alerts

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Federated Climate Action Platform API",
    description="Backend API for the Climate Action Platform Prototype",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sensors.router, prefix="/api/sensors", tags=["Sensors"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["Forecast"])
app.include_router(integrity.router, prefix="/api/integrity", tags=["Integrity"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
