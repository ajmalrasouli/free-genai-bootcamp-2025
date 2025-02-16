# Week 0 — Project Architecture and Initial Setup

## Required Homework

### 1. Project Architecture Design
- Created a comprehensive architectural diagram for the language learning platform
- Key components identified:
  - User roles (Student and Teacher)
  - Lang Portal with Word Groups
  - Study Activities including:
    - Writing Practice App
    - Text Adventure Immersion Game
    - Light Visual Novel Immersion Reading
    - Sentence Constructor
    - Visual Flashcard Vocab
    - Speak to Learn

### 2. Sentence Constructor Implementation
- Developed prompting strategies for multiple LLM platforms:
  - ChatGPT (GPT-4)
  - Google Gemini
  - DeepSeek
- Created structured prompts for each LLM to act as a Dari language teacher
- Implemented key features:
  - Vocabulary table generation
  - Sentence structure guidance
  - Clues and considerations for learners
  - Progressive learning approach without direct answers

### 3. Technical Implementation Details
The Sentence Constructor activity includes:
- Vector Database integration
- RAG (Retrieval Augmented Generation) implementation
- Prompt Cache system
- Input/Output GuardRails
- LLM 7B integration
- Internet connectivity for real-time processing

## Homework Challenges
- Designed a modular architecture allowing for easy addition of new study activities
- Implemented multiple LLM support for comparison and redundancy
- Created a structured teaching methodology that encourages active learning
- Developed a scoring system for evaluating prompt effectiveness

## Knowledge Acquired
1. **Architecture Design**
   - Understanding of microservices architecture
   - Integration patterns for AI/ML components
   - User flow design principles

2. **LLM Integration**
   - Prompt engineering best practices
   - Different LLM capabilities and limitations
   - RAG implementation strategies

3. **Language Learning Methodology**
   - Structured approach to language teaching
   - Progressive difficulty management
   - Student engagement techniques

## Additional Notes
- The architecture is designed to be scalable
- Security considerations are built into the design
- The system supports both synchronous and asynchronous learning activities
