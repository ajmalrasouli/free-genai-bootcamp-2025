"""Terminal UI for Farsi MUD using Textual."""
import hazm
import arabic_reshaper
from bidi.algorithm import get_display
from textual.app import App, ComposeResult
from textual.containers import Container, ScrollableContainer
from textual.widgets import Input, RichLog

class CommandInput(Input):
    """Command input with history."""
    
    DEFAULT_CSS = """
    CommandInput {
        margin: 1;
        height: 3;
    }
    """
    
    def __init__(self):
        # Set up normalizer first
        self.normalizer = hazm.Normalizer()
        # Initialize with Farsi placeholder
        placeholder = self.normalize_farsi("دستور را وارد کنید")
        super().__init__(placeholder=placeholder)
        self.history: list[str] = []
        self.history_index = 0
    
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
    
    def _on_change(self, value: str) -> None:
        """Handle input changes to process Farsi text."""
        if not value:
            super()._on_change(value)
            return
            
        # Split into words and process according to command grammar
        words = value.split()
        if len(words) >= 2:
            # Process Farsi target word
            if any('\u0600' <= c <= '\u06FF' for c in words[1]):
                words[1] = self.normalize_farsi(words[1])
            
            # Process second Farsi word if present
            if len(words) > 3 and words[2] in {'on', 'to'} and any('\u0600' <= c <= '\u06FF' for c in words[3]):
                words[3] = self.normalize_farsi(words[3])
            
            value = " ".join(words)
                
        super()._on_change(value)

class GameLog(RichLog):
    """Game output display widget."""
    
    DEFAULT_CSS = """
    GameLog {
        margin: 1;
    }
    """
    
    def __init__(self):
        super().__init__()
        self.normalizer = hazm.Normalizer()
    
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
    
    def write_game_text(self, text: str) -> None:
        """Write text to display with proper RTL support."""
        if not text:
            return
            
        # Process each line separately
        lines = text.split('\n')
        processed_lines = []
        
        for line in lines:
            # Split line into words
            words = line.split()
            processed_words = []
            
            for word in words:
                if word.startswith('**') and word.endswith('**'):
                    # Process Farsi word in markers
                    farsi = word[2:-2]
                    processed_words.append(f"**{self.normalize_farsi(farsi)}**")
                elif any('\u0600' <= c <= '\u06FF' for c in word):
                    # Process other Farsi words
                    processed_words.append(self.normalize_farsi(word))
                else:
                    processed_words.append(word)
            
            processed_lines.append(" ".join(processed_words))
        
        # Write processed text
        self.write("\n".join(processed_lines))

class GameUI(App):
    """Main game UI application."""
    
    CSS = """
    Screen {
        layout: grid;
        grid-size: 1;
        grid-rows: 1fr auto;
    }
    
    #input-container {
        height: auto;
        margin: 1;
    }
    """
    
    def __init__(self, engine):
        super().__init__()
        self.engine = engine
        self.game_log = GameLog()
        self.command_input = CommandInput()
    
    def compose(self) -> ComposeResult:
        """Create child widgets."""
        with ScrollableContainer():
            yield self.game_log
        with Container(id="input-container"):
            yield self.command_input
    
    def on_mount(self) -> None:
        """Handle app mount."""
        self.command_input.focus()
        response = self.engine.process_command("look")
        self.game_log.write_game_text(response)
    
    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle command input."""
        command = event.value.strip()
        if command:
            # Add command to history
            self.command_input.history.append(command)
            self.command_input.history_index = len(self.command_input.history)
            # Show command with proper RTL formatting
            self.game_log.write_game_text(f"> {command}")
            # Process command
            response = self.engine.process_command(command)
            self.game_log.write_game_text(response)
            # Clear input
            self.command_input.value = ""
