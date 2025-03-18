# Visual Novel Story Structure

## Core Framework
- Linear progression through scenes
- Each scene features one character with the player
- Key decision points that lead to specific branches
- All interactions flow naturally from one to the next

## NodeState

When a current dialog node is set it a state.
- speaker
- response

## Story Data Structure Example

This is an example of a story scene in JSON format that is stored in the outputs/scenes/ directory.
```json
{
    id: "scene001",
    title: "Welcome to Iran",
    location_id: "apartment",
    character_id: "alex",
    dialog: {
        "000": {
            speaker: "player",
            farsi: "شما در آپارتمان جدید خود هستید و نور صبحگاهی از پنجره‌ها می‌تابد.",
            english: "You wake up in your new apartment in Iran. The morning sunlight streams through the blinds as you hear someone in the kitchen.",
            default_next_id: "001"
        },
        "001": {
            speaker: "alex",
            farsi: "صبح بخیر! بیدار شدی؟",
            english: "Oh, you're up! Good morning!",
            choices: [
                {
                    english: "Good morning. You must be Alex?",
                    farsi: "صبح بخیر. شما باید الکس باشید؟",
                    next_id: "002"
                },
                ...
            ]
        }
        ...
        "030": {
            speaker: "alex",
            farsi: "...",
            english: "See you later, remember to visit the post office!"
            next_scene_id: "scene003"
        }
    }
}
```

- speaker is always the player or another character
 - there is no narrator, the player's inner monologue would act like narration when needed.
- if there is no choices that the default_next_id will transition to the next scene
- choices are always from the perspective of the player

