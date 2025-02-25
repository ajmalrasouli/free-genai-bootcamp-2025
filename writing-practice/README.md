# Language Writing Practice App

This Streamlit application helps students practice writing sentences in their target language. The app generates simple English sentences and allows students to upload images of their handwritten translations for verification using OCR.

## Features

- Generate simple English sentences
- Upload images of handwritten text
- OCR recognition for written text
- Different word groups for practice

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Streamlit app:
```bash
streamlit run app.py
```

## Usage

1. Select a word group from the sidebar
2. Click "Generate New Sentence" to get a new English sentence
3. Write the sentence in your target language
4. Take a photo or scan your writing
5. Upload the image to check the text recognition

## Requirements

- Python 3.7+
- Streamlit
- MangaOCR
- Pillow

## Note

The OCR is currently configured for Farsi text recognition. For other languages, you may need to modify the OCR implementation accordingly.
