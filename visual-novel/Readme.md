# Farsi Learning Visual Novel

A web-based visual novel for learning Farsi, featuring interactive dialogue, language switching, and audio management.

## Features

- **Bilingual Support**: Switch between English and Farsi text dynamically
- **Audio System**: Background music and sound effects with adjustable volumes
- **Interactive Dialogue**: Click-through dialogue system with choice-based interactions
- **Character System**: Dynamic character display with expressions
- **Save/Load System**: Save and load game progress
- **Responsive Design**: Works on modern web browsers

## Technical Stack

- Pure JavaScript for game logic
- HTML5 and CSS3 for interface
- Web Audio API for sound management
- Google Fonts (Noto Naskh Arabic) for Farsi text

## Quick Start

1. Clone the repository
2. Start a local web server (e.g., `python -m http.server 8000`)
3. Open `http://localhost:8000` in your browser

## Project Structure

```
visual-novel/
├── assets/
│   ├── audio/
│   │   ├── bgm/      # Background music
│   │   └── sfx/      # Sound effects
│   └── images/       # Character and background images
├── js/
│   ├── audio-manager.js   # Audio handling
│   ├── engine.js         # Core game engine
│   ├── save-manager.js   # Save/load functionality
│   ├── scenes.js         # Scene definitions
│   └── story-data.js     # Dialogue and choices
├── styles/
│   └── main.css          # Game styling
└── index.html            # Main game page
```

## Controls

- **Click/Tap**: Advance dialogue
- **Language Toggle**: Switch between English and Farsi
- **Volume Controls**: Adjust BGM and SFX volumes
- **Save/Load**: Save or load game progress

## Asset Generation

### Background Images
- Generated using Microsoft Designer
- Additional editing done in Canva

### Character Images
- Face expressions and poses can be adjusted using FacePoke
- Source: https://huggingface.co/spaces/jbilcke-hf/FacePoke

## Development

For detailed technical specifications and story structure, see:
- [Visual-Novel-Tech-Specs.md](Visual-Novel-Tech-Specs.md)
- [Story-Structure.md](Story-Structure.md)