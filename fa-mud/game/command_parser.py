"""Command parser for Farsi MUD game."""
import re
from typing import Dict, Optional, Tuple
import hazm
import arabic_reshaper
from bidi.algorithm import get_display

from .models import Room, Player

class CommandParser:
    """Parses and validates user commands."""
    
    VALID_VERBS = {
        'look', 'move', 'take', 'drop', 'talk', 'use', 'give',
        'open', 'close', 'eat', 'inventory', 'drink', 'help'
    }
    
    def __init__(self):
        """Initialize command parser."""
        self.normalizer = hazm.Normalizer()
        # Command pattern: [Verb] [Farsi Word] (on/to [Farsi Word])?
        self.command_pattern = re.compile(
            r'^(?P<verb>\w+)\s+(?P<target>[^\s]+)(?:\s+(on|to)\s+(?P<recipient>[^\s]+))?$'
        )

    def normalize_farsi(self, text: str) -> str:
        """Normalize Farsi text for consistent processing."""
        if not text:
            return text
        # Remove any existing RTL marks
        text = text.replace('\u200F', '').replace('\u200E', '')
        # Normalize using hazm
        text = self.normalizer.normalize(text)
        # Reshape Arabic/Farsi characters
        text = arabic_reshaper.reshape(text)
        # Add RTL mark and apply BIDI algorithm
        return '\u200F' + get_display(text)
    
    def parse_command(self, command: str) -> Optional[Dict[str, str]]:
        """Parse a command string into components."""
        command = command.strip().lower()
        
        # Handle special commands
        if command in {'inventory', 'help'}:
            return {'verb': command}
            
        # Parse regular commands
        match = self.command_pattern.match(command)
        if not match:
            return None
            
        components = match.groupdict()
        
        # Validate verb
        if components['verb'] not in self.VALID_VERBS:
            return None
            
        # Normalize Farsi words
        if components.get('target'):
            components['target'] = self.normalize_farsi(components['target'])
        if components.get('recipient'):
            components['recipient'] = self.normalize_farsi(components['recipient'])
            
        return components
    
    def validate_command_context(
        self,
        components: Dict[str, str],
        current_room: Room,
        player: Player
    ) -> Tuple[bool, str]:
        """Validate command in game context."""
        verb = components['verb']
        target = components.get('target')
        recipient = components.get('recipient')
        
        # Special commands need no validation
        if verb in {'inventory', 'help'}:
            return True, ""

        # Normalize target and recipient for comparison
        if target:
            target = self.normalize_farsi(target)
        if recipient:
            recipient = self.normalize_farsi(recipient)
            
        # Validate target exists
        if verb == 'look':
            visible_objects = {self.normalize_farsi(obj) for obj in current_room.get_visible_objects()}
            if target and target not in visible_objects:
                return False, f"You don't see any {target} here."
            return True, ""
            
        # Validate movement
        if verb == 'move':
            normalized_exits = {self.normalize_farsi(exit) for exit in current_room.exits}
            if target not in normalized_exits:
                return False, f"You can't go {target}."
            return True, ""
            
        # Validate item interactions
        if verb in {'take', 'drop', 'use', 'give'}:
            if verb == 'take':
                room_items = {self.normalize_farsi(i.name_fa) for i in current_room.items}
                if target not in room_items:
                    return False, f"There is no {target} here."
            elif verb == 'drop':
                inventory_items = {self.normalize_farsi(i.name_fa) for i in player.inventory}
                if target not in inventory_items:
                    return False, f"You don't have {target}."
            elif verb == 'use':
                inventory_items = {self.normalize_farsi(i.name_fa) for i in player.inventory}
                if target not in inventory_items:
                    return False, f"You don't have {target}."
                if recipient:
                    usable_items = {self.normalize_farsi(i.name_fa) for i in current_room.items if i.is_usable}
                    if recipient not in usable_items:
                        return False, f"You can't use that on {recipient}."
            elif verb == 'give':
                inventory_items = {self.normalize_farsi(i.name_fa) for i in player.inventory}
                if target not in inventory_items:
                    return False, f"You don't have {target}."
                if recipient:
                    npc_names = {self.normalize_farsi(n.name_fa) for n in current_room.npcs}
                    if recipient not in npc_names:
                        return False, f"There is no {recipient} here."
                    
        # Validate object interactions
        if verb in {'open', 'close'}:
            static_items = {self.normalize_farsi(i.name_fa) for i in current_room.items if not i.is_portable}
            if target not in static_items:
                return False, f"You can't {verb} {target}."
                
        # Validate consumption
        if verb in {'eat', 'drink'}:
            inventory_items = {self.normalize_farsi(i.name_fa) for i in player.inventory}
            if target not in inventory_items:
                return False, f"You don't have {target}."
            item = next((i for i in player.inventory if self.normalize_farsi(i.name_fa) == target), None)
            if verb == 'eat' and not item.is_edible:
                return False, f"You can't eat {target}."
            if verb == 'drink' and not item.is_drinkable:
                return False, f"You can't drink {target}."
                
        return True, ""
