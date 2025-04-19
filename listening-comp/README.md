# Persian Learning Assistant 

An AI-powered learning platform that transforms YouTube content into interactive Persian language learning experiences.

## Features

### 1. Chat with Nova (AI Assistant)
- Interactive Persian language learning through conversation
- Grammar explanations and vocabulary assistance
- Cultural insights and learning tips
- Example-based learning with practice suggestions

### 2. Raw Transcript Processing
- YouTube video transcript download and processing
- Support for Persian (fa) and English (en) transcripts
- Video metadata extraction
- Transcript statistics and analysis
- Easy transcript download in JSON format

### 3. Structured Data Processing
- Text cleaning and normalization
- Dialogue extraction from transcripts
- Structured data organization
- Learning content preparation

### 4. RAG Implementation
- Retrieval Augmented Generation system
- Semantic search across transcripts
- Context-aware responses
- Multilingual question answering
- Source attribution with timestamps

### 5. Interactive Learning
- Multiple practice types:
  - Dialogue Practice
  - Vocabulary Practice
  - Grammar Practice
- Topic-based learning:
  - Daily Conversation
  - Shopping
  - Travel
  - Education
  - Work and Business
  - Health and Medical
  - Family and Relationships
  - Culture and Traditions
- High-quality audio synthesis
- Interactive feedback and scoring

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ajmalrasouli/free-genai-bootcamp-2025
cd persian-learning-assistant
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Azure Speech Service credentials
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=your_region_here
```

## Usage

1. Start the application:
```bash
streamlit run frontend/main.py
```

2. Access the web interface at `http://localhost:8501`

3. Choose a development stage from the sidebar:
   - Start with "Chat with Nova" for basic language learning
   - Use "Raw Transcript" to process YouTube content
   - Explore "Structured Data" for organized learning materials
   - Try "RAG Implementation" for intelligent Q&A
   - Practice with "Interactive Learning" for hands-on exercises

## Project Structure

```
persian-learning-assistant/
├── backend/
│   ├── audio_generator.py    # Azure TTS integration
│   ├── get_transcript.py     # YouTube transcript handling
│   ├── question_generator.py # Practice content generation
│   ├── rag_system.py        # RAG implementation
│   └── data/
│       └── transcripts/     # Stored transcripts
├── frontend/
│   └── main.py             # Streamlit UI
├── requirements.txt        # Dependencies
└── README.md              # Documentation
```

## Dependencies

- streamlit>=1.24.0
- numpy>=1.24.0
- transformers>=4.30.0
- torch>=2.0.0
- gTTS>=2.3.2
- ffmpeg-python>=0.2.0
- youtube-transcript-api==0.6.1
- pytube==12.1.3
- sentence-transformers==2.2.2
- faiss-cpu==1.7.4
- langchain==0.1.0

## Security and Configuration

### Setting Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```env
# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here

# Azure Speech Service
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=eastus

# App Settings
DEBUG=False
```

3. Copy the example config file:
```bash
cp backend/config.template.py backend/config.py
```

### Security Notes

- Never commit `.env` or `config.py` files to version control
- Keep your API keys and secrets secure
- The repository includes:
  - `.gitignore` to prevent committing sensitive files
  - `.env.example` as a template for environment variables
  - `config.template.py` as a template for configuration

### Recommended Security Practices

1. Use environment variables for all secrets
2. Keep the `.env` file local and never share it
3. Regularly rotate your API keys
4. Use different API keys for development and production
5. Monitor your API usage for unusual activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Azure Cognitive Services for Speech synthesis
- Hugging Face for transformer models
- YouTube for content accessibility
- Streamlit for the web interface

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.