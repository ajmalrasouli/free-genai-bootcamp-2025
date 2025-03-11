import json
import os
from typing import Dict, List
import re

class VocabularyLoader:
    def __init__(self):
        self.words: Dict[str, dict] = {}
        self.load_vocabulary()

    def load_vocabulary(self):
        vocab_path = os.path.join("data", "vocabulary")
        if not os.path.exists(vocab_path):
            return

        for file in os.listdir(vocab_path):
            if file.endswith('.json'):
                with open(os.path.join(vocab_path, file), 'r', encoding='utf-8') as f:
                    words = json.load(f)
                    for word in words:
                        if self.validate_word(word):
                            self.words[word['word']] = word

    def validate_word(self, word: dict) -> bool:
        required_fields = ['word', 'translation', 'pos']
        if not all(field in word for field in required_fields):
            return False

        # Validate Farsi characters
        farsi_pattern = r'^[\u0600-\u06FF\s]+$'
        return bool(re.match(farsi_pattern, word['word']))

    def get_word(self, farsi_word: str) -> dict:
        return self.words.get(farsi_word, {})

    def get_words_by_pos(self, pos: str) -> List[dict]:
        return [word for word in self.words.values() if word['pos'] == pos] 