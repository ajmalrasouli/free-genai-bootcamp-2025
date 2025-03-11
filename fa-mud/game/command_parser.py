"""Command parser for Farsi MUD game."""
import re
from typing import Dict, Optional, Tuple

class CommandParser:
    """Parses and validates user commands."""
    
    VALID_VERBS = {
        'look', 'move', 'take', 'drop', 'talk', 'use', 'give',
        'open', 'close', 'eat', 'inventory', 'drink', 'help'
    }
    
    def __init__(self):
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
            
        return components
    
    def validate_command_context(
        self,
        components: Dict[str, str],
        current_room: 'Room',
        player: 'Player'
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
                return False, f"You don't see any {target} here."
            return True, ""
            
        # Validate movement
        if verb == 'move':
            if target not in current_room.exits:
                return False, f"You can't go {target}."
            return True, ""
            
        # Validate item interactions
        if verb in {'take', 'drop', 'use', 'give'}:
            if verb == 'take':
                if target not in current_room.items:
                    return False, f"There is no {target} here."
            elif verb == 'drop':
                if target not in player.inventory:
                    return False, f"You don't have {target}."
            elif verb == 'use':
                if target not in player.inventory:
                    return False, f"You don't have {target}."
                if recipient and recipient not in current_room.get_usable_objects():
                    return False, f"You can't use that on {recipient}."
            elif verb == 'give':
                if target not in player.inventory:
                    return False, f"You don't have {target}."
                if recipient not in current_room.npcs:
                    return False, f"There is no {recipient} here."
                    
        # Validate object interactions
        if verb in {'open', 'close'}:
            if target not in current_room.get_interactable_objects():
                return False, f"You can't {verb} that."
                
        # Validate consumption
        if verb in {'eat', 'drink'}:
            if target not in player.inventory:
                return False, f"You don't have {target}."
            item = player.get_item(target)
            if verb == 'eat' and not item.is_edible:
                return False, f"You can't eat that."
            if verb == 'drink' and not item.is_drinkable:
                return False, f"You can't drink that."
                
        return True, ""