Sometimes you want to have a response for a specific choice but the choice always leads to the next default is so there there is a nested response eg.
```json
{
    "id": "scene002",
    "dialog": {
        "000": {
            "speaker": "alex",
            "farsi": "صبح بخیر! بیدار شدی؟",
            "english": "Oh, you're up! Good morning!",
            "default_next_id": "001",
            "choices": [
                {
                    "english": "Good morning. You must be Alex?",
                    "farsi": "صبح بخیر. شما باید الکس باشید؟",
                    "response": {
                        "speaker": "alex",
                        "farsi": "بله، درسته! من الکس هستم.",
                        "english": "That's right! I'm Alex."
                    }
                },
                {
                    "english": "Hello. Nice to meet you.",
                    "farsi": "سلام. از آشنایی با شما خوشوقتم.",
                    "response": {
                        "speaker": "alex",
                        "farsi": "خوشوقتم! من الکس هستم. تازه به ایران اومدی؟",
                        "english": "Nice to meet you! I'm Alex. You just arrived in Iran?"
                    }
                }
            ]
        }
    }
}


## Story Structure

### Chapter 1: Arrival
1. **Scene 001**: Apartment Introduction
   - Meet Alex (roommate)
   - Basic greetings in Farsi
   - Dialogue choices for introduction

2. **Scene 002**: Morning Conversation
   - Learn about the language school
   - Practice basic phrases
   - Choose conversation style

3. **Scene 003**: Preparing for School
   - Get directions
   - Learn location vocabulary
   - Choose what to bring

### Chapter 2: Getting Oriented
1. **Scene 1**: Visit to post office, meeting Ali Hosseini
2. **Scene 2**: Language challenge with forms (player practices formal Farsi)
3. **Scene 3**: Return to apartment, Alex suggests visiting café for practice
4. **Scene 4**: Visit to café, meeting Zahra Mohammadi

**BRANCH POINT 1**: How you respond to Zahra's question about what you want to focus on
- Option A: Academic language focus → Study Path
- Option B: Cultural understanding → Culture Path
- Option C: Daily conversation skills → Practical Path

### Study Path (Branch A)
1. **Scene 1**: Zahra introduces you to Carlos at the café
2. **Scene 2**: Study session with Carlos at the language school
3. **Scene 3**: Advanced lesson with Dr. Ahmadi
4. **Scene 4**: Meeting Park Ji-eun at the language school library
5. **Scene 5**: Grammar challenge with Park Ji-eun

**BRANCH POINT 2A**: Your approach to language learning
- Option A1: Text-focused study → Reading/Writing Ending
- Option A2: Conversation practice → Speaking/Listening Ending

### Culture Path (Branch B)
1. **Scene 1**: Zahra shares cultural insights during café break
2. **Scene 2**: Meeting Maryam at her apartment for tea
3. **Scene 3**: Cultural lesson with Maryam
4. **Scene 4**: Visit to corner store, discussion with Hassan about traditions
5. **Scene 5**: Cultural practice exercises with Dr. Ahmadi

**BRANCH POINT 2B**: How you engage with Iranian culture
- Option B1: Traditional customs → Traditional Ending 
- Option B2: Modern youth culture → Contemporary Ending

### Practical Path (Branch C)
1. **Scene 1**: Alex shows practical Farsi phrases at apartment
2. **Scene 2**: Shopping practice at Hassan's corner store
3. **Scene 3**: Practical conversation at café with Zahra
4. **Scene 4**: Real-life application exercises with Dr. Ahmadi
5. **Scene 5**: Final practical challenge at post office with Ali

**BRANCH POINT 2C**: Your approach to daily communication
- Option C1: Independent problem-solving → Self-Reliance Ending
- Option C2: Community assistance → Social Connection Ending

### Final Chapter: Language Assessment
Each path concludes with a final assessment at the language school with Dr. Ahmadi, with content varying based on chosen path.

## Endings Overview

### Study Path Endings:
- **Reading/Writing Ending**: Player excels at written Farsi and achieves high proficiency in reading comprehension
- **Speaking/Listening Ending**: Player develops excellent conversation skills and can navigate complex discussions

### Culture Path Endings:
- **Traditional Ending**: Player gains deep appreciation for Iranian traditions and cultural nuances
- **Contemporary Ending**: Player becomes fluent in modern Iranian expressions and cultural references

### Practical Path Endings:
- **Self-Reliance Ending**: Player develops confidence handling daily situations independently in Farsi
- **Social Connection Ending**: Player builds a network of local connections and support through language skills

## Language Learning Integration

Each scene includes:
- **Relevant Vocabulary**: Words specific to the location and situation
- **Grammar Points**: New structures introduced through character dialog
- **Cultural Notes**: Insights into Iranian customs and practices
- **Practice Exercises**: Interactive language challenges with feedback

## Character-Specific Language Focus

- **Dr. Ahmadi**: Formal Farsi, proper grammar, academic vocabulary
- **Zahra Mohammadi**: Casual conversation, youth expressions, service industry terms
- **Ali Hosseini**: Business Farsi, formal requests, written forms
- **Garcia Carlos**: Grammar structure, language learning techniques
- **Park Ji-eun**: Vocabulary expansion, memorization strategies
- **Hassan Karimi**: Traditional expressions, shopping vocabulary, numbers
- **Maryam Rahimi**: Polite Farsi, cultural terminology, traditional phrases
- **Alex Thompson**: Daily life conversation, roommate terminology, basic needs

## Audio Implementation
- **BGM Tracks**:
  - `cafe_ambience.mp3`: Café background
  - `main_theme.mp3`: Main menu theme
  - `street_ambience.mp3`: Outdoor scenes

- **Sound Effects**:
  - `button_click.mp3`: UI interactions
  - `door_bell.mp3`: Location transitions
  - `paper_rustle.mp3`: Menu sounds
  - `pour_tea.mp3`: Café scenes
  - `transition.mp3`: Scene changes

## Character Expressions
Currently implemented expressions for Alex:
- Default (neutral)
- Happy
- Thinking
- Surprised

## Save System Integration
Save data includes:
- Current scene ID
- Dialog node ID
- Language setting
- Audio settings
- Character state

## Planned Features
1. Additional character expressions
2. More sound effects for interactions
3. Achievement system
4. Progress tracking
5. Vocabulary review system

## Language Learning Elements
- Bilingual text display
- Cultural context in dialogues
- Common phrases and greetings
- Natural conversation flow
- Progressive difficulty

## Technical Notes
- Scene transitions use fade effects
- Audio crossfades between scenes
- RTL text support for Farsi
- Responsive layout design
- Persistent volume settings
