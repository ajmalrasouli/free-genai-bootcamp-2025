### **Complete Technical Specifications: Farsi Text Adventure MUD** 

## Overview

This document outlines the technical specifications for a text adventure MUD (Multi-User Dungeon) designed for immersive Farsi language learning. The MUD will provide an interactive environment where users can practice their Farsi language skills in a gamified setting.

## Core Features

1. **Text-based Interface**: The MUD will use a text-based interface, allowing users to interact with the game through typed commands and responses.
2. **Gamified Learning**: The MUD will include gamified elements to make learning Farsi more engaging and interactive.
3. **Farsi Language Immersion**: The MUD will be entirely in Farsi, providing an immersive learning experience.
4. **Multiplayer Environment**: Users can interact with other players in the MUD, fostering a community of learners.
5. **Progress Tracking**: The MUD will track user progress and achievements, allowing them to monitor their learning journey.

---

### **1. Architecture Overview** 
A single-player CLI-based text adventure game where players interact with a dynamically generated world. The game enforces **exactly one Farsi vocabulary word per English sentence** to aid language immersion. Built with Python and the Textual framework for terminal UI rendering. 

```plaintext
┌─────────────┐   ┌───────────┐   ┌──────────────┐   ┌───────────────┐   ┌─────────────┐ 
│  User Input │ → │  Parser   │ → │ Game Engine  │ → │ Response Gen  │ → │    UI       │ 
└─────────────┘   └───────────┘   └──────────────┘   └───────────────┘   └─────────────┘ 
                     │                   │                   │ 
                     ▼                   ▼                   ▼ 
               Command Validation  World State Mgmt  Farsi Word Injection 
```

---

### **2. Core Components** 

#### **2.1 Vocabulary Loader** 
- **Purpose**: Load and validate Farsi vocabulary files. 
- **Input Format**: JSON or CSV with fields: 
  ```json
  {
    "word": "کتاب",
    "translation": "book",
    "pos": "noun",
    "example": "Take the کتاب from the shelf."
  }
  ```
- **Validation Rules**: 
  - UTF-8 encoding enforced. 
  - Reject entries with missing fields or invalid Farsi characters. 
  - Verify word uniqueness and part-of-speech (noun, verb, adjective). 

#### **2.2 Command Parser** 
- **Supported Verbs**: `Look`, `Move`, `Take`, `Drop`, `Talk`, `Use`, `Give`, `Open`, `Close`, `Eat`, `Inventory`, `Drink`, `Help`. 
- **Grammar**: `[Verb] [Farsi Word] (on/to [Farsi Word])?` 
  - Example: `Use قلم on کاغذ` (Use pen on paper). 
- **Implementation**: 
  - Regex-based parsing (`^(?P<verb>\w+)\s+(?P<target>\S+)(?:\s+(on|to)\s+(?P<recipient>\S+))?$`). 
  - Validate verbs/objects against current room state and inventory. 

#### **2.3 Game Engine** 
- **World State**: Tracks: 
  - Player inventory. 
  - Room connections (graph structure). 
  - Item/NPC states (e.g., locked, hidden). 
- **Procedural Generation**: 
  - Assign Farsi words to items, NPCs, and room descriptions. 
  - Ensure no duplicate words per session. 
- **Example Room**: 
  ```python
  {
    "name": "Forest Clearing",
    "description": "A **گرگ** (wolf) prowls near a **درخت** (tree). Exits: North.",
    "items": ["شمشیر", "چراغ"],
    "exits": {"north": "Cave Entrance"}
  }
  ```

#### **2.4 Response Generator** 
- **Template System**: 
  - Predefined templates with slots for Farsi words: 
    - `"You see a [word]."` → `"You see a **کتاب**."` 
  - Randomize templates to avoid repetition. 
- **Localization Rules**: 
  - Nouns paired with `Take/Drop`. 
  - Verbs (e.g., "open") paired with compatible objects (e.g., doors). 

