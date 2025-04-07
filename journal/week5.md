# Project Development Journal

## March 19, 2025

### Final Implementation Complete

#### Core Systems Implementation
- Completed AudioManager with:
  - Proper audio file path handling with leading zeros
  - Dialog audio preloading and playback
  - Clean audio transitions without overlapping
  - Volume controls for BGM, SFX, and dialog
  - User interaction detection for autoplay

#### Story Implementation
- Completed all story paths with branching dialogues:
  - Scene 1: Welcome to Iran (Apartment)
  - Scene 2: The Language School (Exterior)
  - Scene 3: Meeting Dr. Ahmadi (Classroom)
  - Scene 4: The Post Office (Practice)
  - Scene 5: Back Home (Apartment)
  - Scene 6: The Café (Cultural)
  - Scene 7: The End (Wrap-up)

#### Audio Assets Integration
- Organized audio files:
  - BGM: cafe-ambience.mp3, main-theme.mp3, street-ambience.mp3
  - Dialog: Scene-specific voice lines with choices and responses
  - SFX: UI sounds, transitions, and ambient effects

#### Server Implementation
- Switched to Express.js server for:
  - Proper static file serving
  - Correct MIME type handling
  - Consistent port usage (8080)
  - Future API endpoint support

#### Project Cleanup
- Removed redundant files and directories
- Consolidated dialog audio into single directory
- Updated documentation
- Added npm start script for easier deployment

#### Next Steps
- User testing and feedback collection
- Content expansion
- Additional language pairs
- Mobile optimization

## March 18, 2025

### Current Progress
- Completed detailed technical documentation
- Finalized story structure and character profiles
- Established asset requirements and specifications

### Next Steps
- Begin implementing the first chapter scenes
  - Priority: Apartment introduction scene
  - Focus on core dialogue system
- Create character artwork
  - Commission character portraits
  - Design expression variations
- Record audio for dialogue
  - Source native Farsi speakers
  - Record ambient sounds
- Test language switching functionality
  - Implement RTL text rendering
  - Test font compatibility
  - Validate language toggle system

### Technical Priorities
- Implement core VisualNovelEngine features
- Set up basic UI framework
- Create initial scene parser
- Establish testing framework

## March 10, 2025

### Project Foundation
- Established core game concept: A Farsi language learning visual novel with immersive storytelling
- Created detailed technical specifications including:
  - Dynamic language switching between English and Farsi
  - Audio system with BGM and SFX support
  - Save/Load functionality using local storage
  - Responsive UI with RTL support for Farsi text
  - Browser-based implementation for maximum accessibility

### Story Development
- Designed a branching narrative structure with three main paths:
  - Study Path: Focus on academic language learning
    - Grammar-focused exercises
    - Academic vocabulary building
    - Formal writing practice
  - Culture Path: Emphasis on Iranian cultural understanding
    - Traditional customs and etiquette
    - Modern youth culture
    - Social norms and practices
  - Practical Path: Daily conversation skills
    - Shopping and business interactions
    - Social situations
    - Daily life scenarios
- Created detailed character profiles including:
  - Alex Thompson (roommate)
    - Native English speaker
    - Helps with basic Farsi practice
  - Dr. Ahmadi (language instructor)
    - Expert in formal Farsi
    - Provides academic guidance
  - Zahra Mohammadi (café owner)
    - Teaches conversational Farsi
    - Shares cultural insights
  - Ali Hosseini (post office clerk)
    - Helps with formal documentation
    - Teaches business Farsi
  - Hassan Karimi (store owner)
    - Traditional expressions expert
    - Numbers and shopping vocabulary
  - Supporting cast:
    - Carlos Garcia: Grammar specialist
    - Park Ji-eun: Vocabulary expert
    - Maryam Rahimi: Cultural guide

### Technical Implementation
- Set up core components:
  - VisualNovelEngine for game state management
    - Scene transition system
    - Character display management
    - Dialogue progression handling
  - AudioManager for sound handling
    - BGM with fade transitions
    - SFX with volume control
    - Audio preloading system
  - SaveManager for progress persistence
    - Local storage integration
    - Save slot management
    - Game state serialization
