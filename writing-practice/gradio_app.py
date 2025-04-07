import gradio as gr
import requests
import json
import random
import logging
import google.generativeai as genai
import os
import dotenv
import yaml
import pytesseract
from PIL import Image
import arabic_reshaper
from bidi.algorithm import get_display
from pathlib import Path
import re

dotenv.load_dotenv()

# --- Farsi Text Processing Utilities ---

def normalize_farsi_text(text):
    """Normalize Farsi text by handling different character forms and removing non-Persian chars."""
    if not isinstance(text, str):
        return ""
    # Remove any non-Persian characters (except spaces) and extra spaces
    text = re.sub(r'[^\u0600-\u06FF\s]', '', text)
    text = ' '.join(text.split())
    
    # Normalize common character variations
    replacements = {
        'ي': 'ی', 'ك': 'ک', 'دِ': 'د', 'بِ': 'ب', 'زِ': 'ز',
        'ذِ': 'ذ', 'شِ': 'ش', 'سِ': 'س', 'ى': 'ی', 'ئ': 'ی',
        'ؤ': 'و', 'ة': 'ه'
        # Add more normalizations if needed
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text

def process_farsi_text_for_display(text):
    """Process Farsi text using reshape and get_display, return raw string.
    """
    if not text or not isinstance(text, str):
        return "" # Returns empty string if input is bad

    try:
        # Use both reshape and get_display
        reshaped_text = arabic_reshaper.reshape(text)
        bidi_text = get_display(reshaped_text)
        # Return the raw processed string
        return bidi_text
    except Exception as e:
        logger.error(f"Error reshaping/displaying Farsi text: {e}")
        # Fallback: return raw original string
        return text

# --- Tesseract Configuration ---

def check_tesseract_installation():
    """Check if Tesseract is installed and set the command path."""
    # Standard paths for Windows
    tesseract_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'
        # Add paths for Linux/macOS if needed, e.g., '/usr/bin/tesseract'
    ]
    
    # Check environment variable first
    tesseract_cmd_env = os.getenv('TESSERACT_CMD')
    if tesseract_cmd_env and Path(tesseract_cmd_env).exists():
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd_env
        logger.info(f"Using Tesseract from environment variable: {tesseract_cmd_env}")
        return True
        
    # Check standard paths
    for path in tesseract_paths:
        if Path(path).exists():
            pytesseract.pytesseract.tesseract_cmd = path
            logger.info(f"Using Tesseract found at: {path}")
            return True
    
    # Check if tesseract is in PATH (for Linux/macOS primarily)
    try:
        # Try running tesseract command to see if it's in PATH
        import subprocess
        subprocess.run(['tesseract', '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # If it runs without error, pytesseract should find it automatically
        logger.info("Using Tesseract found in system PATH")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        logger.error("Tesseract-OCR not found in standard locations or PATH.")
        logger.error("Please install Tesseract and ensure 'fas' language data is installed.")
        logger.error("Optionally, set the TESSERACT_CMD environment variable to its path.")
    return False

# --- Prompt Loading ---

def load_prompts():
    """Load prompts from YAML file"""
    try:
    with open('prompts.yaml', 'r', encoding='utf-8') as f:
            prompts = yaml.safe_load(f)
            # Basic validation
            if not all(k in prompts for k in ['translation', 'grading']):
                 raise ValueError("Prompts YAML missing required keys: translation, grading")
            return prompts
    except FileNotFoundError:
        logger.error("prompts.yaml not found!")
        # Return default prompts or raise an error
        raise
    except Exception as e:
        logger.error(f"Error loading prompts.yaml: {e}")
        raise

# Setup logging
logger = logging.getLogger('farsi_app') # Changed logger name
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('gradio_app.log')
fh.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
# Clear existing handlers to avoid duplicate logs if re-running in interactive env
if logger.hasHandlers():
    logger.handlers.clear()
logger.addHandler(fh)
logger.propagate = False # Prevent propagation to root logger

# --- Main Application Class ---

class FarsiWritingApp:
    def __init__(self):
        # self.client = OpenAI() # Remove OpenAI client
        
        # Configure Google AI Client
        try:
            self.google_api_key = os.environ.get('GOOGLE_API_KEY')
            if not self.google_api_key:
                raise ValueError("GOOGLE_API_KEY environment variable not set.")
            genai.configure(api_key=self.google_api_key)
            # Initialize the Gemini model
            # Using gemini-1.5-flash as it's often free and efficient
            self.model = genai.GenerativeModel('gemini-1.5-flash') 
            logger.info("Google Generative AI client configured successfully with gemini-1.5-flash.")
        except Exception as e:
            logger.critical(f"Failed to configure Google Generative AI: {e}", exc_info=True)
            # Handle inability to configure - maybe raise or set a flag?
            self.model = None # Indicate model is not available

        self.prompts = load_prompts()
        self.is_tesseract_ready = check_tesseract_installation()
        logger.info("Farsi Writing App Initialized")

    def get_english_sentence(self):
        """Generate a simple English sentence using Google Gemini"""
        logger.debug("Generating new English sentence prompt using Google Gemini.")
        if not self.model:
            logger.error("Google AI Model not available.")
            return "Error: Language model not configured."
            
        try:
            # Simple prompt for a basic English sentence suitable for translation practice
            # Gemini API uses a slightly different prompt structure
            prompt = "You are an English teacher creating simple sentences for Farsi learners to translate. Provide one short, common English sentence (max 10 words)."
            response = self.model.generate_content(prompt)
            
            # Accessing the response text
            # Note: Error handling for blocked prompts etc. might be needed
            # See Google AI documentation for response structure and safety ratings
            if response.parts:
                sentence = response.text.strip()
                 # Basic cleaning
                sentence = sentence.replace("\"", "") 
                logger.info(f"Generated English sentence: {sentence}")
            return sentence
            else:
                 logger.error(f"Gemini response did not contain text parts. Response: {response}")
                 # Check for blocked prompts
                 if response.prompt_feedback and response.prompt_feedback.block_reason:
                     logger.error(f"Prompt blocked: {response.prompt_feedback.block_reason}")
                     return f"Error: Prompt blocked ({response.prompt_feedback.block_reason})"
                 return "Error: Could not generate sentence."

        except Exception as e:
            logger.error(f"Error generating English sentence with Google Gemini: {str(e)}", exc_info=True)
            return "Error generating sentence."

    def grade_submission(self, image_path, target_english_sentence):
        """Process image submission, transcribe, translate, and grade it using Tesseract and Google Gemini."""
        logger.info(f"Grading submission for target: {target_english_sentence}")
        if image_path is None:
            logger.warning("Grade submission called with no image path.")
            # Return HTML formatted errors for Gradio HTML component
            error_msg = "<p style='color:red;'>Please upload an image first.</p>"
            return error_msg, "N/A", "N/A", "N/A"
        
        if not self.model:
             logger.error("Google AI Model not available for grading.")
             error_msg = "<p style='color:red;'>Error: Language model not configured.</p>"
             return error_msg, "N/A", "N/A", "N/A"

        if not target_english_sentence:
            logger.error("Target English sentence is missing.")
            error_msg = "<p style='color:red;'>Error: Target sentence missing. Please generate a new sentence.</p>"
            return error_msg, "N/A", "N/A", "N/A"

        try:
            # --- 1. Transcription using Tesseract ---            
            logger.info(f"Transcribing image: {image_path}")
            # Use the file path directly with pytesseract
            raw_transcription = pytesseract.image_to_string(image_path, lang='fas', config='--oem 1 --psm 7') # OEM 1 for LSTM, PSM 7 for single text line
            logger.debug(f"Raw transcription: {raw_transcription}")
            
            if not raw_transcription.strip():
                logger.warning("OCR returned empty text.")
                # Return HTML formatted message
                transcription_html = "<p style='color:orange;'>Could not detect text in the image. Please ensure writing is clear.</p>"
                return transcription_html, "N/A", "N/A", "N/A"
            
            # Normalize the transcribed text
            normalized_transcription = normalize_farsi_text(raw_transcription)
            logger.info(f"Normalized transcription: {normalized_transcription}")
            # Get HTML formatted transcription for display
            transcription_html = process_farsi_text_for_display(normalized_transcription)

            # --- 2. Literal Translation using Google Gemini --- 
            logger.info("Getting literal translation from Google Gemini.")
            # Construct prompt using format from prompts.yaml
            translation_system_context = self.prompts['translation']['system']
            translation_user_prompt = self.prompts['translation']['user'].format(text=normalized_transcription)
            full_translation_prompt = f"{translation_system_context}\n\n{translation_user_prompt}"
            
            translation_response = self.model.generate_content(full_translation_prompt)

            # Handle response and potential errors/blocks
            if translation_response.parts:
                literal_translation = translation_response.text.strip()
            else:
                logger.error(f"Translation prompt response error: {translation_response}")
                block_reason = translation_response.prompt_feedback.block_reason if translation_response.prompt_feedback else "Unknown"
                literal_translation = f"Error: Translation failed (Block Reason: {block_reason})"
            logger.info(f"Literal translation: {literal_translation}")

            # --- 3. Grading using Google Gemini --- 
            logger.info("Getting grade and feedback from Google Gemini.")
            # Construct prompt using format from prompts.yaml
            grading_system_context = self.prompts['grading']['system']
            grading_user_prompt = self.prompts['grading']['user'].format(
                target_sentence=target_english_sentence,
                submission=normalized_transcription,
                translation=literal_translation
            )
            full_grading_prompt = f"{grading_system_context}\n\n{grading_user_prompt}"
            
            grading_response = self.model.generate_content(full_grading_prompt)

            # Handle response and potential errors/blocks
            if grading_response.parts:
                 full_feedback = grading_response.text.strip()
            else:
                 logger.error(f"Grading prompt response error: {grading_response}")
                 block_reason_grading = grading_response.prompt_feedback.block_reason if grading_response.prompt_feedback else "Unknown"
                 full_feedback = f"Grade: C\nFeedback: Error during grading (Block Reason: {block_reason_grading})"
            
            logger.debug(f"Full grading response: {full_feedback}")
            
            # Parse Grade and Feedback (keep existing parsing logic, might need adjustment)
            grade = "C" # Default
            feedback = full_feedback # Default
            try:
                # Attempt to parse based on the expected format "Grade: [S/A/B/C]\nFeedback: ..."
                lines = full_feedback.split('\n', 1)
                if lines[0].startswith("Grade:"):
                    parsed_grade = lines[0].split(":")[1].strip().upper()
                    if parsed_grade in ['S', 'A', 'B', 'C']:
                        grade = parsed_grade
                    if len(lines) > 1 and lines[1].startswith("Feedback:"):
                         feedback = lines[1].split(":", 1)[1].strip()
                    else:
                        feedback = lines[1].strip() if len(lines) > 1 else full_feedback
                else:
                     feedback = full_feedback
                     match = re.search(r'Grade:\s*([SABC])', full_feedback, re.IGNORECASE)
                     if match:
                         grade = match.group(1).upper()
            except Exception as parse_error:
                logger.error(f"Could not parse grade/feedback: {parse_error}. Using full response.")

            logger.info(f"Grading complete - Grade: {grade}")
            
            return transcription_html, literal_translation, grade, feedback
            
        except pytesseract.TesseractNotFoundError:
            logger.error("Tesseract executable not found.")
            error_msg = "<p style='color:red;'>Tesseract not found. Please ensure it is installed and configured.</p>"
            return error_msg, "N/A", "N/A", "N/A"
        except Exception as e:
            logger.error(f"Error in grade_submission: {str(e)}", exc_info=True)
            error_msg = f"<p style='color:red;'>An unexpected error occurred: {str(e)}</p>"
            return error_msg, "Error", "N/A", "Error processing submission."

# --- Gradio UI Definition ---

def create_ui():
    app = FarsiWritingApp()
    
    with gr.Blocks(
        title="Farsi Writing Practice",
        theme=gr.themes.Soft() # Example theme
    ) as interface:
        gr.Markdown("# Farsi Writing Practice")
        gr.Markdown("Translate the English sentence into Farsi by writing it down and uploading an image.")
        
        # State variable to store the current English sentence
        current_english_sentence_state = gr.State("")
        
        with gr.Row():
            with gr.Column(scale=1):
                generate_btn = gr.Button("Generate New Sentence", variant="primary")
                english_sentence_display = gr.Textbox(
                    label="English Sentence Prompt",
                    lines=2,
                    interactive=False,
                    scale=1 # Adjust scale as needed
                )
                
            with gr.Column(scale=2):
                image_input = gr.Image(
                    label="Upload Your Handwritten Farsi", 
                    type="filepath", # Use filepath for Tesseract
                    height=300
                )
                submit_btn = gr.Button("Submit for Review", variant="secondary")
                
                gr.Markdown("### Review")
                with gr.Group():
                    # Use standard Textbox without rtl=True
                    transcription_output = gr.Textbox(label="Transcription (Your Writing)", lines=2, interactive=False)
                    translation_output = gr.Textbox(label="Literal Translation (of your writing)", lines=2, interactive=False)
                    grade_output = gr.Textbox(label="Grade", interactive=False)
                    feedback_output = gr.Textbox(label="Feedback", lines=4, interactive=False)

        # --- Event Handlers ---
        
        # Function to handle generating a new sentence and updating state
        def handle_generate_sentence():
            new_sentence = app.get_english_sentence()
            return new_sentence, new_sentence # Update display and state
            
        generate_btn.click(
            fn=handle_generate_sentence,
            outputs=[english_sentence_display, current_english_sentence_state] 
        )
        
        # Function to handle submission - takes image path and current sentence from state
        def handle_submission(image_filepath, current_sentence):
            # Pass the filepath directly
            return app.grade_submission(image_filepath, current_sentence)
        
        submit_btn.click(
            fn=handle_submission,
            # Inputs: image component output and the state variable
            inputs=[image_input, current_english_sentence_state],
            # Outputs: Update the review components
            outputs=[transcription_output, translation_output, grade_output, feedback_output]
        )
        
        # Load initial sentence when the interface loads
        interface.load(
             fn=handle_generate_sentence,
             outputs=[english_sentence_display, current_english_sentence_state]
        )
    
    return interface

# --- Main Execution Block ---

if __name__ == "__main__":
    try:
        # Initial check before launching
        if not check_tesseract_installation():
            print("ERROR: Tesseract OCR is not properly installed or configured.")
            print("The application might not function correctly.")
            # Decide if you want to exit or continue with a warning
            # exit(1)
            
        # Load prompts early to catch errors
        load_prompts()
        logger.info("Prompts loaded successfully.")
        
    interface = create_ui()
        
        # Read host and port from environment variables for Docker compatibility
        server_name = os.environ.get('HOST', '0.0.0.0') # Default to 0.0.0.0 for Docker
        server_port = int(os.environ.get('PORT', 8008)) # Keep port 8008
        
        logger.info(f"Launching Gradio UI on {server_name}:{server_port}")
        interface.launch(server_name=server_name, server_port=server_port)
        
    except Exception as e:
        logger.critical(f"Failed to initialize or launch the application: {e}", exc_info=True)
        print(f"FATAL ERROR: Could not start the application. Check logs. Error: {e}")
