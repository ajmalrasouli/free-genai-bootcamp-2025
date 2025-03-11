"""Terminal UI for Farsi MUD using Textual."""
from textual.app import App, ComposeResult
from textual.containers import Container, ScrollableContainer
from textual.widgets import Input, Label, RichLog
from textual.binding import Binding
from textual.reactive import reactive
from rich.text import Text
import re

from .engine import GameEngine
from .vocabulary_loader import VocabularyLoader

def format_rtl_text(text: str) -> str:
    """Format text with proper RTL support for Farsi words."""
    # Match Farsi words between ** markers
    pattern = r'\*\*([\u0600-\u06FF\s]+)\*\*'
    
    # Join Farsi characters with zero-width non-joiner
    def join_farsi(match):
        word = match.group(1)
        # Add RTL mark before and LTR mark after
        return f"\u200F{word}\u200E"
    
    return re.sub(pattern, join_farsi, text)

class GameDisplay(ScrollableContainer):
    """Main game display area."""
    
    def compose(self) -> ComposeResult:
        """Create child widgets."""
        yield RichLog(wrap=True, markup=True)
        
    def write(self, text: str) -> None:
        """Write text to the display with RTL support."""
        formatted_text = format_rtl_text(text)
        # Create styled text with proper RTL support
        styled_text = Text()
        
        # Split on ** markers to handle Farsi and non-Farsi text
        parts = re.split(r'(\u200F[\u0600-\u06FF\s]+\u200E)', formatted_text)
        for part in parts:
            if part.startswith('\u200F') and part.endswith('\u200E'):
                # Farsi text - add with bold style
                styled_text.append(part[1:-1], style="bold")
            else:
                # Non-Farsi text - add as is
                styled_text.append(part)
        
        self.query_one(RichLog).write(styled_text)

class CommandInput(Input):
    """Command input with history."""
    
    def __init__(self):
        super().__init__(placeholder="Enter command...")
        self.history: list[str] = []
        self.history_index = 0
        
    def on_key(self, event) -> None:
        """Handle key events for command history."""
        if event.key == "up":
            if self.history and self.history_index > 0:
                self.history_index -= 1
                self.value = self.history[self.history_index]
        elif event.key == "down":
            if self.history_index < len(self.history) - 1:
                self.history_index += 1
                self.value = self.history[self.history_index]
            else:
                self.history_index = len(self.history)
                self.value = ""

class GameUI(App):
    """Main game UI application."""
    
    CSS = """
    GameDisplay {
        height: 1fr;
        border: solid green;
        background: $surface;
        padding: 1;
        color: $text;
    }
    
    CommandInput {
        dock: bottom;
        border: solid green;
        background: $surface-lighten-2;
        color: $text;
    }
    
    Label {
        padding: 1;
        color: $text;
        text-align: center;
        background: $primary;
    }
    """
    
    BINDINGS = [
        Binding("ctrl+c,ctrl+q", "quit", "Quit"),
        Binding("ctrl+s", "save_game", "Save"),
        Binding("ctrl+l", "load_game", "Load")
    ]
    
    def __init__(self, engine: GameEngine):
        super().__init__()
        self.engine = engine
        
    def compose(self) -> ComposeResult:
        """Create child widgets."""
        yield Label("Farsi Text Adventure MUD")
        yield GameDisplay()
        yield CommandInput()
        
    def on_mount(self) -> None:
        """Handle app mount event."""
        # Show initial room description
        self.handle_command("look")
        
    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle command input."""
        command = event.value.strip()
        if command:
            # Add to history
            input_widget = self.query_one(CommandInput)
            input_widget.history.append(command)
            input_widget.history_index = len(input_widget.history)
            input_widget.value = ""
            
            # Process command
            self.handle_command(command)
            
    def handle_command(self, command: str) -> None:
        """Process command and display response."""
        response = self.engine.process_command(command)
        display = self.query_one(GameDisplay)
        
        # Format command echo
        if command != "look":  # Don't echo initial look command
            display.write(f"\n> {command}")
            
        # Format response with proper RTL support
        display.write(f"\n{response}\n")
        
    def action_save_game(self) -> None:
        """Save game state."""
        try:
            self.engine.state.save_game("savegame.json")
            self.notify("Game saved successfully")
        except Exception as e:
            self.notify(f"Error saving game: {e}", severity="error")
            
    def action_load_game(self) -> None:
        """Load game state."""
        try:
            self.engine.state.load_game("savegame.json", self.engine.vocab)
            self.notify("Game loaded successfully")
            # Show new room
            self.handle_command("look")
        except Exception as e:
            self.notify(f"Error loading game: {e}", severity="error")
