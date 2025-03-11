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
        # Command pattern: verb + target [+ preposition + recipient]
        self.command_pattern = re.compile(
            r'^(?P<verb>\w+)\s+(?P<target>\S+)(?:\s+(on|to)\s+(?P<recipient>\S+))?$'
        )
    
    def parse_command(self, command: str) -> Optional[Dict[str, str]]:
        """Parse a command string into components.
        
        Args:
            command: Raw command string from user
            
        Returns:
            Dictionary with parsed components or None if invalid
        """
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
            
        # Process Farsi text in target and recipient
        if components.get('target'):
            components['target'] = self._process_farsi_text(components['target'])
        if components.get('recipient'):
            components['recipient'] = self._process_farsi_text(components['recipient'])
            
        return components
    
    def validate_command_context(
        self,
        components: Dict[str, str],
        current_room: Room,
        player: Player
    ) -> Tuple[bool, str]:
        """Validate command in game context.
        
        Args:
            components: Parsed command components
            current_room: Player's current room
            player: Player object
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        verb = components['verb']
        target = components.get('target')
        recipient = components.get('recipient')
        
        # Special commands need no validation
        if verb in {'inventory', 'help'}:
            return True, ""
            
        # Validate target exists
        if verb == 'look':
            if target and target not in current_room.get_visible_objects():
                return False, f"You don't see any **{target}** here."
            return True, ""
            
        # Validate movement
        if verb == 'move':
            if target not in current_room.exits:
                return False, f"You can't go {target}."
            return True, ""
            
        # Validate item interactions
        if verb in {'take', 'drop', 'use', 'give'}:
            if verb == 'take':
                if not any(i.name_fa == target for i in current_room.items):
                    return False, f"There is no **{target}** here."
            elif verb == 'drop':
                if not any(i.name_fa == target for i in player.inventory):
                    return False, f"You don't have **{target}**."
            elif verb == 'use':
                if not any(i.name_fa == target for i in player.inventory):
                    return False, f"You don't have **{target}**."
                if recipient and not any(i.name_fa == recipient and i.is_usable for i in current_room.items):
                    return False, f"You can't use that on **{recipient}**."
            elif verb == 'give':
                if not any(i.name_fa == target for i in player.inventory):
                    return False, f"You don't have **{target}**."
                if not any(n.name_fa == recipient for n in current_room.npcs):
                    return False, f"There is no **{recipient}** here."
                    
        # Validate object interactions
        if verb in {'open', 'close'}:
            if not any(i.name_fa == target and not i.is_portable for i in current_room.items):
                return False, f"You can't {verb} **{target}**."
                
        # Validate consumption
        if verb in {'eat', 'drink'}:
            item = player.get_item(target)
            if not item:
                return False, f"You don't have **{target}**."
            if verb == 'eat' and not item.is_edible:
                return False, f"You can't eat **{target}**."
            if verb == 'drink' and not item.is_drinkable:
                return False, f"You can't drink **{target}**."
                
        return True, ""
        
    def _process_farsi_text(self, text: str) -> str:
        """Process Farsi text for proper RTL display."""
        # Normalize and reshape Farsi text
        normalized = self.normalizer.normalize(text)
        reshaped = arabic_reshaper.reshape(normalized)
        # Add RTL mark
        return f"\u200F{reshaped}"
