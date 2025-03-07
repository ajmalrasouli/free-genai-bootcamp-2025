# Project Development Journal - Farsi Song Vocabulary Generator

## Project Overview
A FastAPI-based application specializing in finding Farsi (Persian) song lyrics and generating vocabulary lists. The system leverages Ollama's Mistral 7B model for intelligent processing and implements a sophisticated ReAct framework for accurate lyrics retrieval and vocabulary extraction.

## Development Timeline

### Initial Setup (March 2025)
- Established project structure and core dependencies
- Implemented FastAPI server with main endpoint `/api/agent`
- Set up SQLite3 database for vocabulary storage
- Integrated Ollama SDK with Mistral 7B model
- Created comprehensive technical specifications

### Core Features Implementation
1. **Intelligent Search System**
   - Implemented SERP-based search specifically for Farsi lyrics
   - Created specialized search patterns including "متن آهنگ" (lyrics) and "فارسی" (Farsi)
   - Developed robust page content extraction tools
   - Implemented smart URL selection for accurate lyrics sources

2. **Advanced Agent System**
   - Developed ReAct framework-based agent with sophisticated tool management
   - Implemented memory-aware context window calculation
   - Created ToolRegistry system with core tools:
     - `search_web_serp`: Specialized Farsi lyrics search
     - `get_page_content`: Web content extraction
     - `extract_vocabulary`: Farsi vocabulary processing
     - `generate_song_id`: Unique song identification
     - `save_results`: Structured data storage

3. **Resource Management**
   - Implemented dynamic context window calculation based on available RAM
   - Added safety factors and power-of-2 rounding for stability
   - Optimized model options for memory usage:
     - Configurable context window size
     - Thread management
     - Batch size optimization
     - Reproducible seed settings

4. **Storage System**
   - Implemented structured output organization:
     - `/outputs/lyrics`: For storing extracted lyrics
     - `/outputs/vocabulary`: For processed vocabulary lists
   - Added robust error handling and logging
   - Implemented automatic directory creation and management

### Testing Infrastructure
- Created comprehensive test suite:
  - SERP tool testing for Farsi search accuracy
  - DuckDuckGo integration testing
  - Ollama SDK integration verification
  - Content extraction validation

### Project Organization
- Implemented clear directory structure:
  - `/bin`: Binary and executable files
  - `/tools`: Specialized agent tools
  - `/tests`: Comprehensive test suite
  - `/prompts`: System prompts including Farsi-specific instructions
  - `/outputs`: Organized storage for lyrics and vocabulary

### Documentation
- Created detailed `README.md` with setup and usage instructions
- Documented API endpoints and behavior
- Added technical specifications in `Song-Vocab-Tech-Specs.md`
- Implemented comprehensive logging system

## Current Status
- Fully functional API endpoint for Farsi lyrics retrieval
- Sophisticated vocabulary extraction system
- Memory-optimized Ollama integration
- Robust error handling and logging
- Comprehensive test coverage
- Clear documentation for setup and usage

## Next Steps
- Enhance Farsi vocabulary extraction accuracy
- Implement caching for frequently requested songs
- Add support for different Persian dialects
- Expand test coverage for edge cases
- Add batch processing capabilities
- Implement advanced error recovery mechanisms