#### **2.5 User Interface (UI)** 
- **Framework**: Python + Textual (TUI library). 
- **Features**: 
  - **Bolding/Coloring**: Farsi words in yellow, verbs in cyan. 
  - **RTL Support**: Mixed LTR/RTL text rendering. 
  - **Input History**: Scrollable with `↑`/`↓` keys. 
- **Layout**: 
  ```plaintext
  ------------------------------
  [Room Name] 
  [Description with **Farsi** words] 
  Items: **فارسی**, **فارسی** 
  Exits: North, East 
  ------------------------------
  > [Command Input]
  ```

---

### **3. Data Structures** 

#### **3.1 Player Class** 
```python
class Player:
    def __init__(self):
        self.inventory = []  # List of Item objects
        self.location = "start_room"  # Current room ID
```

#### **3.2 Room Class** 
```python
class Room:
    def __init__(self, room_id):
        self.id = room_id
        self.description = ""  # Dynamically generated with Farsi words
        self.items = []        # List of Item objects
        self.exits = {}        # Dict: {"north": "room_id", ...}
        self.npcs = []        # List of NPC objects
```

#### **3.3 Item Class** 
```python
class Item:
    def __init__(self, word_data):
        self.name_en = word_data["translation"]
        self.name_fa = word_data["word"]
        self.is_portable = True  # Can be added to inventory
```

---

### **4. Technical Requirements** 

#### **4.1 Programming Language & Dependencies** 
- **Language**: Python 3.10+ 
- **Libraries**: 
  - `Textual` for terminal UI. 
  - `Hazm` (Farsi NLP toolkit) for word validation. 
  - `pytest` for unit testing. 

#### **4.2 Performance** 
- **Memory**: < 100 MB (for 500+ vocabulary words). 
- **Input Latency**: < 200ms response time for commands. 

---

### **5. Farsi Validation Strategy** 
- **Pre-Load**: 
  - Validate against the `Hazm` Farsi dictionary. 
  - Reject words not found in standard Farsi lexicons. 
- **Runtime**: 
  - Ensure Farsi words match their part of speech in context (e.g., `Eat` + food noun). 
  - Example error: `Invalid: "Open کتاب" (book is not openable).` 

---

### **6. Testing Plan** 
1. **Unit Tests**: 
   - Command parsing (e.g., `Take کتاب` → valid action). 
   - Inventory management (add/remove items). 
2. **Localization Tests**: 
   - Verify Farsi words are bolded and colored. 
   - Test RTL rendering in terminals. 
3. **Performance Tests**: 
   - Load 1,000-word vocabulary file. 
   - Measure response time under load. 

---

### **7. Deployment** 
- **Packaging**: PyInstaller for standalone executables (Windows/macOS/Linux). 
- **Distribution**: ZIP file containing: 
  - Game executable. 
  - Sample vocabulary files. 
  - `README.md` with command examples. 

---

### **8. Example Workflow** 
1. **Launch**: 
   ```bash
   python game.py --vocab words.json
   ```
2. **Gameplay**: 
   ```plaintext
   [Cave Entrance] 
   A damp cave. A **کلید** (key) glints on the floor. Exits: South. 
   > Take کلید 
   You pick up the **کلید**. 
   > Inventory 
   Items: کلید, چراغ 
   ```
3. **Quit**: 
   ```plaintext
   > Quit 
   Goodbye! You learned 12 Farsi words today. 
   ```

---

### **9. Security** 
- **Input Sanitization**: Strip special characters from commands (e.g., `;`, `|`). 
- **File Validation**: Reject vocabulary files with unexpected fields/formatting. 

---

### **10. Future Roadmap** 
- **Multiplayer Support**: Socket-based interaction. 
- **Voice Commands**: Speech-to-text for Farsi practice. 
- **Progress Tracking**: Metrics for learned words. 

---