from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routers import auth, properties, agents, users, inquiries, meta

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="EstateHub API",
    description="Mobile-first Real Estate Marketplace API for Indian Markets",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(agents.router)
app.include_router(users.router)
app.include_router(inquiries.router)
app.include_router(meta.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to EstateHub API",
        "docs": "/docs",
        "version": "1.0.0"
    }
