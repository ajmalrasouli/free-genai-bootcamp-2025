"""Vocabulary loader for Farsi MUD."""
import json
from typing import Dict, List
import hazm
import arabic_reshaper
from bidi.algorithm import get_display

class VocabularyLoader:
    """Load and validate Farsi vocabulary."""
    
    def __init__(self):
        """Initialize vocabulary loader."""
        self.normalizer = hazm.Normalizer()
        self.words = self.create_default_vocabulary()
    
    def process_farsi_text(self, text: str) -> str:
        """Process Farsi text for proper RTL display."""
        if not text:
            return text
            
        # Check if text already has RTL mark
        if text.startswith('\u200F'):
            return text
            
        # Normalize and reshape Farsi text
        normalized = self.normalizer.normalize(text)
        reshaped = arabic_reshaper.reshape(normalized)
        # Convert to display form with proper RTL
        bidi_text = get_display(reshaped)
        # Add RTL mark
        return f"\u200F{bidi_text}"
    
    def load_vocabulary(self, filename: str) -> Dict[str, Dict]:
        """Load vocabulary from JSON file."""
        with open(filename, 'r', encoding='utf-8') as f:
            vocab = json.load(f)
            # Process each Farsi word for proper RTL display
            processed_vocab = {}
            for word_data in vocab:
                # Process Farsi text
                farsi = word_data["word"]
                word_data["word"] = self.process_farsi_text(farsi)
                processed_vocab[word_data["word"]] = word_data
            return processed_vocab
    
    def create_default_vocabulary(self) -> Dict[str, Dict]:
        """Create default in-memory vocabulary."""
        vocab = [
            {
                "word": "کتاب",
                "translation": "book",
                "pos": "noun",
                "example": "Take the کتاب from the shelf."
            },
            {
                "word": "میز",
                "translation": "table",
                "pos": "noun",
                "example": "A wooden میز stands in the corner."
            },
            {
                "word": "درخت",
                "translation": "tree",
                "pos": "noun",
                "example": "A tall درخت stands before you."
            },
            {
                "word": "سیب",
                "translation": "apple",
                "pos": "noun",
                "example": "A red سیب looks delicious."
            },
            {
                "word": "نان",
                "translation": "bread",
                "pos": "noun",
                "example": "Fresh نان sits on the table."
            },
            {
                "word": "چای",
                "translation": "tea",
                "pos": "noun",
                "example": "A cup of hot چای steams."
            },
            {
                "word": "تخت",
                "translation": "bed",
                "pos": "noun",
                "example": "A comfortable تخت for resting."
            },
            {
                "word": "چراغ",
                "translation": "lamp",
                "pos": "noun",
                "example": "The چراغ illuminates the room."
            },
            {
                "word": "پیرمرد",
                "translation": "old man",
                "pos": "noun",
                "example": "A پیرمرد sits quietly reading."
            },
            {
                "word": "باغبان",
                "translation": "gardener",
                "pos": "noun",
                "example": "The باغبان tends to the garden."
            },
            {
                "word": "خدمتکار",
                "translation": "servant",
                "pos": "noun",
                "example": "The خدمتکار serves tea and bread."
            },
            {
                "word": "مرد",
                "translation": "man",
                "pos": "noun",
                "example": "A مرد stands guard."
            },
            {
                "word": "زن",
                "translation": "woman",
                "pos": "noun",
                "example": "A زن offers advice."
            }
        ]
        
        # Process each Farsi word for proper RTL display
        processed_vocab = {}
        for word_data in vocab:
            # Process Farsi text
            farsi = word_data["word"]
            processed_farsi = self.process_farsi_text(farsi)
            word_data["word"] = processed_farsi
            # Also process example
            example = word_data["example"]
            word_data["example"] = example.replace(farsi, processed_farsi)
            processed_vocab[processed_farsi] = word_data
        return processed_vocab
    
    def get_word(self, farsi_word: str) -> Dict:
        """Get word data by Farsi text."""
        # Check if word already has RTL mark
        if not farsi_word.startswith('\u200F'):
            # Process input word for lookup
            lookup_key = self.process_farsi_text(farsi_word)
        else:
            lookup_key = farsi_word
        return self.words.get(lookup_key)
    
    def validate_vocabulary(self, vocab: Dict[str, Dict]) -> bool:
        """Validate vocabulary entries."""
        for word_data in vocab.values():
            # Remove RTL mark for validation
            farsi_text = word_data["word"].lstrip('\u200F')
            # Check if Farsi text contains only Farsi characters
            if not all(('\u0600' <= c <= '\u06FF' or c.isspace()) for c in farsi_text):
                return False
            # Check if English text contains only ASCII characters
            if not all(ord(c) < 128 for c in word_data["translation"]):
                return False
            # Check required fields
            if not all(k in word_data for k in ["word", "translation", "pos", "example"]):
                return False
        return True
