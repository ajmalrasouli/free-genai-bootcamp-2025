# Game Design Doc and Technical Specifications

## Overview

### Game Concept
A Farsi language learning visual novel that helps users learn through interactive dialogue and immersive storytelling. Features bilingual text display, audio management, and save/load functionality.

### Technical Features
- **Language Switching**: Dynamic switching between English and Farsi text
- **Audio System**: BGM and SFX with independent volume controls
- **Save/Load System**: Progress persistence using local storage
- **Responsive UI**: Adapts to different screen sizes
- **RTL Support**: Proper right-to-left text rendering for Farsi

### Target Platform
- Web browsers (Chrome, Firefox, Safari)
- Minimum screen resolution: 1024x768

## Implementation Details

### Core Components

#### VisualNovelEngine
- Manages game state and scene transitions
- Handles user input and dialogue progression
- Controls character display and animations
- Manages language switching
- Initializes and coordinates other managers

#### AudioManager
- Handles background music playback
- Manages sound effects
- Provides volume control for BGM and SFX
- Handles audio loading and error states
- Supports fade in/out transitions

#### SaveManager
- Saves/loads game state
- Manages save slots
- Handles serialization of game data
- Provides UI for save/load operations

### Data Structure

#### Scene Format
```javascript
{
    id: "scene001",
    title: "Welcome to Iran",
    location_id: "apartment",
    character_id: "alex",
    dialog: {
        "000": {
            speaker: "player",
            farsi: "صبح بخیر",
            english: "Good morning",
            default_next_id: "001"
        },
        "001": {
            speaker: "alex",
            farsi: "صبح بخیر! خوبی؟",
            english: "Good morning! How are you?",
            choices: [
                {
                    english: "I'm good, thanks!",
                    farsi: "خوبم، ممنون!",
                    next_id: "002"
                }
            ]
        }
    }
}
```

#### Character Data
```javascript
{
    "alex": {
        name: {
            english: "Alex Thompson",
            farsi: "الکس تامپسون"
        },
        images: {
            default: "assets/images/characters/alex/default.png",
            happy: "assets/images/characters/alex/happy.png",
            thinking: "assets/images/characters/alex/thinking.png"
        }
    }
}
```

### UI Components

#### Dialogue Box
- Character name display
- Text display with typing effect
- Click-to-continue indicator
- Choice buttons when available

#### Control Panel
- Language toggle button
- Save/Load button
- Volume controls for BGM and SFX

#### Audio Controls
- Separate sliders for BGM and SFX
- Volume range: 0.0 to 1.0
- Real-time volume adjustment
- Test sound on SFX adjustment

### Styling

#### Fonts
- English: Noto Sans
- Farsi: Noto Naskh Arabic
- Fallback: system UI fonts

#### Colors
- Text: #333333
- Dialogue Box Background: rgba(0, 0, 0, 0.7)
- Buttons: #4CAF50
- Hover States: #45a049

### Asset Management

#### Audio
- BGM Format: MP3
- SFX Format: MP3
- Preloading for immediate playback
- Fallback handling for unsupported formats

#### Images
- Character Images: PNG with transparency
- Backgrounds: JPG
- UI Elements: SVG/PNG
- Recommended Resolution: 1920x1080

## Performance Considerations

### Optimization
- Audio sprite sheets for SFX
- Image compression for backgrounds
- Lazy loading for scenes
- CSS transitions for animations

### Memory Management
- Audio unloading for unused tracks
- Image cleanup for unused assets
- Save data size limitations
- Cache management for assets

## Browser Support
- Modern browsers (last 2 versions)
- WebAudio API support required
- LocalStorage for save functionality
- ES6+ JavaScript features

## Story and Setting

### Synopsis

You are an adult in Iran going to a private language learning school for 1 month to immerse yourself in the language.

## Core Story Framework
- Linear progression through scenes
- Each scene features one character with the player
- Key decision points that lead to specific branches
- All interactions flow naturally from one to the next

> **Note**: The complete story structure is detailed in [Story-Structure.md](Story-Structure.md)


### Settings

Small Iranian city, late spring

#### Locations / Scenes

**Post Office (Interior)**  
A bright, organized Iranian post office interior with clean service counters and staff in professional uniforms. Organized shelves display forms and packaging materials along one wall. Large windows let in natural light, illuminating the polished floors. A digital number display shows who's next in line. Official posters with Farsi text line the walls, and a small area with writing supplies is available for customers to fill out forms.

**Cafe (Interior)**  
A cozy, modern cafe interior with traditional Iranian aesthetics. Wooden tables and comfortable seating are arranged to create intimate conversation spaces. Large windows frame views of a small Persian garden. The service counter displays freshly made pastries and traditional Iranian sweets under glass, with a menu board above showing items in both Farsi and English. Local artwork and Persian calligraphy decorate the warm-toned walls, and a small bookshelf with language exchange materials sits in one corner.

**Private Language Learning School (Classroom Interior)**  
A bright, modern classroom inside a converted traditional Iranian building. The room features ornate windows, polished stone floors, and large windows with views of a small courtyard garden with a fountain. Desks are arranged in a U-shape facing a digital whiteboard. Walls are covered with colorful Farsi language posters, alphabet charts, and examples of student work. A teacher's desk sits at the front with neatly organized teaching materials and a small desktop computer.

