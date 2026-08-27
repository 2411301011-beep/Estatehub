from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_manager = DatabaseManager()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db_manager.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]
    
    # Create indexes asynchronously
    db = db_manager.db
    
    # Users indexes
    await db.users.create_index("email", unique=True)
    
    # Properties indexes
    await db.properties.create_index("location.city")
    await db.properties.create_index("property_type")
    await db.properties.create_index("listing_type")
    await db.properties.create_index("price")
    await db.properties.create_index("featured")
    await db.properties.create_index([("title", "text"), ("description", "text")])
    
    # Agents indexes
    await db.agents.create_index("name")
    
    # Inquiries indexes
    await db.inquiries.create_index("property_id")
    await db.inquiries.create_index("user_id")
    
    logger.info("Connected to MongoDB successfully!")

async def close_mongo_connection():
    if db_manager.client:
        db_manager.client.close()
        logger.info("MongoDB connection closed.")

def get_db() -> AsyncIOMotorDatabase:
    return db_manager.db
