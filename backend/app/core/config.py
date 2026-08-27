import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "estatehub"
    JWT_SECRET: str = "estatehub_super_secret_jwt_key_2026_change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    ADMIN_KEY: str = "estatehub_admin_secret_key_123"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
