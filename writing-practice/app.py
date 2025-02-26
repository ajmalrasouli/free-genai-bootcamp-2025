import streamlit as st
import requests
from enum import Enum
import json
from typing import Optional, List, Dict
import openai
import logging
import yaml
import os
from PIL import Image
import pytesseract
import arabic_reshaper
from bidi.algorithm import get_display
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# State Management
class AppState(Enum):
    SETUP = "setup"
    PRACTICE = "practice"
    REVIEW = "review"

class FarsiLearningApp:
    def __init__(self):
        self.initialize_session_state()
        self.load_prompts()
        
    def initialize_session_state(self):
        """Initialize or get session state variables"""
        if 'app_state' not in st.session_state:
            st.session_state.app_state = AppState.SETUP
        if 'current_sentence' not in st.session_state:
            st.session_state.current_sentence = ""
        if 'review_data' not in st.session_state:
            st.session_state.review_data = []

    def load_prompts(self):
        """Load practice prompts from YAML file"""
        with open('prompts.yaml', 'r', encoding='utf-8') as file:
            self.prompts = yaml.safe_load(file)

    def get_english_sentence(self) -> str:
        """Generate a simple English sentence for practice"""
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a language learning assistant. Generate a simple, everyday English sentence that would be useful for a beginner learning Farsi."},
                {"role": "user", "content": "Generate a simple English sentence."}
            ],
            max_tokens=50,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()

    def process_farsi_image(self, image) -> str:
        """Process uploaded image and extract Farsi text using OCR"""
        if image is None:
            return ""
            
        # Convert uploaded file to PIL Image
        img = Image.open(image)
        
        # Configure Tesseract for Farsi
        custom_config = r'--oem 3 --psm 6 -l fas'
        
        # Perform OCR
        text = pytesseract.image_to_string(img, config=custom_config)
        
        return text.strip()

    def display_farsi_text(self, text: str):
        """Display Farsi text with proper RTL formatting"""
        reshaped_text = arabic_reshaper.reshape(text)
        bidi_text = get_display(reshaped_text)
        st.markdown(f'<div dir="rtl" style="font-size: 24px;">{bidi_text}</div>', unsafe_allow_html=True)

    def run(self):
        st.title("Farsi Writing Practice")
        
        if st.session_state.app_state == AppState.SETUP:
            st.write("Welcome to Farsi Writing Practice! Click 'Start Practice' to begin.")
            if st.button("Start Practice"):
                st.session_state.app_state = AppState.PRACTICE
                st.session_state.current_sentence = self.get_english_sentence()
                st.experimental_rerun()

        elif st.session_state.app_state == AppState.PRACTICE:
            st.subheader("Practice Session")
            st.write("English sentence:")
            st.write(st.session_state.current_sentence)
            
            st.write("Upload your handwritten Farsi translation:")
            uploaded_file = st.file_uploader("Choose an image file", type=['png', 'jpg', 'jpeg'])
            
            if uploaded_file is not None:
                st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
                
                if st.button("Process Image"):
                    extracted_text = self.process_farsi_image(uploaded_file)
                    st.write("Extracted Farsi text:")
                    self.display_farsi_text(extracted_text)
                    
                    st.session_state.review_data.append({
                        "english": st.session_state.current_sentence,
                        "farsi": extracted_text
                    })
            
            if st.button("Next Sentence"):
                st.session_state.current_sentence = self.get_english_sentence()
                st.experimental_rerun()
                
            if st.button("Finish Practice"):
                st.session_state.app_state = AppState.REVIEW
                st.experimental_rerun()

        elif st.session_state.app_state == AppState.REVIEW:
            st.subheader("Review Session")
            for idx, data in enumerate(st.session_state.review_data):
                st.write(f"\nPractice {idx + 1}:")
                st.write("English:", data["english"])
                st.write("Your Farsi translation:")
                self.display_farsi_text(data["farsi"])
                
            if st.button("Start New Session"):
                st.session_state.app_state = AppState.SETUP
                st.session_state.review_data = []
                st.experimental_rerun()

if __name__ == "__main__":
    app = FarsiLearningApp()
    app.run()
