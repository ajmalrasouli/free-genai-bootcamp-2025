# Free GenAI Bootcamp 2025
## 6 Weeks Of Free Online GenAI Training And Hands-on Programming

This repository contains projects developed during the 2025 GenAI Bootcamp, focusing on practical applications of generative AI and language technologies, particularly for Persian/Dari language learning.

## Projects Overview

### 1. Farsi Text Adventure MUD Game (fa-mud)
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

### 2. ASL Finger Spelling Application (finger-spelling)
An interactive application that helps users learn and practice American Sign Language (ASL) finger spelling using computer vision and machine learning.

**Key Features:**
- Real-time hand tracking and gesture recognition
- ASL finger spelling detection and translation
- Interactive learning mode for practicing ASL alphabet
- Performance feedback and accuracy metrics
- User-friendly interface with webcam integration

**Technical Stack:**
- Hand tracking using MediaPipe
- Custom TensorFlow model for gesture recognition
- Real-time image processing with OpenCV
- Gradio-based web interface

### 3. Language Learning Portal (lang-portal)
A comprehensive language learning platform with various activities and tools to help users learn new languages.

**Key Features:**
- Interactive language learning modules
- Progress tracking
- User authentication
- Customizable learning paths

**Technical Stack:**
- Python backend
- Database integration
- Web-based interface
- Task automation with Invoke

### 4. Persian Learning Assistant (listening-comp)
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

### 5. Text-to-Speech (TTS) Microservice (opea-comps)
A microservice that combines Coqui TTS with FastAPI to provide text-to-speech conversion through a REST API.

**Key Features:**
- Text-to-speech conversion API
- Docker containerization
- FastAPI integration
- Audio format conversion

**Technical Stack:**
- Docker and Docker Compose
- Coqui TTS service
- FastAPI framework
- RESTful API design

### 6. Farsi Song Vocabulary Generator (song-vocab)
An application that analyzes Farsi songs to extract vocabulary for language learning purposes.

**Key Features:**
- API for song lyric analysis
- Vocabulary extraction
- SERP integration for song search
- Interactive testing tools

**Technical Stack:**
- Uvicorn server
- Ollama SDK
- API endpoints
- Testing frameworks

### 7. Farsi Learning Visual Novel (visual-novel)
A web-based visual novel for learning Farsi, featuring interactive dialogue, language switching, and audio management.

**Key Features:**
- Bilingual Support: Switch between English and Farsi text with RTL support
- Audio System: Voice acting, background music, and sound effects
- Interactive Dialogue: Choice-based dialogue system with branching paths
- Character System: Rich cast of characters with dynamic expressions
- Save/Load System: Multiple save slots for game progress

**Technical Stack:**
- Pure JavaScript for game logic
- HTML5 and CSS3 for interface
- Web Audio API for sound management
- Express.js for serving static files
- Google Fonts (Noto Naskh Arabic) for Farsi text

### 8. Farsi Writing Practice App (writing-practice)
A simple and interactive application to help users practice writing in Farsi (Persian) using OCR technology.

**Key Features:**
- Random English sentences for translation practice
- Upload and verify handwritten Farsi text
- Real-time OCR processing with Tesseract
- Immediate feedback on translation accuracy
- Proper RTL (Right-to-Left) text display

**Technical Stack:**
- Python 3.7+
- Tesseract-OCR with Persian language support
- Gradio for web interface
- Arabic-reshaper and python-bidi for text processing
- Pillow and PyYAML

## Reference Images

### 1. Farsi Text Adventure MUD Game (fa-mud)
![Farsi MUD Game](fa-mud/reference_images/image1.png)![Farsi MUD Game](fa-mud/reference_images/image2.png)
*The Farsi MUD game features a text-based interface with mixed English and Farsi text, allowing users to explore virtual environments while learning vocabulary.*

### 2. ASL Finger Spelling Application (finger-spelling)
![ASL Finger Spelling](finger-spelling/reference_images/dashboard.png)![ASL Finger Spelling](finger-spelling/reference_images/image1.png)
![ASL Finger Spelling](finger-spelling/reference_images/image2.png)![ASL Finger Spelling](finger-spelling/reference_images/image3.png)
![ASL Finger Spelling](finger-spelling/reference_images/image4.png)*The ASL application uses computer vision to recognize hand gestures and translate them into letters, with a practice mode for learning.*

