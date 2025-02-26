import gradio as gr
import logging
import yaml
import random
import arabic_reshaper
from bidi.algorithm import get_display
import pytesseract
from PIL import Image
import os
from pathlib import Path
import re

# Setup logging
logger = logging.getLogger('farsi_app')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('gradio_app.log')
fh.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)

# Custom CSS for RTL support and better styling
CUSTOM_CSS = """
@font-face {
    font-family: 'IRANSans';
    src: url('https://cdn.fontcdn.ir/Font/Persian/IRANSans/IRANSansWeb.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

.rtl-text {
    direction: rtl !important;
    text-align: right !important;
    font-family: IRANSans, 'Iranian Sans', Tahoma !important;
    font-size: 32px !important;
    padding: 20px !important;
    background-color: #f7f7f7 !important;
    border-radius: 8px !important;
    margin: 10px 0 !important;
    line-height: 2 !important;
    letter-spacing: 0 !important;
    font-feature-settings: "kern" 1, "liga" 1 !important;
    -webkit-font-feature-settings: "kern" 1, "liga" 1 !important;
    -moz-font-feature-settings: "kern" 1, "liga" 1 !important;
    -webkit-font-smoothing: antialiased !important;
}

.result-box {
    margin: 15px 0 !important;
    padding: 15px !important;
    border-radius: 8px !important;
    background-color: #ffffff !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
}

.correct {
    color: #28a745 !important;
    font-weight: bold !important;
}

.incorrect {
    color: #dc3545 !important;
    font-weight: bold !important;
}
"""

def normalize_farsi_text(text):
    """Normalize Farsi text by handling different character forms"""
    # Remove any non-Persian characters and extra spaces
    text = re.sub(r'[^\u0600-\u06FF\s]', '', text)
    text = ' '.join(text.split())
    
    # Normalize Persian characters
    replacements = {
        'ي': 'ی',
        'ك': 'ک',
        'دِ': 'د',
        'بِ': 'ب',
        'زِ': 'ز',
        'ذِ': 'ذ',
        'شِ': 'ش',
        'سِ': 'س',
        'ى': 'ی',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text

def process_farsi_text(text):
    """Process Farsi text with proper letter joining"""
    if not text:
        return text
    
    # Clean and normalize the text
    text = normalize_farsi_text(text)
    
    try:
        # Configure reshaper for better letter joining
        configuration = {
            'delete_harakat': True,
            'support_ligatures': True,
            'RIAL SIGN': True,
        }
        reshaped_text = arabic_reshaper.reshape(text, configuration)
        bidi_text = get_display(reshaped_text)
        
        # Wrap in styled div with proper RTL support and zero-width joiner
        processed_text = ' '.join(['\u200C'.join(word) for word in bidi_text.split()])
        
        return f'''
            <div class="rtl-text" lang="fa" dir="rtl">
                {processed_text}
            </div>
        '''
    except Exception as e:
        logger.error(f"Error reshaping text: {e}")
        return text

def check_tesseract_installation():
    """Check if Tesseract is installed and configured."""
    tesseract_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'
    ]
    
    for path in tesseract_paths:
        if Path(path).exists():
            pytesseract.pytesseract.tesseract_cmd = path
            return True
    
    logger.error("Tesseract-OCR not found in standard locations")
    return False

