import requests

class DictionaryAPI:
    BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en"

    def lookup(self, word: str):
        url = f"{self.BASE_URL}/{word}"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return None

        data = response.json()[0]

        meaning = data["meanings"][0]
        definition = meaning["definitions"][0]

        return {
            "word": data["word"],
            "phonetic": data.get("phonetic", ""),
            "part_of_speech": meaning["partOfSpeech"],
            "definition": definition["definition"],
            "example": definition.get("example", "")
        }
