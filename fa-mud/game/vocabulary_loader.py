"""Load and validate Farsi vocabulary."""
import json
from typing import Dict, List, Optional

class VocabularyLoader:
    """Load and validate Farsi vocabulary."""
    
    def __init__(self):
        self.words: Dict[str, Dict] = {}
        
    def load_from_file(self, file_path: str) -> None:
        """Load vocabulary from JSON file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Validate and store words
            for word_data in data:
                if self._validate_word(word_data):
                    self.words[word_data['word']] = word_data
                    
    def get_word(self, farsi_word: str) -> Optional[Dict]:
        """Get word data by Farsi word."""
        # Ensure proper UTF-8 encoding for Farsi text
        farsi_word = farsi_word.encode('utf-8').decode('utf-8')
        return self.words.get(farsi_word)
        
    def get_words_by_pos(self, pos: str) -> List[Dict]:
        """Get all words of a given part of speech."""
        return [word for word in self.words.values() if word['pos'] == pos]
        
    def _validate_word(self, word_data: Dict) -> bool:
        """Validate word data structure."""
        required_fields = {'word', 'translation', 'pos'}
        if not all(field in word_data for field in required_fields):
            return False
            
        # Validate Farsi word
        if not self._is_farsi(word_data['word']):
            return False
            
        return True
        
    def _is_farsi(self, text: str) -> bool:
        """Check if text contains only Farsi characters."""
        # Farsi Unicode range: U+0600 to U+06FF
        return all('\u0600' <= c <= '\u06FF' or c.isspace() for c in text)
