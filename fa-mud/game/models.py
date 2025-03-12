"""Game models for Farsi Text Adventure MUD."""
from typing import Dict, List, Optional, Set
import json
import hazm
import arabic_reshaper
from bidi.algorithm import get_display
from game.vocabulary_loader import normalize_farsi

class Item:
    """Game item class."""
    
    def __init__(self, data: Dict):
        """Initialize item."""
        # Process Farsi name with proper text shaping
        self.name_fa = normalize_farsi(data["word"])  # Farsi name
        self.name_en = data["translation"]  # English name
        self.is_portable = data.get("is_portable", True)
        self.is_edible = data.get("is_edible", False)
        self.is_drinkable = data.get("is_drinkable", False)
        self.state = {}  # For tracking item state
        
class NPC:
    """Non-player character class."""
    
    def __init__(self, data: Dict):
        """Initialize NPC."""
        # Process Farsi name with proper text shaping
        self.name_fa = normalize_farsi(data["word"])  # Farsi name
        self.name_en = data["translation"]  # English name
        self.dialogue: List[str] = []
        self.state = {}  # For tracking NPC state
        
class Room:
    """Game room class."""
    
    def __init__(self, room_id: str):
        """Initialize room."""
        self.id = room_id
        self.name = ""
        self._description = ""
        self.exits: Dict[str, str] = {}  # direction -> room_id
        self.items: List[Item] = []
        self.npcs: List[NPC] = []
        self.state = {}  # For tracking room state
        
    @property
    def description(self) -> str:
        """Get room description with proper RTL text."""
        return self._description
    
    @description.setter
    def description(self, text: str) -> None:
        """Set room description and process Farsi text."""
        # Find Farsi words between ** markers
        words = text.split()
        processed_words = []
        
        for word in words:
            if word.startswith('**') and word.endswith('**'):
                # Process Farsi word
                farsi = word[2:-2]
                # Use the centralized normalize_farsi function
                processed_farsi = normalize_farsi(farsi)
                processed_words.append(f"**{processed_farsi}**")
            else:
                processed_words.append(word)
        
        self._description = " ".join(processed_words)
    
    def get_visible_objects(self) -> Set[str]:
        """Get all visible object names in the room."""
        objects = {item.name_fa for item in self.items}
        objects.update(npc.name_fa for npc in self.npcs)
        return objects
    
    def get_interactive_objects(self) -> Set[str]:
        """Get names of objects that can be directly interacted with."""
        return {item.name_fa for item in self.items if not item.is_portable}

class Player:
    """Player class."""
    
    def __init__(self):
        """Initialize player."""
        self.inventory: List[Item] = []
        self.learned_words: Set[str] = set()
    
    def get_item(self, name_fa: str) -> Optional[Item]:
        """Get item from inventory by Farsi name."""
        for item in self.inventory:
            if item.name_fa == name_fa:
                return item
        return None

class GameState:
    """Game state class."""
    
    def __init__(self):
        """Initialize game state."""
        self.current_room_id = "library"  # Start in library
        self.player = Player()
        
    def save_game(self, filename: str) -> None:
        """Save game state to file."""
        state = {
            "current_room": self.current_room_id,
            "inventory": [{"word": item.name_fa, "translation": item.name_en} for item in self.player.inventory],
            "learned_words": list(self.player.learned_words)
        }
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
            
    def load_game(self, filename: str, vocab_loader) -> None:
        """Load game state from file."""
        with open(filename, 'r', encoding='utf-8') as f:
            state = json.load(f)
            self.current_room_id = state["current_room"]
            self.player.inventory = [Item(item_data) for item_data in state["inventory"]]
            self.player.learned_words = set(state["learned_words"])
