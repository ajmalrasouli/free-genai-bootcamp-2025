"""Game engine for Farsi MUD."""
import random
from typing import Dict, List, Optional, Tuple

from .models import GameState, Item, NPC, Room
from .vocabulary_loader import VocabularyLoader
from .command_parser import CommandParser

class GameEngine:
    """Main game engine that processes commands and manages game state."""
    
    def __init__(self, vocabulary_loader: VocabularyLoader):
        self.vocab = vocabulary_loader
        self.parser = CommandParser()
        self.state = GameState()
        self.response_gen = ResponseGenerator()
        
    def process_command(self, command: str) -> str:
        """Process a user command and return response.
        
        Args:
            command: Raw command string from user
            
        Returns:
            Response string with exactly one Farsi word
        """
        # Parse command
        components = self.parser.parse_command(command)
        if not components:
            return self.response_gen.get_error_response("I don't understand that command.")
            
        # Validate in current context
        is_valid, error = self.parser.validate_command_context(
            components,
            self.state.current_room,
            self.state.player
        )
        if not is_valid:
            return self.response_gen.get_error_response(error)
            
        # Process command
        return self._execute_command(components)
    
    def _execute_command(self, components: Dict[str, str]) -> str:
        """Execute a validated command.
        
        Args:
            components: Parsed command components
            
        Returns:
            Response string with exactly one Farsi word
        """
        verb = components['verb']
        target = components.get('target')
        recipient = components.get('recipient')
        
        if verb == 'look':
            if not target:
                return self.response_gen.describe_room(self.state.current_room)
            return self.response_gen.describe_object(target, self.state.current_room)
            
        elif verb == 'inventory':
            return self.response_gen.list_inventory(self.state.player)
            
        elif verb == 'help':
            return self.response_gen.get_help_text()
            
        elif verb == 'move':
            new_room_id = self.state.current_room.exits.get(target)
            if new_room_id:
                self.state.current_room_id = new_room_id
                return self.response_gen.describe_room(self.state.current_room)
                
        elif verb == 'take':
            item = next((i for i in self.state.current_room.items 
                        if i.name_fa == target), None)
            if item and item.is_portable:
                self.state.current_room.items.remove(item)
                self.state.player.inventory.append(item)
                self.state.player.learned_words.add(target)
                return self.response_gen.get_take_response(item)
                
        elif verb == 'drop':
            item = next((i for i in self.state.player.inventory 
                        if i.name_fa == target), None)
            if item:
                self.state.player.inventory.remove(item)
                self.state.current_room.items.append(item)
                return self.response_gen.get_drop_response(item)
                
        elif verb in {'eat', 'drink'}:
            item = next((i for i in self.state.player.inventory 
                        if i.name_fa == target), None)
            if item:
                if (verb == 'eat' and not item.is_edible) or (verb == 'drink' and not item.is_drinkable):
                    return self.response_gen.get_error_response(f"You can't {verb} that!")
                self.state.player.inventory.remove(item)
                return self.response_gen.get_consume_response(item, verb)
                
        elif verb == 'use':
            item = next((i for i in self.state.player.inventory 
                        if i.name_fa == target), None)
            if item and recipient:
                target_obj = next((i for i in self.state.current_room.items 
                                 if i.name_fa == recipient), None)
                if target_obj:
                    return self.response_gen.get_use_response(item, target_obj)
                    
        elif verb == 'give':
            item = next((i for i in self.state.player.inventory 
                        if i.name_fa == target), None)
            if item and recipient:
                npc = next((n for n in self.state.current_room.npcs 
                          if n.name_fa == recipient), None)
                if npc:
                    self.state.player.inventory.remove(item)
                    return self.response_gen.get_give_response(item, npc)
                    
        elif verb == 'talk':
            npc = next((n for n in self.state.current_room.npcs 
                       if n.name_fa == target), None)
            if npc:
                return self.response_gen.get_talk_response(npc)
                    
        return self.response_gen.get_error_response("Something went wrong.")
        
    def generate_room(self, room_id: str, exits: Dict[str, str]) -> Room:
        """Generate a new room with random Farsi vocabulary.
        
        Args:
            room_id: Unique room identifier
            exits: Dictionary of exit directions and destination room IDs
            
        Returns:
            Generated Room object
        """
        room = Room(room_id)
        room.exits = exits
        
        # Add random items (2-4)
        num_items = random.randint(2, 4)
        nouns = self.vocab.get_words_by_pos('noun')
        for _ in range(num_items):
            word_data = random.choice(nouns)
            if word_data['word'] not in self.state.player.learned_words:
                item = Item(word_data)
                room.items.append(item)
                
        # Add random NPC (30% chance)
        if random.random() < 0.3:
            word_data = random.choice(nouns)  # Use noun for NPC name
            if word_data['word'] not in self.state.player.learned_words:
                npc = NPC(word_data)
                room.npcs.append(npc)
                
        return room

