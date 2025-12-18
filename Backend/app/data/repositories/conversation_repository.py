from app.data.models.conversation import Conversation

class ConversationRepository:
    def create(self, db, user_id, topic, level):
        conv = Conversation(
            user_id=user_id,
            topic=topic,
            level=level
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return conv
