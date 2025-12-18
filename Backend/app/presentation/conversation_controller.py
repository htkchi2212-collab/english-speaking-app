from flask import Blueprint, request, jsonify
from app.business.conversation_service import ConversationService
from app.data.database.session import get_db

conversation_bp = Blueprint("conversation", __name__)
conversation_service = ConversationService()

@conversation_bp.route("/conversation/start", methods=["POST"])
def start_conversation():
    data = request.json
    db = get_db()

    conv = conversation_service.start_conversation(
        db=db,
        user_id=data["user_id"],
        topic=data["topic"],
        level=data["level"]
    )

    return jsonify({
        "conversation_id": conv.id
    })


@conversation_bp.route("/conversation/message", methods=["POST"])
def send_message():
    data = request.json
    db = get_db()

    reply = conversation_service.send_message(
        db=db,
        conversation_id=data["conversation_id"],
        user_text=data["text"]
    )

    return jsonify({
        "reply": reply
    })
