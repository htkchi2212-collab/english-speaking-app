from app.data.database.session import engine
from app.data.database.base import Base

# import models để SQLAlchemy biết
from app.data.models.conversation import Conversation
from app.data.models.message import Message

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized")

if __name__ == "__main__":
    init_db()
