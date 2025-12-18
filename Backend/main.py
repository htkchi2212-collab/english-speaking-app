from flask import Flask
from flask_cors import CORS
from app.presentation.conversation_controller import conversation_bp
from app.presentation.dictionary_controller import dictionary_bp

app = Flask(__name__)

CORS(app)
app.register_blueprint(dictionary_bp)
app.register_blueprint(conversation_bp)

if __name__ == "__main__":
    app.run(debug=True)