### 3. Language Learning Portal (lang-portal)
![Language Portal](lang-portal/darimasterlan/reference_images/dashboard.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image1.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image2.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image3.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image4.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image5.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image6.png)
![Language Portal](lang-portal/darimasterlan/reference_images/image7.png)
*The language portal provides a comprehensive dashboard for tracking progress and accessing various learning activities.*

### 4. Persian Learning Assistant (listening-comp)
![Persian Learning Assistant](listening-comp/reference_images/Chat_with_Nova.png)
![Persian Learning Assistant](listening-comp/reference_images/Interactive_Learning.png)
![Persian Learning Assistant](listening-comp/reference_images/RAG_Implementation.png)
![Persian Learning Assistant](listening-comp/reference_images/Raw_Transcript.png)
![Persian Learning Assistant](listening-comp/reference_images/Structured_Data.png)
[Visual Novel Demo Video](listening-comp/reference_images/Listening_Comp_Video.mp4) (download to view)

*The listening comprehension tool analyzes Persian audio and provides vocabulary extraction and grammar pattern recognition.*

### 5. Text-to-Speech (TTS) Microservice (opea-comps)
![TTS Microservice](opea-comps/reference_images/image1.png)
![TTS Microservice](opea-comps/reference_images/image2.png)

*The TTS microservice architecture demonstrates the containerized services working together to provide text-to-speech conversion.*

### 6. Farsi Song Vocabulary Generator (song-vocab)
![Song Vocabulary Generator](song-vocab/reference_images/image1.png)
*The song vocabulary tool searches for and analyzes Farsi lyrics to extract useful vocabulary for language learners.*

### 7. Farsi Learning Visual Novel (visual-novel)
![Visual Novel](visual-novel/reference_images/apartment.png)
![Visual Novel](visual-novel/reference_images/cafe.png)
![Visual Novel](visual-novel/reference_images/postoffice.png)
![Visual Novel](visual-novel/reference_images/school_exterior.png)
[Visual Novel Demo Video](visual-novel/reference_images/video.mp4) (download to view)

*The visual novel presents interactive scenarios with characters and dialogue choices to teach Farsi in context.*

### 8. Farsi Writing Practice App (writing-practice)
![Writing Practice](writing-practice/reference_images/image1.png)
![Writing Practice](writing-practice/reference_images/image2.png)
![Writing Practice](writing-practice/reference_images/image3.png)
![Writing Practice](writing-practice/reference_images/image4.png)
![Writing Practice](writing-practice/reference_images/image5.png)
![Writing Practice](writing-practice/reference_images/image6.png)
![Writing Practice](writing-practice/reference_images/image7.png)

*The writing practice app allows users to practice handwritten Farsi and checks accuracy using OCR technology.*

## Repository Structure

```
free-genai-bootcamp-2025/
├── fa-mud/                   # Farsi text adventure MUD game
│   ├── backend/              # Python backend for game logic
│   ├── frontend/             # React frontend with RTL support
│   └── README.md             # Project documentation
│
├── finger-spelling/          # ASL finger spelling recognition
│   ├── models/               # ML models for gesture recognition
│   ├── app.py                # Main application
│   └── README.md             # Project documentation
│
├── lang-portal/              # Language learning portal
│   ├── darimasterlan/        # Dari master language app
│   └── README.md             # Project documentation
│
├── listening-comp/           # Persian learning assistant
│   ├── backend/              # Backend services
│   ├── structured_data.py    # Data processing utilities
│   └── README.md             # Project documentation
│
├── opea-comps/               # Text-to-Speech microservice
│   ├── mega-service/         # FastAPI service
│   ├── models/               # TTS models
│   └── README.md             # Project documentation
│
├── song-vocab/               # Farsi song vocabulary generator
│   ├── tools/                # Utility tools
│   ├── tests/                # Testing modules
│   └── README.md             # Project documentation
│
├── visual-novel/             # Farsi learning visual novel
│   ├── assets/               # Audio, backgrounds, characters
│   ├── js/                   # Game engine and logic
│   ├── styles/               # CSS styling
│   └── README.md             # Project documentation
│
├── writing-practice/         # Farsi writing practice app
│   ├── gradio_app.py         # Main application
│   └── README.md             # Project documentation
│
└── README.md                 # Main repository documentation
```

## Getting Started

Each project has its own requirements and setup instructions in its respective directory.

For the Farsi MUD game:
```bash
cd fa-mud
pip install -r requirements.txt
python run_game.py
```

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
