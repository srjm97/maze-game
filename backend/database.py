from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    database = None

db = Database()

async def connect_to_mongo():
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        if db.client is None or db.database is None:
            db.client = AsyncIOMotorClient(settings.MONGODB_URL)
            db.database = db.client[settings.DATABASE_NAME]
            logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
async def get_database():
    if db.database is None:
        await connect_to_mongo()  # ← now uses async version
    return db.database

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")
