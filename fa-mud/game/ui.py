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
        # Initialize with Farsi placeholder
        farsi_text = "دستور را وارد کنید"
        normalized = hazm.Normalizer().normalize(farsi_text)
        reshaped = arabic_reshaper.reshape(normalized)
        bidi_text = get_display(reshaped)
        super().__init__(placeholder=bidi_text)
        self.history: list[str] = []
        self.history_index = 0
        self.normalizer = hazm.Normalizer()
    
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
                normalized = self.normalizer.normalize(words[1])
                reshaped = arabic_reshaper.reshape(normalized)
                words[1] = get_display(reshaped)
            
            # Process second Farsi word if present
            if len(words) > 3 and words[2] in {'on', 'to'} and any('\u0600' <= c <= '\u06FF' for c in words[3]):
                normalized = self.normalizer.normalize(words[3])
                reshaped = arabic_reshaper.reshape(normalized)
                words[3] = get_display(reshaped)
            
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
                    normalized = self.normalizer.normalize(farsi)
                    reshaped = arabic_reshaper.reshape(normalized)
                    processed_words.append(f"**{get_display(reshaped)}**")
                elif any('\u0600' <= c <= '\u06FF' for c in word):
                    # Process other Farsi words
                    normalized = self.normalizer.normalize(word)
                    reshaped = arabic_reshaper.reshape(normalized)
                    processed_words.append(get_display(reshaped))
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
            # Show command
            self.game_log.write_game_text(f"> {command}")
            # Process command
            response = self.engine.process_command(command)
            self.game_log.write_game_text(response)
            # Clear input
            self.command_input.value = ""
