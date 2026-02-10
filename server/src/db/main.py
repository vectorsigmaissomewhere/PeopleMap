from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from src.config import Config
from src.auth.models import User 

engine = create_async_engine(
    Config.DATABASE_URL,
    echo=True,
    future=True
)

async def initdb():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
