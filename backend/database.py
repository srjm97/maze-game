from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

class Database:
    client = None
    database = None

db = Database()

async def connect_to_mongo():
    if db.client is None:
        try:
            db.client = AsyncIOMotorClient(settings.MONGODB_URL)
            db.database = db.client[settings.DATABASE_NAME]
            logger.info("Connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

async def get_database():
    # Ensure connection is ready
    if db.database is None:
        await connect_to_mongo()
    return db.database

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")
