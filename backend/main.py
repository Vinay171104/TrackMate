from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from database import init_db
from routes.tracking import router as tracking_router
from routes.alerts import router as alerts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="TrackMate API", version="1.0.0", lifespan=lifespan)

# CORS configuration
origins = [
    "https://boisterous-kheer-e29809.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

app.include_router(tracking_router)
app.include_router(alerts_router)

@app.get("/")
def root():
    return {"message": "TrackMate API is running", "docs": "/docs"}