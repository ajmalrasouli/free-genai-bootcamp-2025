"""Terminal UI for Farsi MUD using Textual."""
from typing import List
import hazm
import arabic_reshaper
from bidi.algorithm import get_display
from textual.app import App, ComposeResult
from textual.containers import Container, ScrollableContainer
from textual.widgets import Input, RichLog, Static

class CommandInput(Input):
    """Command input with history."""
    
    DEFAULT_CSS = """
    CommandInput {
        background: $surface-lighten-2;
        color: $text;
        padding: 0 1;
        border: none;
        height: 1;
        content-align: right middle;
        text-align: right;
        dir: rtl;
    }
    
    CommandInput:focus {
        border: tall $accent;
    }
    """
    
    def __init__(self):
        # Process placeholder text for RTL
        farsi_text = "دستور را وارد کنید"
        normalized = hazm.Normalizer().normalize(farsi_text)
        reshaped = arabic_reshaper.reshape(normalized)
        bidi_text = get_display(reshaped)
        placeholder = f"\u200F{bidi_text}"  # Add RTL mark before Farsi text
        
        super().__init__(placeholder=placeholder)
        self.history: list[str] = []
        self.history_index = 0
        self.normalizer = hazm.Normalizer()
        
    def _process_farsi_text(self, text: str) -> str:
        """Process Farsi text for proper RTL display."""
        if not text:
            return text
            
        # Split text into words
        words = text.split()
        processed_words = []
        
        for word in words:
            # Check if word contains Farsi characters
            if any('\u0600' <= c <= '\u06FF' for c in word):
                # Process Farsi word
                normalized = self.normalizer.normalize(word)
                reshaped = arabic_reshaper.reshape(normalized)
                bidi_text = get_display(reshaped)
                processed_words.append(f"\u200F{bidi_text}")
            else:
                processed_words.append(word)
        
        # Join words and ensure RTL for mixed text
        processed_text = " ".join(processed_words)
        if any('\u0600' <= c <= '\u06FF' for c in processed_text):
            return f"\u200F{processed_text}"
        return processed_text
    
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
    
    def _on_change(self, value: str) -> None:
        """Handle input changes to process Farsi text."""
        # Process the text for RTL display
        processed_text = self._process_farsi_text(value)
        # Only update if the processed text is different
        if processed_text != value:
            self.value = processed_text
        super()._on_change(processed_text)

class GameLog(RichLog):
    """Game output display widget."""
    
    DEFAULT_CSS = """
    GameLog {
        background: $surface;
        color: $text;
        border: solid $primary;
        height: 1fr;
        margin: 0 1;
        padding: 0 1;
        border-title-align: center;
        border-title-color: $accent;
        border-title-background: $primary;
        border-subtitle-align: center;
        text-align: right;
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
            # Find Farsi words between ** markers
            words = line.split()
            processed_words = []
            
            for word in words:
                if word.startswith('**') and word.endswith('**'):
                    # Process Farsi word
                    farsi = word[2:-2]
                    normalized = self.normalizer.normalize(farsi)
                    reshaped = arabic_reshaper.reshape(normalized)
                    bidi_text = get_display(reshaped)
                    processed_words.append(f"**\u200F{bidi_text}**")
                else:
                    processed_words.append(word)
            
            processed_line = " ".join(processed_words)
            # Add RTL mark if line contains Farsi
            if any('\u0600' <= c <= '\u06FF' for c in processed_line):
                processed_line = f"\u200F{processed_line}"
            processed_lines.append(processed_line)
        
        # Write processed text
        self.write("\n".join(processed_lines))

class GameUI(App):
    """Main game UI application."""
    
    CSS = """
    Screen {
        layout: grid;
        grid-size: 1;
        grid-rows: 1fr auto;
        background: $surface;
    }
    
    GameLog {
        width: 100%;
        height: 100%;
    }
    
    #input-container {
        height: auto;
        background: $surface-lighten-2;
        border-top: solid $primary;
        padding: 0 1;
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
        # Focus command input
        self.command_input.focus()
        # Show initial room description
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
