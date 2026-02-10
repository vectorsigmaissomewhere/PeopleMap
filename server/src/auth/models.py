from sqlmodel import SQLModel, Field, Column 
import sqlalchemy.dialects.postgresql as pg 
import uuid 
from sqlalchemy.sql import func
from datetime import datetime


class User(SQLModel, table=True):
    __tablename__ = "user_accounts"
    uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID, 
            primary_key=True, 
            unique=True, 
            nullable=False, 
            default=uuid.uuid4, 
            info={"description": "Unique identifier for the user account"},
        )
    )
    full_name: str 
    email: str 
    password_has: str 
    is_verified: bool = False 
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=func.now))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=func.now, onupdate=func.now))
    
    def __repr__(self) -> str: 
        return f"<User {self.email}>"
