import json
import os
from typing import Dict, Optional
from .models import Room, Item, NPC

class WorldLoader:
    def __init__(self):
        self.worlds: Dict[str, Dict[str, Room]] = {}
        self.load_worlds()

    def load_worlds(self):
        worlds_path = os.path.join("data", "worlds")
        if not os.path.exists(worlds_path):
            return

        for file in os.listdir(worlds_path):
            if file.endswith('.txt'):
                world_id = file.replace('.txt', '')
                self.worlds[world_id] = self.load_world(os.path.join(worlds_path, file))

    def load_world(self, file_path: str) -> Dict[str, Room]:
        rooms: Dict[str, Room] = {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            world_data = f.read()
            # Parse the world file and create rooms
            # This is a simplified version - you'll need to adapt it to your file format
            sections = world_data.split('### Room')
            
            for section in sections[1:]:  # Skip the header
                lines = section.strip().split('\n')
                room_id = lines[0].strip()
                room = Room(room_id)
                
                for line in lines[1:]:
                    if line.startswith('- Vocabulary:'):
                        # Process vocabulary items
                        continue
                    elif line.startswith('### NPCs'):
                        # Process NPCs
                        break
                    else:
                        # Add to room description
                        room.description += line + '\n'
                
                rooms[room_id] = room

        return rooms

    def get_world(self, world_id: str) -> Optional[Dict[str, Room]]:
        return self.worlds.get(world_id) 