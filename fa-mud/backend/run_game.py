import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ui.game_ui import run_game

if __name__ == "__main__":
    run_game()