# **Farsi Text Adventure MUD** 
**A Language Immersion Game for Learning Farsi** 

---

## **Overview** 
Farsi Text Adventure MUD is a single-player, text-based adventure game designed to help players learn Farsi vocabulary in a fun and immersive way. Inspired by classic text-based games like Zork and Shadowgate, this game dynamically generates a world where players interact with objects, solve puzzles, and communicate with NPCs—all while learning **exactly one Farsi word per sentence**.

---

## **Features** 
- **Themed Rooms**: Explore different environments (Library, Garden, Dining Room, Bedroom) each with unique items and NPCs
- **Interactive NPCs**: Talk to characters who respond in context-appropriate ways
- **Rich Vocabulary**: Learn Farsi words for:
  - Basic items (کتاب/book, شمشیر/sword, درخت/tree)
  - Food and drink (نان/bread, چای/tea, سیب/apple)
  - Furniture (میز/table, صندلی/chair, تخت/bed)
  - Characters (مرد/man, زن/woman, پیرمرد/old man)
- **Dynamic World Generation**: Procedurally generated rooms, items, and NPCs. 
- **Farsi Vocabulary Integration**: Every sentence includes **one Farsi word** in context. 
- **Fixed Verb Set**: 15 predefined commands (e.g., `Take`, `Use`, `Talk`). 
- **Interactive CLI Interface**: Built with Python and Textual for a rich terminal experience. 
- **Save/Load System**: Save your progress and resume later. 

---

## **Installation** 
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/yourusername/farsi-mud.git
   cd farsi-mud
   ```
2. **Set Up a Virtual Environment**: 
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```
3. **Install Dependencies**: 
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Game**: 
   ```bash
   python main.py
   ```

---

## **How to Play** 
### **Basic Commands** 
| Command      | Example                  | Description                          | 
|--------------|--------------------------|--------------------------------------| 
| `Look`       | `Look`                   | Examine your surroundings.           | 
| `Take`       | `Take کتاب`              | Pick up an item.                     | 
| `Drop`       | `Drop قلم`               | Discard an item from your inventory. | 
| `Use`        | `Use کلید on در`         | Use an item on another object.       | 
| `Inventory`  | `Inventory`              | View your carried items.             | 
| `Help`       | `Help`                   | View all available commands.         | 

### **Item Interactions** 
- `take کتاب` - Pick up a book
- `drop کتاب` - Drop a book
- `use کلید on صندوق` - Use key on chest
- `give نان to مرد` - Give bread to man

### **Consumption** 
- `eat نان` - Eat bread
- `drink چای` - Drink tea

### **Room Guide** 
- **Library (کتابخانه)**
  - Find: کتاب (book), میز (table)
  - Meet: پیرمرد (old man)
- **Garden (باغ)**
  - Find: درخت (tree), سیب (apple)
  - Meet: مرد (man)
- **Dining Room (اتاق غذاخوری)**
  - Find: نان (bread), چای (tea)
  - Meet: زن (woman)
- **Bedroom (اتاق خواب)**
  - Find: تخت (bed), چراغ (lamp)

### **Example Gameplay** 
```plaintext
[Forest Clearing] 
A **گرگ** (wolf) watches you. Exits: North. 
Items: **شمشیر** (sword) 
> Take شمشیر 
You pick up the **شمشیر**. 
> Inventory 
Items: شمشیر 
> Go north 
You enter a dark cave. 
```

---

## **Vocabulary Files** 
The game uses JSON files to load Farsi vocabulary. Example: 
```json
[
  {
    "word": "کتاب",
    "translation": "book",
    "pos": "noun",
    "category": "object",
    "example": "Take the کتاب from the shelf."
  },
  {
    "word": "گرگ",
    "translation": "wolf",
    "pos": "noun",
    "category": "animal",
    "example": "A گرگ growls nearby."
  }
]
```

Place your vocabulary files in the `data/` folder and specify the file when launching the game: 
```bash
python main.py --vocab data/words.json
```

---

## **Technical Details** 
### **Architecture** 
- **Vocabulary Loader**: Validates and loads Farsi words from JSON files. 
- **Command Parser**: Parses player input using regex and grammar rules. 
- **Game Engine**: Manages world state, player inventory, and room connections. 
- **UI Framework**: Built with Textual for a rich terminal interface. 

### **Dependencies** 
- Python 3.10+ 
- Libraries: 
  - `Textual` for terminal UI. 
  - `Hazm` for Farsi NLP and validation. 
  - `pytest` for unit testing. 

---

## **Contributing** 
We welcome contributions! Here’s how to get started: 
1. Fork the repository. 
2. Create a new branch: 
   ```bash
   git checkout -b feature/your-feature-name
   ``` 
3. Commit your changes: 
   ```bash
   git commit -m "Add your feature"
   ``` 
4. Push to the branch: 
   ```bash
   git push origin feature/your-feature-name
   ``` 
5. Open a pull request. 

---

## **Roadmap** 
- **Multiplayer Support**: Allow players to interact in the same world. 
- **Voice Commands**: Integrate speech-to-text for Farsi practice. 
- **Progress Tracking**: Track learned words and provide feedback. 
- **Advanced Puzzles**: Add more complex puzzles and quests. 

---

## **License** 
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 

---

## **Acknowledgments** 
- Inspired by classic text-based games like Zork and Shadowgate. 
- Built with the amazing [Textual](https://textual.textualize.io/) framework. 
- Farsi validation powered by [Hazm](https://github.com/sobhe/hazm). 

---

Enjoy your adventure in the world of Farsi! 🎮📚
