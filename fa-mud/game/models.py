"""Core game models for Farsi MUD."""
from typing import Dict, List, Optional, Set

class Item:
    """Represents an item in the game world."""
    
    def __init__(self, word_data: Dict):
        self.name_en = word_data["translation"]
        self.name_fa = word_data["word"]
        self.is_portable = True  # Can be picked up
        self.is_edible = False
        self.is_drinkable = False
        self.is_usable = True
        self.state = {}  # For tracking item state (e.g., open/closed)

class Room:
    """Represents a room in the game world."""
    
    def __init__(self, room_id: str):
        self.id = room_id
        self.name = ""
        self.description = ""  # Will contain one Farsi word
        self.items: List[Item] = []
        self.exits: Dict[str, str] = {}  # direction -> room_id
        self.npcs: List['NPC'] = []
        self.state = {}  # For tracking room state
        
    def get_visible_objects(self) -> Set[str]:
        """Get all visible object names in the room."""
        objects = {item.name_fa for item in self.items}
        objects.update(npc.name_fa for npc in self.npcs)
        return objects
        
    def get_usable_objects(self) -> Set[str]:
        """Get names of objects that can be used with items."""
        return {item.name_fa for item in self.items if item.is_usable}
        
    def get_interactable_objects(self) -> Set[str]:
        """Get names of objects that can be directly interacted with."""
        return {item.name_fa for item in self.items if not item.is_portable}

class Player:
    """Represents the player character."""
    
    def __init__(self):
        self.inventory: List[Item] = []
        self.location = "start_room"
        self.learned_words: Set[str] = set()
        
    def get_item(self, name_fa: str) -> Optional[Item]:
        """Get item from inventory by Farsi name."""
        for item in self.inventory:
            if item.name_fa == name_fa:
                return item
        return None

class NPC:
    """Represents a non-player character."""
    
    def __init__(self, word_data: Dict):
        self.name_en = word_data["translation"]
        self.name_fa = word_data["word"]
        self.dialogue: List[str] = []  # List of possible responses
        self.state = {}  # For tracking NPC state

class GameState:
    """Manages the overall game state."""
    
    def __init__(self):
        self.player = Player()
        self.rooms: Dict[str, Room] = {}
        self.current_room_id = "start_room"
        
    @property
    def current_room(self) -> Room:
        """Get the current room object."""
        return self.rooms[self.current_room_id]
    
    def save_game(self, file_path: str) -> None:
        """Save game state to file."""
        state = {
            'player_location': self.current_room_id,
            'inventory': [(item.name_fa, item.state) for item in self.player.inventory],
            'learned_words': list(self.player.learned_words),
            'rooms': {
                room_id: {
                    'items': [(item.name_fa, item.state) for item in room.items],
                    'npcs': [(npc.name_fa, npc.state) for npc in room.npcs],
                    'state': room.state
                }
                for room_id, room in self.rooms.items()
            }
        }
        import json
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
    
    def load_game(self, file_path: str, vocabulary_loader: 'VocabularyLoader') -> None:
        """Load game state from file."""
        import json
        with open(file_path, 'r', encoding='utf-8') as f:
            state = json.load(f)
        
        # Restore player state
        self.current_room_id = state['player_location']
        self.player.learned_words = set(state['learned_words'])
        
        # Restore inventory
        self.player.inventory = []
        for name_fa, item_state in state['inventory']:
            word_data = vocabulary_loader.get_word(name_fa)
            if word_data:
                item = Item(word_data)
                item.state = item_state
                self.player.inventory.append(item)
        
        # Restore rooms
        for room_id, room_state in state['rooms'].items():
            if room_id in self.rooms:
                room = self.rooms[room_id]
                
                # Restore items
                room.items = []
                for name_fa, item_state in room_state['items']:
                    word_data = vocabulary_loader.get_word(name_fa)
                    if word_data:
                        item = Item(word_data)
                        item.state = item_state
                        room.items.append(item)
                
                # Restore NPCs
                room.npcs = []
                for name_fa, npc_state in room_state['npcs']:
                    word_data = vocabulary_loader.get_word(name_fa)
                    if word_data:
                        npc = NPC(word_data)
                        npc.state = npc_state
                        room.npcs.append(npc)
                
                # Restore room state
                room.state = room_state['state']
