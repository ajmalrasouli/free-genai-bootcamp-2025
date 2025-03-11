from textual.app import App
from textual.widgets import Header, Footer, Input, ScrollView
from textual.containers import Container
from rich.text import Text
from rich.panel import Panel
from rich import box
import asyncio
import aiohttp

class GameUI(App):
    CSS = """
    Screen {
        layout: grid;
        grid-size: 2;
        grid-rows: 1fr 10;
    }

    .output {
        width: 100%;
        height: 100%;
        background: $surface;
        color: $text;
        border: solid $primary;
        padding: 1;
    }

    .input {
        dock: bottom;
        margin: 1;
    }
    """

    BINDINGS = [
        ("ctrl+q", "quit", "Quit"),
        ("ctrl+h", "show_help", "Help"),
    ]

    def __init__(self):
        super().__init__()
        self.session_id = None
        self.output_text = []

    async def on_mount(self) -> None:
        # Create UI elements
        self.output = ScrollView(classes="output")
        self.input = Input(placeholder="Enter command...", classes="input")
        
        # Add widgets to the app
        await self.view.dock(Header())
        await self.view.dock(self.output)
        await self.view.dock(self.input, edge="bottom", size=3)
        await self.view.dock(Footer())

        # Start new game
        await self.start_new_game()

    async def start_new_game(self):
        async with aiohttp.ClientSession() as session:
            async with session.post('http://localhost:8000/game/new?world_id=cafe-world') as response:
                data = await response.json()
                self.session_id = data['session_id']
                await self.update_output(data['game_state']['message'])

    async def update_output(self, message: str):
        self.output_text.append(Text(message))
        await self.output.update(Panel("\n".join([str(t) for t in self.output_text]), 
                                     box=box.ROUNDED,
                                     title="Game Output"))

    async def on_input_submitted(self, message: Input.Submitted) -> None:
        command = message.value
        self.input.value = ""

        if not command:
            return

        # Echo the command
        await self.update_output(f"> {command}")

        # Send command to server
        async with aiohttp.ClientSession() as session:
            async with session.post('http://localhost:8000/game/command', 
                                  json={
                                      "session_id": self.session_id,
                                      "command": command
                                  }) as response:
                data = await response.json()
                await self.update_output(data['message'])

    async def action_show_help(self) -> None:
        help_text = """
        Available Commands:
        - look [item/direction]
        - take [item]
        - drop [item]
        - move [direction]
        - talk [person]
        - use [item] on [target]
        - inventory
        - help
        
        Press Ctrl+Q to quit
        """
        await self.update_output(help_text)

def run_game():
    app = GameUI()
    app.run() 