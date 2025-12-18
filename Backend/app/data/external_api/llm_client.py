import requests

OLLAMA_URL = "http://localhost:11434/api/chat"

class LLMClient:
    def generate_reply(self, messages):
        payload = {
            "model": "llama3.1:8b",
            "messages": messages,
            "stream": False
        }

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )
        response.raise_for_status()

        data = response.json()
        return data["message"]["content"]
