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
        """Initialize game engine.
        
        Args:
            vocabulary_loader: Vocabulary loader instance
            rooms: Dictionary of game rooms
        """
        self.vocab = vocabulary_loader
        self.rooms = rooms
        self.state = GameState()
        self.normalizer = hazm.Normalizer()
        
        # Initialize starting room
        self.state.current_room_id = "library"
        
    def format_farsi_text(self, text: str) -> str:
        """Format Farsi text with proper RTL support."""
        # Normalize and reshape Farsi text
        normalized = self.normalizer.normalize(text)
        reshaped = arabic_reshaper.reshape(normalized)
        # Convert to display form with proper RTL
        bidi_text = get_display(reshaped)
        # Add RTL mark
        return f"\u200F{bidi_text}"
        
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
            target = self.format_farsi_text(target)
        
        # Handle movement
        if verb == "move":
            return self.handle_move(target)
            
        # Handle item interactions
        if verb in {"take", "drop", "use", "give", "eat", "drink"}:
            # Check for additional target (e.g., "give book to person")
            if len(parts) > 3 and parts[2] == "to":
                second_target = parts[3]
                if any('\u0600' <= c <= '\u06FF' for c in second_target):
                    second_target = self.format_farsi_text(second_target)
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
            items = [f"**{self.format_farsi_text(item.name_fa)}**" for item in room.items]
            response.append("You see: " + ", ".join(items))
            
        # List NPCs
        if room.npcs:
            npcs = [f"**{self.format_farsi_text(npc.name_fa)}**" for npc in room.npcs]
            response.append("Characters here: " + ", ".join(npcs))
            
        # List exits
        exits = list(room.exits.keys())
        response.append("Exits: " + ", ".join(exits))
        
        return "\n".join(response)
        
    def handle_inventory(self) -> str:
        """Handle inventory command."""
        if not self.state.player.inventory:
            return "Your inventory is empty."
            
        items = [f"**{self.format_farsi_text(item.name_fa)}**" for item in self.state.player.inventory]
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
        
        if direction not in current_room.exits:
            return f"You can't go {direction}."
            
        # Move to new room
        self.state.current_room_id = current_room.exits[direction]
        return self.handle_look()
        
    def handle_item_interaction(self, verb: str, target: str, second_target: str = None) -> str:
        """Handle item-related commands."""
        current_room = self.rooms[self.state.current_room_id]
        
        # Strip RTL marks for comparison
        target = target.lstrip('\u200F')
        if second_target:
            second_target = second_target.lstrip('\u200F')
        
        # Find target item
        room_item = next((i for i in current_room.items if i.name_fa == target), None)
        inv_item = next((i for i in self.state.player.inventory if i.name_fa == target), None)
        
        if verb == "take":
            if not room_item:
                return f"There is no **{self.format_farsi_text(target)}** here."
            if not room_item.is_portable:
                return f"You can't take the **{self.format_farsi_text(target)}**."
            current_room.items.remove(room_item)
            self.state.player.inventory.append(room_item)
            return f"You take the **{self.format_farsi_text(target)}**."
            
        elif verb == "drop":
            if not inv_item:
                return f"You don't have **{self.format_farsi_text(target)}**."
            self.state.player.inventory.remove(inv_item)
            current_room.items.append(inv_item)
            return f"You drop the **{self.format_farsi_text(target)}**."
            
        elif verb == "give":
            if not inv_item:
                return f"You don't have **{self.format_farsi_text(target)}**."
            if not second_target:
                return "Give to whom?"
            # Find target NPC
            npc = next((n for n in current_room.npcs if n.name_fa == second_target), None)
            if not npc:
                return f"There is no **{self.format_farsi_text(second_target)}** here."
            self.state.player.inventory.remove(inv_item)
            return f"You give the **{self.format_farsi_text(target)}** to **{self.format_farsi_text(second_target)}**."
            
        elif verb in {"eat", "drink"}:
            if not inv_item:
                return f"You don't have **{self.format_farsi_text(target)}**."
            if verb == "eat" and not inv_item.is_edible:
                return f"You can't eat the **{self.format_farsi_text(target)}**."
            if verb == "drink" and not inv_item.is_drinkable:
                return f"You can't drink the **{self.format_farsi_text(target)}**."
            self.state.player.inventory.remove(inv_item)
            return f"You {verb} the **{self.format_farsi_text(target)}**."
            
        return "Invalid command."
        
    def handle_object_interaction(self, verb: str, target: str) -> str:
        """Handle object-related commands."""
        current_room = self.rooms[self.state.current_room_id]
        
        # Strip RTL marks for comparison
        target = target.lstrip('\u200F')
        
        # Find target object
        obj = next((i for i in current_room.items if i.name_fa == target and not i.is_portable), None)
        
        if not obj:
            return f"You can't {verb} that."
            
        return f"You {verb} the **{self.format_farsi_text(target)}**."
