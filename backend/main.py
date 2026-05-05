from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file before anything else

from database import init_db
from routes.tracking import router as tracking_router
from routes.alerts import router as alerts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="TrackMate API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracking_router)
app.include_router(alerts_router)

@app.get("/")
def root():
    return {
        "message": "TrackMate API is running",
        "docs": "/docs"
    }