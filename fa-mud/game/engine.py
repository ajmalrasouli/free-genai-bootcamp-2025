"""Game engine for Farsi Text Adventure MUD."""
from typing import Dict, List, Optional
import json
import re
import hazm
import arabic_reshaper
from bidi.algorithm import get_display

from .models import Room, GameState, Item, NPC
from .vocabulary_loader import VocabularyLoader

class GameEngine:
    """Main game engine that processes commands and manages game state."""
    
    def __init__(self, vocabulary_loader: VocabularyLoader, rooms: Dict[str, Room]):
        """Initialize game engine."""
        self.vocab = vocabulary_loader
        self.rooms = rooms
        self.state = GameState()
        self.normalizer = hazm.Normalizer()
        
        # Initialize starting room
        self.state.current_room_id = "library"
        
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
        
    def process_command(self, command: str) -> str:
        """Process a game command and return response."""
        if not command:
            return "Please enter a command."
            
        command = command.lower().strip()
        
        # Handle special commands
        if command == "look":
            return self.handle_look()
        elif command == "inventory":
            return self.handle_inventory()
        elif command == "help":
            return self.handle_help()
            
        # Parse command parts
        parts = command.split()
        if len(parts) < 2:
            return "Invalid command format. Type 'help' for instructions."
            
        verb = parts[0]
        target = parts[1]
        
        # Process target word for proper RTL display
        if any('\u0600' <= c <= '\u06FF' for c in target):
            target = self.normalize_farsi(target)
        
        # Handle movement
        if verb == "move":
            return self.handle_move(target)
            
        # Handle item interactions
        if verb in {"take", "drop", "use", "give", "eat", "drink"}:
            # Check for additional target (e.g., "give book to person")
            if len(parts) > 3 and parts[2] == "to":
                second_target = parts[3]
                if any('\u0600' <= c <= '\u06FF' for c in second_target):
                    second_target = self.normalize_farsi(second_target)
                return self.handle_item_interaction(verb, target, second_target)
            return self.handle_item_interaction(verb, target)
            
        # Handle object interactions
        if verb in {"open", "close"}:
            return self.handle_object_interaction(verb, target)
            
        return "Invalid command."
        
    def handle_look(self) -> str:
        """Handle look command."""
        room = self.rooms[self.state.current_room_id]
        response = [f"You are in the {room.name}.", room.description]
        
        # List items
        if room.items:
            items = [f"**{self.normalize_farsi(item.name_fa)}**" for item in room.items]
            response.append("You see: " + ", ".join(items))
            
        # List NPCs
        if room.npcs:
            npcs = [f"**{self.normalize_farsi(npc.name_fa)}**" for npc in room.npcs]
            response.append("Characters here: " + ", ".join(npcs))
            
        # List exits
        exits = [self.normalize_farsi(exit) for exit in room.exits.keys()]
        response.append("Exits: " + ", ".join(exits))
        
        return "\n".join(response)
        
    def handle_inventory(self) -> str:
        """Handle inventory command."""
        if not self.state.player.inventory:
            return "Your inventory is empty."
            
        items = [f"**{self.normalize_farsi(item.name_fa)}**" for item in self.state.player.inventory]
        return "You are carrying: " + ", ".join(items)
        
    def handle_help(self) -> str:
        """Handle help command."""
        return """Available commands:
- look: Look around the room
- move <direction>: Move in a direction
- take <item>: Pick up an item
- drop <item>: Drop an item
- use <item> on <object>: Use an item on something
- give <item> to <person>: Give an item to someone
- open/close <object>: Interact with objects
- eat/drink <item>: Consume items
- inventory: Check your inventory
- help: Show this help message"""
        
    def handle_move(self, direction: str) -> str:
        """Handle movement command."""
        current_room = self.rooms[self.state.current_room_id]
        
        # Normalize direction for comparison
        normalized_direction = self.normalize_farsi(direction)
        normalized_exits = {self.normalize_farsi(exit): room_id for exit, room_id in current_room.exits.items()}
        
        if normalized_direction not in normalized_exits:
            return f"You can't go {direction}."
            
        # Move to new room
        self.state.current_room_id = normalized_exits[normalized_direction]
        return self.handle_look()
        
    def handle_item_interaction(self, verb: str, target: str, second_target: str = None) -> str:
        """Handle item-related commands."""
        current_room = self.rooms[self.state.current_room_id]
        
        # Normalize targets for comparison
        normalized_target = self.normalize_farsi(target)
        normalized_second_target = self.normalize_farsi(second_target) if second_target else None
        
        # Find target item using normalized comparison
        room_item = next(
            (i for i in current_room.items if self.normalize_farsi(i.name_fa) == normalized_target), 
            None
        )
        inv_item = next(
            (i for i in self.state.player.inventory if self.normalize_farsi(i.name_fa) == normalized_target),
            None
        )
        
        if verb == "take":
            if not room_item:
                return f"There is no **{target}** here."
            if not room_item.is_portable:
                return f"You can't take the **{target}**."
            current_room.items.remove(room_item)
            self.state.player.inventory.append(room_item)
            return f"You take the **{target}**."
            
        elif verb == "drop":
            if not inv_item:
                return f"You don't have **{target}**."
            self.state.player.inventory.remove(inv_item)
            current_room.items.append(inv_item)
            return f"You drop the **{target}**."
            
        elif verb == "give":
            if not inv_item:
                return f"You don't have **{target}**."
            if not normalized_second_target:
                return "Give to whom?"
            # Find target NPC using normalized comparison
            npc = next(
                (n for n in current_room.npcs if self.normalize_farsi(n.name_fa) == normalized_second_target),
                None
            )
            if not npc:
                return f"There is no **{second_target}** here."
            self.state.player.inventory.remove(inv_item)
            return f"You give the **{target}** to **{second_target}**."
            
        elif verb in {"eat", "drink"}:
            if not inv_item:
                return f"You don't have **{target}**."
            if verb == "eat" and not inv_item.is_edible:
                return f"You can't eat the **{target}**."
            if verb == "drink" and not inv_item.is_drinkable:
                return f"You can't drink the **{target}**."
            self.state.player.inventory.remove(inv_item)
            return f"You {verb} the **{target}**."
            
        return "Invalid command."
        
    def handle_object_interaction(self, verb: str, target: str) -> str:
        """Handle object-related commands."""
        current_room = self.rooms[self.state.current_room_id]
        
        # Normalize target for comparison
        normalized_target = self.normalize_farsi(target)
        
        # Find non-portable items that match the target
        static_item = next(
            (i for i in current_room.items 
             if not i.is_portable and self.normalize_farsi(i.name_fa) == normalized_target),
            None
        )
        
        if not static_item:
            return f"You can't {verb} the **{target}**."
            
        return f"You {verb} the **{target}**."
        
        # Find target object
        obj = next((i for i in current_room.items if i.name_fa == target and not i.is_portable), None)
        
        if not obj:
            return f"You can't {verb} that."
            
        return f"You {verb} the **{self.format_farsi_text(target)}**."
