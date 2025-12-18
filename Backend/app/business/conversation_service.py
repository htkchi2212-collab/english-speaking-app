from app.data.repositories.conversation_repository import ConversationRepository
from app.data.repositories.message_repository import MessageRepository
from app.data.external_api.llm_client import LLMClient

class ConversationService:
    def __init__(self):
        self.conv_repo = ConversationRepository()
        self.msg_repo = MessageRepository()
        self.llm = LLMClient()

    # 1️⃣ Start conversation
    def start_conversation(self, db, user_id, topic, level):
        conversation = self.conv_repo.create(
            db=db,
            user_id=user_id,
            topic=topic,
            level=level
        )

        # system prompt ban đầu
        system_prompt = (
            f"You are an English speaking tutor. "
            f"The student level is {level}. "
            f"The topic is {topic}. "
            f"Correct grammar gently and keep replies short."
        )

        self.msg_repo.add(
            db,
            conversation.id,
            "system",
            system_prompt
        )

        return conversation

    # 2️⃣ Send message
    def send_message(self, db, conversation_id, user_text):
        # Lưu message user
        self.msg_repo.add(
            db,
            conversation_id,
            "user",
            user_text
        )

        # Load history
        history = self.msg_repo.get_history(db, conversation_id)

        # Build prompt cho Ollama
        messages = []
        for msg in history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # Gọi LLM
        reply = self.llm.generate_reply(messages)

        # Lưu reply
        self.msg_repo.add(
            db,
            conversation_id,
            "assistant",
            reply
        )

        return reply
