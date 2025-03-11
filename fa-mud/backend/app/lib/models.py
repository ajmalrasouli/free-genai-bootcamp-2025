from typing import List, Dict, Optional
from pydantic import BaseModel

class Item:
    def __init__(self, word_data: dict):
        self.name_en = word_data["translation"]
        self.name_fa = word_data["word"]
        self.is_portable = True

class Room:
    def __init__(self, room_id: str):
        self.id = room_id
        self.description = ""
        self.items: List[Item] = []
        self.exits: Dict[str, str] = {}
        self.npcs: List['NPC'] = []

class Player:
    def __init__(self):
        self.inventory: List[Item] = []
        self.location = "start_room"
        self.learned_words: List[str] = []

class NPC:
    def __init__(self, npc_id: str, name_fa: str, name_en: str):
        self.id = npc_id
        self.name_fa = name_fa
        self.name_en = name_en
        self.vocabulary: List[dict] = []

class GameState(BaseModel):
    player: Dict
    current_room: Dict
    message: str
    available_commands: List[str] 