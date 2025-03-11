import re
from typing import Optional, Tuple

class CommandParser:
    VALID_VERBS = ['look', 'move', 'take', 'drop', 'talk', 'use', 'give', 
                   'open', 'close', 'eat', 'inventory', 'drink', 'help']

    @staticmethod
    def parse_command(command: str) -> Tuple[str, Optional[str], Optional[str]]:
        # Regex pattern for command parsing
        pattern = r'^(?P<verb>\w+)\s*(?P<target>\S+)?(?:\s+(?:on|to)\s+(?P<recipient>\S+))?$'
        
        match = re.match(pattern, command.lower().strip())
        if not match:
            return ('invalid', None, None)

        verb = match.group('verb')
        target = match.group('target')
        recipient = match.group('recipient')

        if verb not in CommandParser.VALID_VERBS:
            return ('invalid', None, None)

        return (verb, target, recipient)

    @staticmethod
    def validate_farsi(word: str) -> bool:
        # Basic Farsi character validation
        farsi_pattern = r'^[\u0600-\u06FF\s]+$'
        return bool(re.match(farsi_pattern, word)) 