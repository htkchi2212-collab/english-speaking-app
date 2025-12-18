from app.data.models.message import Message

class MessageRepository:
    def add(self, db, conversation_id, role, content):
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    def get_history(self, db, conversation_id):
        return (
            db.query(Message)
            .filter_by(conversation_id=conversation_id)
            .order_by(Message.created_at)
            .all()
        )
