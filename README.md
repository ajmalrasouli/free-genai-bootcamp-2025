# Free GenAI Bootcamp 2025
## 6 Weeks Of Free Online GenAI Training And Hands-on Programming

This repository contains projects developed during the 2025 GenAI Bootcamp, focusing on practical applications of generative AI and language technologies, particularly for Persian/Dari language learning.

## Projects Overview

### Farsi Text Adventure MUD Game (fa-mud)
A text-based adventure game that helps users learn Farsi vocabulary through an immersive MUD (Multi-User Dungeon) experience.

**Key Features:**
- Command flow: User Input → Parser → Game Engine → Response Gen → UI
- Exactly one Farsi word per English sentence
- 13 predefined commands (Look, Move, Take, Drop, Talk, Use, Give, Open, Close, Eat, Inventory, Drink, Help)
- RTL support for mixed LTR/RTL text rendering
- JSON-based vocabulary system

**Technical Stack:**
- Python 3.10+
- Textual for terminal UI
- Hazm for Farsi NLP
- Arabic-reshaper and python-bidi for text processing
- React frontend with RTL support

### DariMaster Language Learning App (Week 1)
A full-stack web application for learning Dari language using modern web technologies.

**Key Features:**
- Interactive Flashcards
- Matching Game
- Word Groups Management
- Study Progress Tracking
- Performance Statistics
- Bilingual Interface

**Technical Stack:**
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, SQLite

### Persian Learning Assistant (Week 2)
An interactive chat system for learning Persian with transcript analysis capabilities.

**Key Features:**
- Chat with Nova Implementation
- Structured Data Processing
- Transcript analysis
- Vocabulary extraction with Persian character handling
- Grammar pattern recognition

**Technical Stack:**
- sentence-transformers
- faiss-cpu
- langchain
- Azure Speech Services

### ASL Finger Spelling Recognition System
A computer vision application for recognizing American Sign Language finger spelling.

**Key Features:**
- Advanced image processing with OpenCV
- Real-time hand detection
- Gradio-based UI with practice and test modes
- Video recording with MP4 export

## Weekly Development Progress

### Week 0: Project Architecture and Initial Setup
- Created comprehensive architectural diagrams
- Developed prompting strategies for multiple LLM platforms
- Implemented Sentence Constructor activity
- Designed modular architecture for study activities

### Week 1: DariMaster Language Learning App
- Set up full-stack application with Vite, TypeScript, and Express.js
- Implemented core features including flashcards and matching games
- Created responsive UI with Tailwind CSS and Shadcn/ui
- Added RTL support for Dari text

### Week 2: Persian Learning Assistant
- Implemented Chat with Nova system with Persian language support
- Created transcript processing and vocabulary extraction
- Added security enhancements and proper environment configuration
- Developed bilingual chat interface

### Week 4: Farsi Text Adventure MUD
- Solved critical issues with Farsi text display
- Implemented centralized text processing with normalize_farsi function
- Created custom ArabicReshaper configuration for Farsi
- Improved bidirectional text support

## Getting Started

Each project has its own requirements and setup instructions in its respective directory.

For the Farsi MUD game:
```bash
cd fa-mud
pip install -r requirements.txt
python run_game.py
```

## Contributors
- Ajmal Rasouli
