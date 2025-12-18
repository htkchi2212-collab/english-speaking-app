from app.data.external_api.dictionary_api import DictionaryAPI

class DictionaryService:
    def __init__(self):
        self.api = DictionaryAPI()

    def lookup_word(self, word: str):
        result = self.api.lookup(word)
        if not result:
            return {"error": "Word not found"}

        return result
