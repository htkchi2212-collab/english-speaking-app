from flask import Blueprint, jsonify
from app.business.dictionary_service import DictionaryService

dictionary_bp = Blueprint("dictionary", __name__)
service = DictionaryService()

@dictionary_bp.route("/dictionary/<word>", methods=["GET"])
def lookup(word):
    result = service.lookup_word(word.lower())
    return jsonify(result)