def load_prompts():
    """Load prompts from YAML file"""
    with open('prompts.yaml', 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

class FarsiWritingApp:
    def __init__(self):
        self.prompts = load_prompts()
        self.current_sentence = None
        self.expected_translations = {
            "Welcome": "خوش آمدید",
            "Hello": "سلام",
            "Good morning": "صبح بخیر",
            "Good night": "شب بخیر",
            "Thank you": "متشکرم",
            "You're welcome": "خواهش می‌کنم",
            "How are you?": "حال شما چطور است؟",
            "I am fine": "من خوب هستم",
            "What is your name?": "اسم شما چیست؟",
            "Nice to meet you": "از آشنایی با شما خوشحالم"
        }
        logger.debug("Initialized Farsi Writing App")
        if not check_tesseract_installation():
            logger.error("Tesseract not properly installed")

    def get_english_sentence(self):
        """Get a random English sentence for practice"""
        try:
            # Only select from sentences we have translations for
            sentence = random.choice(list(self.expected_translations.keys()))
            self.current_sentence = sentence
            return sentence
        except Exception as e:
            logger.error(f"Error getting sentence: {e}")
            return "Welcome"

    def verify_translation(self, written_text, english_sentence):
        """Verify if the written Farsi text matches the expected translation"""
        if not written_text or not english_sentence:
            return False
            
        # Get expected translation
        expected = self.expected_translations.get(english_sentence, "")
        if not expected:
            return False
            
        # Normalize both texts for comparison
        written_normalized = normalize_farsi_text(written_text)
        expected_normalized = normalize_farsi_text(expected)
        
        # Remove spaces, diacritics, and normalize variations
        written_clean = ''.join(written_normalized.split())
        expected_clean = ''.join(expected_normalized.split())
        
        # Common variations to handle
        replacements = {
            'ي': 'ی',
            'ك': 'ک',
            'ئ': 'ی',
            'ؤ': 'و',
            'ة': 'ه',
            'آمدید': 'آمدید',  # Allow both forms for this specific word
            'آمدید': 'آمدید'
        }
        
        for old, new in replacements.items():
            written_clean = written_clean.replace(old, new)
            expected_clean = expected_clean.replace(old, new)
        
        # Log the comparison for debugging
        logger.debug(f"Comparing - Written: {written_clean} vs Expected: {expected_clean}")
        
        # Check if the texts match after normalization
        return written_clean == expected_clean

    def process_image(self, image):
        """Process the uploaded image and extract Farsi text"""
        if image is None:
            return None

        try:
            if not check_tesseract_installation():
                return """<div class="result-box">
                    Tesseract-OCR is not installed or configured properly. Please follow these steps:
                    <ol>
                        <li>Download Tesseract installer from: https://github.com/UB-Mannheim/tesseract/wiki</li>
                        <li>During installation:
                            <ul>
                                <li>Select "Persian" language pack</li>
                                <li>Install to the default location (C:\\Program Files\\Tesseract-OCR)</li>
                            </ul>
                        </li>
                        <li>Restart the application</li>
                    </ol>
                    </div>"""

            # Configure Tesseract for Farsi
            custom_config = r'--oem 3 --psm 6 -l fas'
            
            # Perform OCR
            text = pytesseract.image_to_string(image, config=custom_config)
            
            if not text.strip():
                return None
                
            # Process the text for proper display
            processed_text = process_farsi_text(text)
            
            # Wrap in HTML with proper styling
            return f'<div class="rtl-text">{processed_text}</div>'
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            return None

    def check_writing(self, image):
        """Check the written Farsi text"""
        if image is None:
            return (
                '<div class="result-box">Please upload an image of your writing.</div>',
                '<div class="result-box">Waiting for submission...</div>'
            )
        
        # Get the raw text from OCR before reshaping
        raw_text = pytesseract.image_to_string(image, config=r'--oem 3 --psm 6 -l fas')
        is_correct = self.verify_translation(raw_text, self.current_sentence)
        
        # Process the text for display
        extracted_text = self.process_image(image)
        if extracted_text is None:
            return (
                '<div class="result-box">Error processing image. Please ensure your writing is clear and try again.</div>',
                '<div class="result-box incorrect">Unable to verify</div>'
            )
        
        # Format the results
        writing_result = f'<div class="result-box">{extracted_text}</div>'
        verification = f'<div class="result-box {"correct" if is_correct else "incorrect"}">'
        verification += 'Correct! Well done!' if is_correct else 'Incorrect. Try again!'
        
        # Add debug info to help understand the comparison
        if not is_correct:
            expected = self.expected_translations.get(self.current_sentence, "")
            expected_text = process_farsi_text(expected)
            verification += '</div>'
            verification += f'<div class="result-box">Expected: {expected_text}</div>'
            verification += f'<div class="result-box" style="font-size: 14px; color: #666;">Debug - OCR detected: {raw_text}</div>'
        else:
            verification += '</div>'
        
        return writing_result, verification

def create_ui():
    """Create the Gradio interface"""
    app = FarsiWritingApp()
    
    with gr.Blocks(title="Farsi Writing Practice", css=CUSTOM_CSS) as interface:
        gr.Markdown("# Farsi Writing Practice")
        gr.Markdown("Practice writing Farsi by translating English sentences!")
        
        with gr.Row():
            with gr.Column(scale=1):
                new_word_btn = gr.Button("Get New Sentence", variant="primary")
                sentence_display = gr.Textbox(
                    label="English Sentence",
                    interactive=False
                )
                
            with gr.Column(scale=2):
                image_input = gr.Image(
                    label="Upload your handwritten Farsi",
                    type="pil",
                    height=300
                )
                submit_btn = gr.Button("Submit", variant="primary", size="lg")
                
                # Results section using Group instead of Box
                with gr.Group():
                    gr.Markdown("### Results")
                    writing_result = gr.HTML(label="Your Writing")
                    check_result = gr.HTML(label="Verification Result")
        
        # Set up event handlers
        new_word_btn.click(
            fn=app.get_english_sentence,
            outputs=sentence_display
        )
        
        submit_btn.click(
            fn=app.check_writing,
            inputs=[image_input],
            outputs=[writing_result, check_result]
        )
        
        # Initialize with first sentence
        interface.load(
            fn=app.get_english_sentence,
            outputs=sentence_display
        )
    
    return interface

if __name__ == "__main__":
    interface = create_ui()
    interface.launch()
