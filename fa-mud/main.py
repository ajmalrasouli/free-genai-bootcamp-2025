"""Main entry point for Farsi MUD game."""
from game.vocabulary_loader import VocabularyLoader
from game.engine import GameEngine
from game.ui import GameUI
from game.models import Room, Item, NPC

def create_default_rooms():
    """Create default game rooms."""
    rooms = {}
    
    # Create library
    library = Room("library")
    library.name = "Library"
    library.description = "You are in a quiet library. A **کتاب** sits on the **میز**."
    library.exits = {"north": "garden", "east": "dining"}
    rooms[library.id] = library
    
    # Create garden
    garden = Room("garden")
    garden.name = "Garden"
    garden.description = "A peaceful garden with a tall **درخت**. A **سیب** hangs from a branch."
    garden.exits = {"south": "library", "east": "bedroom"}
    rooms[garden.id] = garden
    
    # Create dining room
    dining = Room("dining")
    dining.name = "Dining Room"
    dining.description = "A cozy dining room with fresh **نان** on the **میز**."
    dining.exits = {"west": "library", "north": "bedroom"}
    rooms[dining.id] = dining
    
    # Create bedroom
    bedroom = Room("bedroom")
    bedroom.name = "Bedroom"
    bedroom.description = "A comfortable bedroom with a soft **تخت** and a warm **چراغ**."
    bedroom.exits = {"south": "dining", "west": "garden"}
    rooms[bedroom.id] = bedroom
    
    # Add items to rooms
    library.items = [
        Item({"word": "کتاب", "translation": "book"}),
        Item({"word": "میز", "translation": "table", "is_portable": False})
    ]
    
    garden.items = [
        Item({"word": "درخت", "translation": "tree", "is_portable": False}),
        Item({"word": "سیب", "translation": "apple", "is_edible": True})
    ]
    
    dining.items = [
        Item({"word": "نان", "translation": "bread", "is_edible": True}),
        Item({"word": "میز", "translation": "table", "is_portable": False}),
        Item({"word": "چای", "translation": "tea", "is_drinkable": True})
    ]
    
    bedroom.items = [
        Item({"word": "تخت", "translation": "bed", "is_portable": False}),
        Item({"word": "چراغ", "translation": "lamp"})
    ]
    
    # Add NPCs
    library.npcs = [
        NPC({"word": "پیرمرد", "translation": "old man"})
    ]
    library.npcs[0].dialogue = ["Welcome to the library! Feel free to read the **کتاب**."]
    
    garden.npcs = [
        NPC({"word": "باغبان", "translation": "gardener"})
    ]
    garden.npcs[0].dialogue = ["The **سیب** from this **درخت** are delicious!"]
    
    dining.npcs = [
        NPC({"word": "خدمتکار", "translation": "servant"})
    ]
    dining.npcs[0].dialogue = ["Would you like some **چای** with your **نان**?"]
    
    return rooms

def main():
    """Run the Farsi MUD game."""
    try:
        # Initialize vocabulary loader
        vocab_loader = VocabularyLoader()
        
        # Create rooms
        rooms = create_default_rooms()
        
        # Create game engine
        engine = GameEngine(vocab_loader, rooms)
        
        # Create and run UI
        app = GameUI(engine)
        app.run()
    except Exception as e:
        print(f"Error starting game: {e}")
        raise

if __name__ == "__main__":
    main()
