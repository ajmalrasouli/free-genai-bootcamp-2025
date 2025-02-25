import streamlit as st
from PIL import Image
import io
from manga_ocr import MangaOcr
import random

# Initialize MangaOCR
@st.cache_resource
def load_ocr():
    return MangaOcr()

# Simple word groups for sentence generation
WORD_GROUPS = {
    'greetings': ['hello', 'hi', 'good morning', 'good evening'],
    'subjects': ['I', 'you', 'he', 'she', 'we', 'they'],
    'verbs': ['am', 'is', 'are', 'like', 'love', 'want'],
    'objects': ['food', 'books', 'music', 'movies', 'games'],
}

def generate_simple_sentence():
    """Generate a simple English sentence from word groups."""
    subject = random.choice(WORD_GROUPS['subjects'])
    verb = random.choice(WORD_GROUPS['verbs'])
    obj = random.choice(WORD_GROUPS['objects'])
    return f"{subject} {verb} {obj}"

def main():
    st.title("Language Writing Practice")
    st.write("Generate simple sentences and practice writing them in your target language!")

    # Sidebar for word group selection
    st.sidebar.header("Settings")
    selected_group = st.sidebar.selectbox(
        "Select Word Group",
        ['Basic Sentences', 'Greetings', 'Daily Activities']
    )

    # Main content area
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Practice Area")
        if st.button("Generate New Sentence"):
            st.session_state.current_sentence = generate_simple_sentence()
        
        if 'current_sentence' not in st.session_state:
            st.session_state.current_sentence = generate_simple_sentence()
        
        st.write("English sentence:")
        st.write(st.session_state.current_sentence)
        st.write("Write this sentence in your target language and upload the image below.")

    with col2:
        st.subheader("Upload Your Writing")
        uploaded_file = st.file_uploader("Upload an image of your written text", type=['png', 'jpg', 'jpeg'])
        
        if uploaded_file is not None:
            # Display the uploaded image
            image = Image.open(uploaded_file)
            st.image(image, caption="Your uploaded writing", use_column_width=True)
            
            # Process the image with MangaOCR
            try:
                mocr = load_ocr()
                # Convert PIL Image to bytes
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format=image.format if image.format else 'PNG')
                img_byte_arr = img_byte_arr.getvalue()
                
                # Perform OCR
                text = mocr(image)
                st.write("Detected text:")
                st.write(text)
            except Exception as e:
                st.error(f"Error processing image: {str(e)}")

if __name__ == "__main__":
    main()
