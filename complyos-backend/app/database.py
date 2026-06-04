from motor.motor_asyncio import AsyncClient, AsyncDatabase
from app.config import settings
from typing import Optional

client: Optional[AsyncClient] = None
db: Optional[AsyncDatabase] = None

async def connect_to_mongo():
    global client, db
    try:
        client = AsyncClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        # Verify connection
        await db.command("ping")
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ Disconnected from MongoDB")

def get_database() -> AsyncDatabase:
    if db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return db