class ResponseGenerator:
    """Generates response strings with exactly one Farsi word per response."""
    
    def __init__(self):
        self.room_templates = [
            "You are in {room}. You see {item}.",
            "A {room} surrounds you. There's {item} here.",
            "You've entered {room}. {item} catches your eye."
        ]
        self.item_templates = [
            "You see a **{farsi}** ({english}).",
            "There's a **{farsi}** ({english}) here.",
            "A **{farsi}** ({english}) is visible."
        ]
        self.npc_templates = [
            "The **{farsi}** ({english}) says: {dialogue}",
            "**{farsi}** ({english}) tells you: {dialogue}",
            "You talk to **{farsi}** ({english}): {dialogue}"
        ]
        
    def describe_room(self, room: Room) -> str:
        """Generate room description with one Farsi word."""
        template = random.choice(self.room_templates)
        
        # Choose one item or NPC to feature in Farsi
        visible = room.items + room.npcs
        if not visible:
            return "You are in an empty room."
            
        featured = random.choice(visible)
        description = template.format(
            room=room.name,
            item=f"a **{featured.name_fa}** ({featured.name_en})"
        )
        
        # Add exits
        if room.exits:
            exits = ", ".join(room.exits.keys())
            description += f"\nExits: {exits}"
            
        return description
        
    def describe_object(self, target: str, room: Room) -> str:
        """Generate object description with one Farsi word."""
        # Check items
        for item in room.items:
            if item.name_fa == target:
                template = random.choice(self.item_templates)
                return template.format(
                    farsi=item.name_fa,
                    english=item.name_en
                )
        
        # Check NPCs
        for npc in room.npcs:
            if npc.name_fa == target:
                template = random.choice(self.item_templates)
                return template.format(
                    farsi=npc.name_fa,
                    english=npc.name_en
                )
                
        return f"You don't see any {target} here."
        
    def list_inventory(self, player: 'Player') -> str:
        """List inventory items with one Farsi word."""
        if not player.inventory:
            return "Your inventory is empty."
            
        # Feature one random item in Farsi
        item = random.choice(player.inventory)
        others = len(player.inventory) - 1
        
        if others == 0:
            return f"You are carrying a **{item.name_fa}** ({item.name_en})."
        else:
            return f"You are carrying a **{item.name_fa}** ({item.name_en}) and {others} other items."
            
    def get_help_text(self) -> str:
        """Get help text with command examples."""
        return (
            "Available commands:\n"
            "- Look [at something]\n"
            "- Take/Drop **شیء** (item)\n"
            "- Use **شیء** on **هدف** (item on target)\n"
            "- Give **شیء** to **شخص** (item to person)\n"
            "- Talk to **شخص** (person)\n"
            "- Move [direction]\n"
            "- Eat/Drink **غذا** (food/drink)\n"
            "- Inventory\n"
            "- Help"
        )
        
    def get_error_response(self, message: str) -> str:
        """Get error message without Farsi words."""
        return message
        
    def get_take_response(self, item: Item) -> str:
        """Get response for taking an item."""
        return f"You pick up the **{item.name_fa}** ({item.name_en})."
        
    def get_drop_response(self, item: Item) -> str:
        """Get response for dropping an item."""
        return f"You drop the **{item.name_fa}** ({item.name_en})."
        
    def get_consume_response(self, item: Item, verb: str) -> str:
        """Get response for eating/drinking an item."""
        return f"You {verb} the **{item.name_fa}** ({item.name_en})."
        
    def get_use_response(self, item: Item, target: Item) -> str:
        """Get response for using an item on a target."""
        return f"You use the **{item.name_fa}** ({item.name_en}) on the {target.name_en}."
        
    def get_give_response(self, item: Item, npc: NPC) -> str:
        """Get response for giving an item to an NPC."""
        return f"You give the **{item.name_fa}** ({item.name_en}) to the {npc.name_en}."
        
    def get_talk_response(self, npc: NPC) -> str:
        """Get response for talking to an NPC."""
        template = random.choice(self.npc_templates)
        dialogue = random.choice(npc.dialogue) if npc.dialogue else "..."
        return template.format(
            farsi=npc.name_fa,
            english=npc.name_en,
            dialogue=dialogue
        )
