from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    database = None

db = Database()

def connect_to_mongo():
    if db.client is None or db.database is None:
        try:
            db.client = AsyncIOMotorClient(settings.MONGODB_URL)
            db.database = db.client[settings.DATABASE_NAME]
            logger.info("Connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

async def get_database():
    if db.database is None:
        # Call the sync function in a thread pool to avoid blocking
        from fastapi.concurrency import run_in_threadpool
        await run_in_threadpool(connect_to_mongo)
    return db.database


async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")