**Apartment (Interior)**  
A modest Iranian apartment interior featuring a combined living/dining area with Persian carpets. Traditional cushions (پشتی) surround a low table in the living area. The compact kitchenette has essential appliances and minimal counter space. Large windows offer a view of the city. Built-in storage cabinets line one wall. The space blends traditional Iranian elements with modern necessities like a wall-mounted air conditioner, TV, and refrigerator.

**Corner Store (Interior)**  
A brightly lit Iranian corner store interior with well-organized shelves and displays. Refrigerated glass-door cases line one wall with drinks and fresh items. Central aisles contain neatly arranged snacks, packaged foods, and daily necessities. A service counter features fresh bread and local delicacies. Digital advertisements play on screens above the register area. Seasonal promotions and local products are displayed prominently. The store's warm lighting creates a welcoming atmosphere.

### Characters

#### Post Office Clerk
- **Name**: Ali Hosseini
- **Gender**: Male
- **Age**: 45
- **Nationality**: Iranian
- **Appearance**: Middle-aged man with short, neatly combed black hair, rectangular glasses, clean-shaven, always wearing a crisp postal uniform with perfect posture
- **Personality**: Formal, helpful, patient with language learners
- **Role**: Helps player learn postal vocabulary and formal Farsi
- **Language Level**: Speaks slowly and clearly, uses basic to intermediate Farsi
- **Key Interactions**: Teaches player how to send packages, buy stamps, fill out forms

#### Student 1
- **Name**: Park Ji-eun
- **Gender**: Female
- **Age**: 24
- **Nationality**: South Korean
- **Appearance**: Young woman with shoulder-length black hair often styled with colorful clips, round face with bright smile, fashionable casual clothes with a preference for pastel colors and cute accessories
- **Personality**: Outgoing, enthusiastic, sometimes speaks too fast
- **Role**: Fellow language student, potential friend
- **Language Level**: Intermediate, occasionally mixes up words
- **Key Interactions**: Study partner, introduces player to local spots

#### Student 2
- **Name**: Garcia Carlos
- **Gender**: Male
- **Age**: 30
- **Nationality**: Spanish
- **Appearance**: Tall man with olive skin, short dark brown hair neatly styled, trimmed beard, rectangular glasses, typically dressed in business casual attire with button-up shirts and slacks
- **Personality**: Serious, studious, competitive
- **Role**: Rival student who challenges player
- **Language Level**: Advanced beginner, very precise with grammar
- **Key Interactions**: Quiz competitions, grammar discussions

#### Teacher
- **Name**: Dr. Fatima Ahmadi
- **Gender**: Female
- **Age**: 38
- **Nationality**: Iranian
- **Appearance**: Professional woman with shoulder-length black hair usually in a neat hijab, minimal makeup, elegant but conservative clothing in neutral colors, often wears a blazer and long skirt, carries a leather briefcase
- **Personality**: Strict but kind, encouraging
- **Role**: Main instructor at language school
- **Language Level**: Adjusts speech based on student level, models perfect Farsi
- **Key Interactions**: Daily lessons, homework assignments, cultural explanations

#### Barista
- **Name**: Zahra Mohammadi
- **Gender**: Female
- **Age**: 26
- **Nationality**: Iranian
- **Appearance**: Trendy young woman with black hair styled fashionably under a colorful hijab, elegant makeup, wears the cafe uniform with a modern touch
- **Personality**: Creative, chatty, interested in foreign cultures
- **Role**: Provides casual conversation practice
- **Language Level**: Uses casual Farsi with modern expressions
- **Key Interactions**: Coffee orders, small talk about daily life

#### Corner Store Clerk
- **Name**: Hassan Karimi
- **Gender**: Male
- **Age**: 60
- **Nationality**: Iranian
- **Appearance**: Older man with gray hair, dignified posture, weathered face with prominent laugh lines, wears a traditional store apron over simple clothing, reading glasses hanging from a cord around his neck
- **Personality**: Traditional, slightly reserved but warms up over time
- **Role**: Tests player's shopping vocabulary
- **Language Level**: Uses fast, natural Farsi with local dialect
- **Key Interactions**: Purchasing items, asking for recommendations

#### Apartment Neighbour
- **Name**: Maryam Rahimi
- **Gender**: Female
- **Age**: 35
- **Nationality**: Iranian
- **Appearance**: Elegant woman with long black hair, modest makeup, often seen in stylish but conservative clothing, sometimes wears traditional Iranian dress at home
- **Personality**: Reserved, polite, occasionally invites player for tea
- **Role**: Introduces aspects of Iranian home life
- **Language Level**: Polite form Farsi, clear pronunciation
- **Key Interactions**: Neighborhood information, cultural customs at home

#### Apartment Roommate
- **Name**: Alex Thompson
- **Gender**: Male
- **Age**: 28
- **Nationality**: Canadian
- **Appearance**: Athletic build with shaggy light brown hair, casual style with jeans and t-shirts, friendly smile, often carrying a camera or smartphone to document experiences
- **Personality**: Messy, fun-loving, night owl
- **Role**: Daily conversation partner, source of conflicts and resolutions
- **Language Level**: Mix of basic Farsi and English when frustrated
- **Key Interactions**: Sharing living space, planning weekend activities