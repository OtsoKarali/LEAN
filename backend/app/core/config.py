from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # E*TRADE API Configuration
    ETRADE_CONSUMER_KEY: str = "demo_key"
    ETRADE_CONSUMER_SECRET: str = "demo_secret"
    ETRADE_ENV: str = "sandbox"  # or 'live'
    
    # Security
    FERNET_KEY: str = "demo_fernet_key_32_bytes_long_for_dev"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/adaptive_beta"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Broker callback URL
    BROKER_CALLBACK: str = "http://localhost:3000/api/brokers/etrade/callback"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings() 