"""Main entry point for Farsi MUD game."""
import os
import sys
import json
import random
from game.vocabulary_loader import VocabularyLoader
from game.engine import GameEngine
from game.ui import GameUI
from game.models import Item, NPC

def create_default_vocabulary():
    """Create default vocabulary if none exists."""
    vocabulary = [
        # Basic Items
        {
            "word": "کتاب",
            "translation": "book",
            "pos": "noun",
            "example": "Take the کتاب from the shelf."
        },
        {
            "word": "شمشیر",
            "translation": "sword",
            "pos": "noun",
            "example": "The شمشیر gleams in the light."
        },
        {
            "word": "درخت",
            "translation": "tree",
            "pos": "noun",
            "example": "A tall درخت stands before you."
        },
        {
            "word": "گرگ",
            "translation": "wolf",
            "pos": "noun",
            "example": "A گرگ prowls nearby."
        },
        {
            "word": "چراغ",
            "translation": "lamp",
            "pos": "noun",
            "example": "The چراغ illuminates the room."
        },
        # Food and Drink
        {
            "word": "نان",
            "translation": "bread",
            "pos": "noun",
            "example": "You find fresh نان on the table."
        },
        {
            "word": "آب",
            "translation": "water",
            "pos": "noun",
            "example": "A flask of آب sits here."
        },
        {
            "word": "چای",
            "translation": "tea",
            "pos": "noun",
            "example": "A cup of hot چای steams."
        },
        {
            "word": "سیب",
            "translation": "apple",
            "pos": "noun",
            "example": "A red سیب looks delicious."
        },
        # Furniture and Room Items
        {
            "word": "میز",
            "translation": "table",
            "pos": "noun",
            "example": "A wooden میز stands in the corner."
        },
        {
            "word": "صندلی",
            "translation": "chair",
            "pos": "noun",
            "example": "An empty صندلی waits to be used."
        },
        {
            "word": "تخت",
            "translation": "bed",
            "pos": "noun",
            "example": "A comfortable تخت for resting."
        },
        # Tools and Equipment
        {
            "word": "کلید",
            "translation": "key",
            "pos": "noun",
            "example": "A brass کلید might unlock something."
        },
        {
            "word": "طناب",
            "translation": "rope",
            "pos": "noun",
            "example": "A coiled طناب could be useful."
        },
        {
            "word": "نقشه",
            "translation": "map",
            "pos": "noun",
            "example": "A detailed نقشه of the area."
        },
        # Characters
        {
            "word": "مرد",
            "translation": "man",
            "pos": "noun",
            "example": "A mysterious مرد stands guard."
        },
        {
            "word": "زن",
            "translation": "woman",
            "pos": "noun",
            "example": "A wise زن offers advice."
        },
        {
            "word": "پیرمرد",
            "translation": "old man",
            "pos": "noun",
            "example": "A پیرمرد sits quietly."
        }
    ]
    return vocabulary

def create_themed_room(engine, room_id, theme, exits):
    """Create a room with a specific theme."""
    room = engine.generate_room(room_id, exits)
    
    # Set room name and base description based on theme
    themes = {
        "library": {
            "name": "Library",
            "items": ["کتاب", "میز", "صندلی", "چای"],
            "npcs": ["پیرمرد"]
        },
        "garden": {
            "name": "Garden",
            "items": ["درخت", "سیب", "طناب"],
            "npcs": ["مرد"]
        },
        "dining": {
            "name": "Dining Room",
            "items": ["نان", "چای", "میز", "صندلی"],
            "npcs": ["زن"]
        },
        "bedroom": {
            "name": "Bedroom",
            "items": ["تخت", "چراغ"],
            "npcs": []
        }
    }
    
    if theme in themes:
        room.name = themes[theme]["name"]
        # Add themed items
        for item_name in themes[theme]["items"]:
            word_data = engine.vocab.get_word(item_name)
            if word_data:
                item = Item(word_data)
                if item_name in ["میز", "صندلی", "تخت", "درخت"]:
                    item.is_portable = False
                if item_name in ["نان", "سیب"]:
                    item.is_edible = True
                if item_name in ["آب", "چای"]:
                    item.is_drinkable = True
                room.items.append(item)
        
        # Add themed NPCs
        for npc_name in themes[theme]["npcs"]:
            word_data = engine.vocab.get_word(npc_name)
            if word_data:
                npc = NPC(word_data)
                if npc_name == "پیرمرد":
                    npc.dialogue = ["Welcome to the library! Feel free to read the کتاب."]
                elif npc_name == "مرد":
                    npc.dialogue = ["The سیب from this درخت are delicious!"]
                elif npc_name == "زن":
                    npc.dialogue = ["Would you like some چای with your نان?"]
                room.npcs.append(npc)
    
    return room

def main():
    """Run the Farsi MUD game."""
    # Initialize vocabulary
    vocab_loader = VocabularyLoader()
    
    # Load vocabulary from memory
    vocab_loader.words = {word["word"]: word for word in create_default_vocabulary()}

    # Initialize game engine
    engine = GameEngine(vocab_loader)

    # Create themed rooms
    start_room = create_themed_room(engine, "start_room", "library", {
        "north": "garden",
        "east": "dining"
    })
    engine.state.rooms["start_room"] = start_room

    garden = create_themed_room(engine, "garden", "garden", {
        "south": "start_room",
        "east": "bedroom"
    })
    engine.state.rooms["garden"] = garden

    dining = create_themed_room(engine, "dining", "dining", {
        "west": "start_room",
        "north": "bedroom"
    })
    engine.state.rooms["dining"] = dining

    bedroom = create_themed_room(engine, "bedroom", "bedroom", {
        "west": "garden",
        "south": "dining"
    })
    engine.state.rooms["bedroom"] = bedroom

    # Start the UI
    app = GameUI(engine)
    app.run()

if __name__ == "__main__":
    main()
