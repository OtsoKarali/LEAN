from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.brokers import etrade
from app.core.config import settings

app = FastAPI(
    title="Adaptive Beta API",
    description="Real-time portfolio beta management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(etrade.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Adaptive Beta API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 