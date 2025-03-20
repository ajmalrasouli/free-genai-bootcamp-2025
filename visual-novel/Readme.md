# Farsi Learning Visual Novel

A web-based visual novel for learning Farsi, featuring interactive dialogue, language switching, and audio management. The game follows three main story paths: Study, Culture, and Practical, helping players learn Farsi through immersive experiences.

## Features

- **Bilingual Support**: Switch between English and Farsi text with RTL support
- **Audio System**: Voice acting, background music, and sound effects with adjustable volumes
- **Interactive Dialogue**: Choice-based dialogue system with branching paths
- **Character System**: Rich cast of characters with dynamic expressions
- **Save/Load System**: Multiple save slots for game progress
- **Responsive Design**: Works on modern web browsers

## Technical Stack

- Pure JavaScript for game logic
- HTML5 and CSS3 for interface
- Web Audio API for sound management
- Express.js for serving static files
- Google Fonts (Noto Naskh Arabic) for Farsi text

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:8080` in your browser

## Project Structure

```
visual-novel/
├── assets/
│   ├── audio/
│   │   ├── bgm/      # Background music (cafe, street, main theme)
│   │   ├── dialog/   # Character voice lines
│   │   └── sfx/      # Sound effects (UI, ambience)
│   ├── backgrounds/  # Scene backgrounds
│   └── characters/   # Character sprites
├── js/
│   ├── audio-manager.js   # Audio system with preloading
│   ├── engine.js         # Core game engine
│   ├── main.js          # Game initialization
│   ├── maps.js          # Location and character mappings
│   ├── save-manager.js   # Save/load system
│   └── story-data.js     # Game content and dialogue
├── styles/
│   └── main.css          # Game styling
└── index.html            # Main game page
```

## Game Features

### Characters
- Alex Thompson - Your roommate and guide
- Dr. Ahmadi - Language school professor
- Zahra Mohammadi - Fellow student
- Ali Hosseini - Local shopkeeper
- Hassan Karimi - Post office clerk
- Carlos Garcia - International student
- Park Ji-eun - Exchange student
- Maryam Rahimi - Café owner

### Locations
- Language School - Learn Farsi fundamentals
- Post Office - Practice practical conversations
- Café - Cultural interactions
- Apartment - Home base
- Corner Store - Shopping dialogues

### Audio System
- **BGM**: Ambient music for each location
- **Dialog**: Voice acting for all characters
- **SFX**: UI sounds and environmental effects
- Volume controls for each audio type

## Controls

- **Click/Tap**: Advance dialogue
- **Choice Selection**: Click/tap dialogue options
- **Language Toggle**: Switch between English and Farsi
- **Volume Controls**: Adjust BGM, SFX, and dialogue volumes
- **Save/Load**: Multiple save slots for game progress

## Development

For detailed technical specifications and story structure, see:
- [Visual-Novel-Tech-Specs.md](Visual-Novel-Tech-Specs.md)
- [Story-Structure.md](Story-Structure.md)

## License

ISC License