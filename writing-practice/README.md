# Language Writing Practice

A Streamlit-based application for practicing writing in Persian (Farsi) or other languages. The app generates simple English sentences and allows users to practice writing them in their target language.

## Features

- 🎯 Generate simple, grammatically correct English sentences
- 📝 Practice writing translations in Persian/Farsi
- 📸 Upload images of your handwritten text
- 🔍 OCR support for Persian text recognition
- 🎨 RTL (Right-to-Left) text display support
- 💡 Instant feedback on your writing

## Installation

### Prerequisites

1. Python 3.8 or higher
2. Tesseract-OCR with Persian language support

### Installing Tesseract-OCR

1. Download the installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
2. During installation:
   - Select "Persian" language pack
   - Install to the default location (C:\Program Files\Tesseract-OCR)

### Setting up the Project

1. Clone the repository:
```bash
git clone <repository-url>
cd writing-practice
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Unix/macOS
.\venv\Scripts\activate   # On Windows
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
streamlit run app.py
```

2. Open your web browser and navigate to:
```
http://localhost:8501
```

3. Using the app:
   - Click "Generate New Sentence" to get an English sentence
   - Write the sentence in Persian/Farsi
   - Take a photo or scan your writing
   - Upload the image to check your writing

## Technical Details

### Components

- **Frontend**: Streamlit
- **Image Processing**: Pillow (PIL)
- **OCR Engine**: Tesseract with Persian language support
- **Text Direction**: RTL support for Persian text

### Dependencies

- streamlit
- pillow
- pytesseract
- python-dotenv
- openai (for future features)

## Troubleshooting

### Common Issues

1. **Tesseract Not Found**
   - Ensure Tesseract is installed in the default location
   - Check if the Persian language pack is installed

2. **OCR Not Working**
   - Make sure your image is clear and well-lit
   - Text should be written clearly in black ink
   - Background should be white and clean

3. **Text Not Displaying Correctly**
   - Ensure your browser supports RTL text
   - Check if Persian fonts are installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tesseract OCR team for Persian language support
- Streamlit team for the amazing framework
- Contributors and testers

## Future Plans

- [ ] Add support for more languages
- [ ] Implement handwriting feedback
- [ ] Add progress tracking
- [ ] Integrate with language learning APIs
- [ ] Add pronunciation guides