- Designed data structures for:
  - Scene management
    - JSON-based scene definitions
    - Branching dialogue system
    - Choice consequence tracking
  - Character data
    - Multilingual name support
    - Expression image management
    - Character-specific vocabulary
  - Dialogue system with bilingual support
    - RTL text rendering
    - Dynamic language switching
    - Typography optimization

### Asset Development
- Created location designs for:
  - Post Office
    - Service counter layout
    - Form filling area
    - Digital number display
  - Café
    - Modern-traditional fusion design
    - Conversation spaces
    - Language exchange corner
  - Language School Classroom
    - U-shaped desk arrangement
    - Digital whiteboard setup
    - Educational posters
  - Apartment
    - Combined living/dining area
    - Traditional Persian elements
    - Modern amenities
  - Corner Store
    - Product display layout
    - Service counter design
    - Digital advertisements
- Implemented audio assets:
  - Background music tracks:
    - cafe_ambience.mp3
    - main_theme.mp3
    - street_ambience.mp3
  - Sound effects:
    - UI interactions
    - Location transitions
    - Ambient sounds

Initial project setup and core planning completed. Established the foundation for our Farsi language learning visual novel.

## April 7, 2025

### Docker Integration and Troubleshooting (Launcher & Writing Practice)

-   **Initial Setup:** Configured `docker-compose.yml` in the `Launcher` directory to manage all bootcamp project services.
-   **Writing Practice Integration:**
    -   Integrated the Farsi Writing Practice app (`writing-practice`) as a service.
    -   Troubleshot initial `FileNotFoundError` for `prompts.yaml` by ensuring it was present.
    -   Resolved Docker port mapping issues (`EXPOSE` vs. runtime port) by ensuring Gradio launched on the correct host (`0.0.0.0`) and exposed port (`8008`) via environment variables.
    -   Switched LLM provider from OpenAI to Google Gemini due to API key quota issues.
        -   Updated `requirements.txt` to include `google-generativeai`.
        -   Modified `gradio_app.py` to use the Gemini API for translation and grading.
        -   Configured `GOOGLE_API_KEY` via `.env` file in `Launcher`.
    -   Debugged Farsi text rendering issues in the Gradio UI:
        -   Initially attempted using `gr.HTML` with `arabic-reshaper` and `bidi.algorithm.get_display`, which resulted in garbled output.
        -   Tried `gr.Textbox(rtl=True)` with reshaped text, which also failed.
        -   Resolved by using `gr.Textbox` (without `rtl=True`) and passing the raw string processed by both `arabic_reshaper.reshape` and `bidi.algorithm.get_display`. The inherent Unicode directionality characters handled the display correctly in the standard textbox.
-   **Launcher Service Troubleshooting:**
    -   Simplified the Launcher's role to be a status dashboard and access portal, removing container start/stop functionality from the UI.
    -   Resolved errors preventing the Launcher backend (`main.py`) from executing `docker compose` commands inside its container:
        -   Added volume mount for `/var/run/docker.sock` in `docker-compose.yml`.
        -   Modified `Launcher/Dockerfile` to correctly install `docker-ce-cli` and `docker-compose-plugin` using the official `get.docker.com` script after `apt` methods failed.
        -   Initially attempted permission fixes by adding `appuser` to the `docker` group and matching GIDs, but ultimately switched to running the `launcher` container as `root` for simplicity to resolve persistent socket permission errors.
    -   Fixed `RuntimeError: Directory 'static' not found` by creating the `Launcher/static` directory.
    -   Corrected frontend JavaScript in `index.html` to properly construct links (initially was opening "undefined").
    -   Modified the `external_url` for FastAPI backend services (`opea-comps`, `song-vocab`) in `main.py` to point to `/docs` for a better user experience when launching.
-   **Final State:** All 8(+1 TTS) services are running correctly via `docker-compose up -d` from the `Launcher` directory. The Launcher UI at `http://localhost:3000` displays service status and provides direct links to each running application.
