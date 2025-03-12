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
    
    def normalize_farsi(self, text: str) -> str:
        """Normalize Farsi text for consistent processing."""
        if not text:
            return text
        # Remove any existing RTL/LTR marks
        text = text.replace('\u200F', '').replace('\u200E', '')
        # Normalize using hazm
        text = self.normalizer.normalize(text)
        # Reshape Arabic/Farsi characters
        text = arabic_reshaper.reshape(text)
        # Add RTL mark and apply BIDI algorithm
        return '\u200F' + get_display(text)
    
    def load_vocabulary(self, filename: str) -> Dict[str, Dict]:
        """Load vocabulary from JSON file."""
        with open(filename, 'r', encoding='utf-8') as f:
            vocab = json.load(f)
            # Process each Farsi word for proper RTL display
            processed_vocab = {}
            for word_data in vocab:
                # Process Farsi text and example
                word_data["word"] = self.normalize_farsi(word_data["word"])
                word_data["example"] = word_data["example"].replace(
                    word_data["word"].lstrip('\u200F'),
                    word_data["word"]
                )
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
            word_data["word"] = self.normalize_farsi(word_data["word"])
            # Also process example
            word_data["example"] = word_data["example"].replace(
                word_data["word"].lstrip('\u200F'),
                word_data["word"]
            )
            processed_vocab[word_data["word"]] = word_data
        return processed_vocab
    
    def get_word(self, farsi_word: str) -> Dict:
        """Get word data by Farsi text."""
        # Always normalize input word for consistent lookup
        lookup_key = self.normalize_farsi(farsi_word)
        return self.words.get(lookup_key)
    
    def validate_vocabulary(self, vocab: Dict[str, Dict]) -> bool:
        """Validate vocabulary entries."""
        required_fields = {"word", "translation", "pos", "example"}
        valid_pos = {"noun", "verb", "adjective", "adverb"}
        
        for word_data in vocab.values():
            # Check required fields first
            if not all(field in word_data for field in required_fields):
                return False
                
            # Remove RTL mark for validation
            farsi_text = word_data["word"].lstrip('\u200F')
            
            # Validate Farsi text
            if not farsi_text or not all(
                '\u0600' <= c <= '\u06FF' or c.isspace() 
                for c in farsi_text
            ):
                return False
                
            # Validate English translation
            if not word_data["translation"] or not all(
                ord(c) < 128 
                for c in word_data["translation"]
            ):
                return False
                
            # Validate part of speech
            if word_data["pos"] not in valid_pos:
                return False
                
            # Validate example contains the Farsi word
            if word_data["word"] not in word_data["example"]:
                return False
                
        return True
