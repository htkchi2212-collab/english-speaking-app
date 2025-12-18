from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.data.database.base import Base

DATABASE_URL = "sqlite:///app/data/database/app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    return SessionLocal()
