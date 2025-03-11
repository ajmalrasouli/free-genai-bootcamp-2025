from typing import Dict, Optional
from app.lib.models import Player, Room, Item, GameState
from app.lib.parser import CommandParser
from app.lib.vocabulary import VocabularyLoader
from app.lib.world_loader import WorldLoader

class GameEngine:
    def __init__(self, world_id: str):
        self.player = Player()
        self.vocab_loader = VocabularyLoader()
        self.world_loader = WorldLoader()
        self.parser = CommandParser()
        self.rooms = self.world_loader.get_world(world_id) or {}
        
        # Set starting room
        if self.rooms:
            self.player.location = list(self.rooms.keys())[0]

    def process_command(self, command: str) -> GameState:
        verb, target, recipient = self.parser.parse_command(command)
        
        command_handlers = {
            'look': self.handle_look,
            'take': self.handle_take,
            'drop': self.handle_drop,
            'inventory': self.handle_inventory,
            'move': self.handle_move,
            'talk': self.handle_talk,
            'use': self.handle_use,
            'help': self.handle_help
        }

        if verb in command_handlers:
            return command_handlers[verb](target, recipient)
        
        return self.create_game_state("Invalid command. Type 'help' for available commands.")

    def create_game_state(self, message: str) -> GameState:
        current_room = self.rooms.get(self.player.location)
        return GameState(
            player={"inventory": [item.__dict__ for item in self.player.inventory],
                   "learned_words": self.player.learned_words},
            current_room=current_room.__dict__ if current_room else {},
            message=message,
            available_commands=CommandParser.VALID_VERBS
        )

    # Command handlers
    def handle_look(self, target: Optional[str]) -> GameState:
        if not target:
            room = self.rooms.get(self.player.location)
            if room:
                return self.create_game_state(room.description)
        return self.create_game_state("You don't see that here.")

    def handle_take(self, target: Optional[str]) -> GameState:
        if not target:
            return self.create_game_state("What do you want to take?")
        
        room = self.rooms.get(self.player.location)
        if not room:
            return self.create_game_state("Error: Invalid room")

        for item in room.items:
            if item.name_fa == target:
                if item.is_portable:
                    room.items.remove(item)
                    self.player.inventory.append(item)
                    return self.create_game_state(f"You take the **{item.name_fa}**.")
                else:
                    return self.create_game_state("You can't take that.")

        return self.create_game_state("You don't see that here.")

    def handle_inventory(self) -> GameState:
        items = [f"**{item.name_fa}** ({item.name_en})" for item in self.player.inventory]
        if items:
            return self.create_game_state("You are carrying: " + ", ".join(items))
        return self.create_game_state("You are not carrying anything.")

    # Add new command handlers
    def handle_drop(self, target: Optional[str], recipient: Optional[str] = None) -> GameState:
        if not target:
            return self.create_game_state("What do you want to drop?")

        for item in self.player.inventory:
            if item.name_fa == target:
                self.player.inventory.remove(item)
                current_room = self.rooms.get(self.player.location)
                if current_room:
                    current_room.items.append(item)
                return self.create_game_state(f"You drop the **{item.name_fa}**.")

        return self.create_game_state("You don't have that item.")

    def handle_move(self, direction: Optional[str], recipient: Optional[str] = None) -> GameState:
        if not direction:
            return self.create_game_state("Which direction?")

        current_room = self.rooms.get(self.player.location)
        if not current_room:
            return self.create_game_state("Error: Invalid room")

        if direction in current_room.exits:
            self.player.location = current_room.exits[direction]
            return self.handle_look(None)

        return self.create_game_state("You can't go that way.")

    def handle_talk(self, target: Optional[str], recipient: Optional[str] = None) -> GameState:
        if not target:
            return self.create_game_state("Who do you want to talk to?")

        current_room = self.rooms.get(self.player.location)
        if not current_room:
            return self.create_game_state("Error: Invalid room")

        for npc in current_room.npcs:
            if npc.name_fa == target:
                # Add the NPC's vocabulary words to learned words
                self.player.learned_words.extend([word['word'] for word in npc.vocabulary])
                return self.create_game_state(f"You talk with **{npc.name_fa}** and learn some new words!")

        return self.create_game_state("There's no one here by that name.")

    def handle_help(self, target: Optional[str] = None, recipient: Optional[str] = None) -> GameState:
        commands = "\n".join([
            "Available commands:",
            "- look [item/direction]",
            "- take [item]",
            "- drop [item]",
            "- move [direction]",
            "- talk [person]",
            "- use [item] on [target]",
            "- inventory",
            "- help"
        ])
        return self.create_game_state(commands) 