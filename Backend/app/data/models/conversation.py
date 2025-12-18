from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.data.database.base import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    topic = Column(String)
    level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
