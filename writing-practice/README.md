# Farsi Writing Practice App

A simple and interactive application to help users practice writing in Farsi (Persian). The app provides English sentences and verifies your handwritten Farsi translations using OCR technology.

## Features

- Random English sentences for translation practice
- Upload and verify handwritten Farsi text
- Real-time OCR processing with Tesseract
- Immediate feedback on translation accuracy
- Proper RTL (Right-to-Left) text display
- Support for Persian character variations

## Prerequisites

1. Python 3.7 or higher
2. Tesseract-OCR with Persian language support

### Installing Tesseract-OCR

1. Download Tesseract installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. During installation:
   - Select "Persian" language pack
   - Install to the default location (C:\Program Files\Tesseract-OCR)
3. Restart the application after installation

## Installation

1. Clone this repository:
```bash
git clone [repository-url]
cd writing-practice
```

2. Install required Python packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
python gradio_app.py
```

2. The web interface will open in your browser

3. Practice writing:
   - Click "Get New Sentence" to receive an English sentence
   - Write the Farsi translation on paper
   - Take a photo or scan your writing
   - Upload the image
   - Click "Submit" to verify your translation

4. View Results:
   - Your written text will be displayed with proper RTL formatting
   - You'll see if your translation is correct or incorrect
   - If incorrect, the expected translation will be shown

## Supported Translations

The app currently supports common phrases including:
- Welcome (خوش آمدید)
- Hello (سلام)
- Good morning (صبح بخیر)
- Good night (شب بخیر)
- Thank you (متشکرم)
- You're welcome (خواهش می‌کنم)
- How are you? (حال شما چطور است؟)
- I am fine (من خوب هستم)
- What is your name? (اسم شما چیست؟)
- Nice to meet you (از آشنایی با شما خوشحالم)

## Troubleshooting

If you encounter issues:

1. **Text Not Detected**:
   - Ensure your writing is clear and well-lit
   - Use dark ink on white paper
   - Make sure the image is focused

2. **Incorrect Recognition**:
   - Check the debug output to see what text was detected
   - Ensure Tesseract is properly installed with Persian support
   - Try writing more clearly or adjusting the image quality

3. **Installation Issues**:
   - Verify Tesseract is installed in the default location
   - Ensure the Persian language pack is installed
   - Check if all required Python packages are installed

## Dependencies

- gradio
- pytesseract
- Pillow
- arabic-reshaper
- python-bidi
- PyYAML
- logging

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
