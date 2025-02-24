import streamlit as st
import sys
import os
from datetime import datetime
import json

# Add parent directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from backend.question_generator import QuestionGenerator
    from backend.audio_generator import AudioGenerator
    from backend.get_transcript import TranscriptDownloader
    from backend.rag_system import RAGSystem
    from backend.chat_system import ChatSystem
    from backend.structured_data import StructuredDataProcessor
    print("Successfully imported backend modules")
except Exception as e:
    print("Error importing backend modules:", str(e))
    st.error(f"Failed to import backend modules: {str(e)}")

# Page config
st.set_page_config(
    page_title="Persian Learning Assistant",
    page_icon="🎧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background-color: #f8f9fa;
        padding: 1rem;
    }
    
    .sidebar {
        background-color: #f1f3f4;
        padding: 1rem;
    }
    
    h1 {
        color: #1a237e;
        font-size: 2.2rem !important;
        font-weight: 600 !important;
        margin-bottom: 1rem !important;
    }
    h2 {
        color: #283593;
        font-size: 1.5rem !important;
        margin-top: 1rem !important;
    }
    h3 {
        color: #303f9f;
        font-size: 1.2rem !important;
    }
    
    .stButton>button {
        background-color: #e91e63;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        transition: background-color 0.3s;
    }
    .stButton>button:hover {
        background-color: #d81b60;
    }
    
    .stSelectbox {
        margin-bottom: 1rem;
    }
    
    .stRadio>label {
        color: #424242;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    
    .card {
        padding: 1.5rem;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 1rem 0;
    }
    
    hr {
        margin: 2rem 0;
        border: 0;
        border-top: 1px solid #e0e0e0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'question_generator' not in st.session_state:
    try:
        st.session_state.question_generator = QuestionGenerator()
        print("QuestionGenerator initialized")
    except Exception as e:
        print("Error initializing QuestionGenerator:", str(e))
        st.error(f"Failed to initialize QuestionGenerator: {str(e)}")

if 'audio_generator' not in st.session_state:
    try:
        st.session_state.audio_generator = AudioGenerator()
        print("AudioGenerator initialized")
    except Exception as e:
        print("Error initializing AudioGenerator:", str(e))
        st.error(f"Failed to initialize AudioGenerator: {str(e)}")

if 'transcript_downloader' not in st.session_state:
    try:
        st.session_state.transcript_downloader = TranscriptDownloader()
        print("TranscriptDownloader initialized")
    except Exception as e:
        print("Error initializing TranscriptDownloader:", str(e))
        st.error(f"Failed to initialize TranscriptDownloader: {str(e)}")

if 'rag_system' not in st.session_state:
    try:
        st.session_state.rag_system = RAGSystem()
        print("RAGSystem initialized")
    except Exception as e:
        print("Error initializing RAGSystem:", str(e))
        st.error(f"Failed to initialize RAGSystem: {str(e)}")

if 'chat_system' not in st.session_state:
    try:
        st.session_state.chat_system = ChatSystem()
        print("ChatSystem initialized")
    except Exception as e:
        print("Error initializing ChatSystem:", str(e))
        st.error(f"Failed to initialize ChatSystem: {str(e)}")

if 'structured_processor' not in st.session_state:
    try:
        st.session_state.structured_processor = StructuredDataProcessor()
        print("StructuredDataProcessor initialized")
    except Exception as e:
        print("Error initializing StructuredDataProcessor:", str(e))
        st.error(f"Failed to initialize StructuredDataProcessor: {str(e)}")

if 'current_question' not in st.session_state:
    st.session_state.current_question = None
if 'current_audio' not in st.session_state:
    st.session_state.current_audio = None
if 'selected_answer' not in st.session_state:
    st.session_state.selected_answer = None
if 'feedback' not in st.session_state:
    st.session_state.feedback = None
if 'generate_clicked' not in st.session_state:
    st.session_state.generate_clicked = False
if 'current_stage' not in st.session_state:
    st.session_state.current_stage = "Chat with Nova"

def on_generate_click():
    st.session_state.generate_clicked = True

# Sidebar
with st.sidebar:
    st.markdown("### Development Stages :")
    
    # Development stage selection
    stages = [
        "Chat with Nova",
        "Raw Transcript",
        "Structured Data",
        "RAG Implementation",
        "Interactive Learning"
    ]
    
    selected_stage = st.radio(
        label="",  # Empty label since we use markdown header above
        options=stages,
        key="stage_selector",
        index=stages.index(st.session_state.current_stage)
    )
    st.session_state.current_stage = selected_stage
    
    st.markdown("---")
    
    # Current focus section
    st.markdown("### Current Focus:")
    if st.session_state.current_stage == "Chat with Nova":
        st.markdown("- Basic Persian learning")
        st.markdown("- Understanding LLM capabilities")
        st.markdown("- Identifying limitations")
        
        st.markdown("### Try These Examples")
        st.text_input("How do I say 'Hello' in Persian?")
        st.text_input("What's the polite form of 'thank you'?")
        st.text_input("How do I count in Persian?")
        
    elif st.session_state.current_stage == "Raw Transcript":
        st.markdown("- YouTube transcript download")
        st.markdown("- Raw text visualization")
        st.markdown("- Initial data examination")
        
    elif st.session_state.current_stage == "Structured Data":
        st.markdown("- Text cleaning")
        st.markdown("- Dialogue extraction")
        st.markdown("- Data structuring")
        
    elif st.session_state.current_stage == "RAG Implementation":
        st.markdown("- Bedrock embeddings")
        st.markdown("- Vector storage")
        st.markdown("- Context retrieval")
        
    else:  # Interactive Learning
        st.markdown("- Scenario generation")
        st.markdown("- Audio synthesis")
        st.markdown("- Interactive practice")

# Main content
def render_chat_stage():
    """Render the chat with Nova stage"""
    st.title("🎯 Persian Learning Assistant")
    st.write("Transform your Persian learning experience with AI-powered conversations.")
    
    st.markdown("This tool demonstrates:")
    st.markdown("- Base LLM Capabilities")
    st.markdown("- RAG (Retrieval Augmented Generation)")
    st.markdown("- Azure Speech Integration")
    st.markdown("- Agent-based Learning Systems")
    
    st.subheader("Chat with Nova")
    st.write("Start by exploring Nova's Persian language capabilities. Try asking questions about Persian grammar, vocabulary, or cultural aspects.")
    
    user_input = st.text_input("Ask about Persian language...", key="chat_input")
    if user_input:
        st.info("Nova: This feature is coming soon! For now, please use the Interactive Learning stage.")

def render_raw_transcript():
    """Render the raw transcript processing stage"""
    st.title("🎯 Persian Learning Assistant")
    st.write("Transform YouTube transcripts into interactive Persian learning experiences.")
    
    st.markdown("This tool demonstrates:")
    st.markdown("- Base LLM Capabilities")
    st.markdown("- RAG (Retrieval Augmented Generation)")
    st.markdown("- Azure Speech Integration")
    st.markdown("- Agent-based Learning Systems")
    
    st.subheader("Raw Transcript Processing")
    
    youtube_url = st.text_input(
        "YouTube URL:",
        placeholder="Enter a Persian lesson YouTube URL",
        key="youtube_url"
    )
    
    col1, col2 = st.columns(2)
    
    if youtube_url:
        try:
            with st.spinner("Downloading transcript..."):
                # First try to extract video ID to validate URL
                video_id = st.session_state.transcript_downloader.extract_video_id(youtube_url)
                if not video_id:
                    st.error("Error: Invalid YouTube URL. Please check the URL and try again.")
                    return
                
                print(f"Processing video ID: {video_id}")
                result = st.session_state.transcript_downloader.download_transcript(youtube_url)
                
                if 'error' in result:
                    st.error(f"Error: {result['error']}")
                    # Show debugging info in expander
                    with st.expander("Debug Information"):
                        st.code(f"""
URL: {youtube_url}
Video ID: {video_id}
Error Details: {result['error']}
                        """)
                else:
                    # Display video info
                    video_info = result['video_info']
                    st.markdown("### Video Information")
                    st.markdown(f"**Title:** {video_info['title']}")
                    st.markdown(f"**Author:** {video_info['author']}")
                    st.markdown(f"**Duration:** {video_info['length']} seconds")
                    st.markdown(f"**Views:** {video_info['views']:,}")
                    st.markdown(f"**Language:** {result['language']}")
                    
                    # Display transcript and stats in columns
                    with col1:
                        st.subheader("Raw Transcript")
                        if result['transcript']:
                            transcript_text = "\n".join([
                                f"[{i+1}] {segment['text']}"
                                for i, segment in enumerate(result['transcript'])
                            ])
                            st.text_area(
                                "Transcript",
                                value=transcript_text,
                                height=400,
                                key="transcript_text"
                            )
                        else:
                            st.warning("No transcript segments found")
                    
                    with col2:
                        st.subheader("Transcript Stats")
                        stats = st.session_state.transcript_downloader.get_transcript_stats(result['transcript'])
                        
                        if stats:
                            st.markdown(f"**Duration:** {stats['total_duration_minutes']:.2f} minutes")
                            st.markdown(f"**Segments:** {stats['total_segments']}")
                            st.markdown(f"**Total Words:** {stats['total_words']}")
                            st.markdown(f"**Avg. Segment Duration:** {stats['average_segment_duration']:.2f} seconds")
                            st.markdown(f"**Avg. Words per Segment:** {stats['average_words_per_segment']:.2f}")
                            
                            # Download button for transcript
                            if st.button("Download Transcript"):
                                transcript_json = json.dumps(result, ensure_ascii=False, indent=2)
                                st.download_button(
                                    "Click to Download",
                                    transcript_json,
                                    file_name=f"{video_info['video_id']}_transcript.json",
                                    mime="application/json"
                                )
                        else:
                            st.warning("No statistics available")
                    
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
            # Show debugging info in expander
            with st.expander("Debug Information"):
                st.code(f"""
URL: {youtube_url}
Error Type: {type(e).__name__}
Error Details: {str(e)}
                """)
    else:
        with col1:
            st.subheader("Raw Transcript")
            st.info("Enter a YouTube URL to see the transcript")
        
        with col2:
            st.subheader("Transcript Stats")
            st.info("Load a transcript to see statistics")

def render_structured_data():
    """Render the structured data processing stage"""
    st.title("📚 Structured Learning Content")
    st.write("Transform raw transcripts into organized learning materials")
    
    # File upload
    uploaded_file = st.file_uploader("Upload Transcript JSON", type=['json'])
    
    if uploaded_file:
        try:
            # Read the file content
            content = uploaded_file.read()
            
            # Show raw content for debugging
            with st.expander("Debug: Raw File Content"):
                st.text(content.decode('utf-8'))
            
            # Parse JSON content
            transcript_data = json.loads(content)
            
            # Show parsed data for debugging
            with st.expander("Debug: Parsed JSON"):
                st.json(transcript_data)
            
            # If transcript_data is a dictionary with a 'transcript' key, extract it
            if isinstance(transcript_data, dict) and 'transcript' in transcript_data:
                transcript_data = transcript_data['transcript']
            
            # Process the transcript
            with st.spinner("Processing transcript..."):
                stats = st.session_state.structured_processor.process_transcript(transcript_data)
                
                if 'error' in stats:
                    st.error(f"Error processing transcript: {stats['error']}")
                else:
                    st.success("Transcript processed successfully!")
                    st.json(stats)
            
            # Display structured content
            tab1, tab2, tab3 = st.tabs(["Dialogues", "Vocabulary", "Grammar"])
            
            with tab1:
                st.subheader("📝 Dialogues")
                level_filter = st.selectbox(
                    "Filter by level",
                    ["All", "Beginner", "Intermediate", "Advanced"],
                    key="dialogue_level"
                )
                
                dialogues = st.session_state.structured_processor.get_dialogues(
                    level_filter.lower() if level_filter != "All" else None
                )
                
                for i, dialogue in enumerate(dialogues, 1):
                    with st.expander(f"Dialogue {i}"):
                        for turn in dialogue:
                            col1, col2 = st.columns([3, 2])
                            with col1:
                                st.markdown(f"**{turn.speaker}:** {turn.text}")
                            with col2:
                                if turn.translation:
                                    st.markdown(f"*Translation:* {turn.translation}")
                                if turn.notes:
                                    st.info(turn.notes)
            
            with tab2:
                st.subheader("📚 Vocabulary")
                level_filter = st.selectbox(
                    "Filter by level",
                    ["All", "Beginner", "Intermediate", "Advanced"],
                    key="vocab_level"
                )
                
                vocabulary = st.session_state.structured_processor.get_vocabulary(
                    level_filter.lower() if level_filter != "All" else None
                )
                
                for item in vocabulary:
                    with st.expander(f"{item.persian} ({item.transliteration})"):
                        st.markdown(f"**English:** {item.english}")
                        st.markdown(f"**Part of Speech:** {item.pos}")
                        st.markdown(f"**Example:** {item.example}")
                        st.markdown(f"**Level:** {item.level}")
            
            with tab3:
                st.subheader("🔤 Grammar Points")
                level_filter = st.selectbox(
                    "Filter by level",
                    ["All", "Beginner", "Intermediate", "Advanced"],
                    key="grammar_level"
                )
                
                grammar_points = st.session_state.structured_processor.get_grammar_points(
                    level_filter.lower() if level_filter != "All" else None
                )
                
                for point in grammar_points:
                    with st.expander(point.title):
                        st.markdown(point.explanation)
                        st.markdown("**Examples:**")
                        for example in point.examples:
                            st.markdown(f"- {example['persian']}")
                            st.markdown(f"  *{example['english']}*")
                            if example['transliteration']:
                                st.markdown(f"  ({example['transliteration']})")
                        st.markdown(f"**Level:** {point.level}")
            
            # Export option
            st.divider()
            col1, col2 = st.columns(2)
            with col1:
                if st.button("Export Structured Data"):
                    try:
                        export_path = "backend/data/structured/output.json"
                        st.session_state.structured_processor.export_data(export_path)
                        st.success(f"Data exported to {export_path}")
                    except Exception as e:
                        st.error(f"Error exporting data: {str(e)}")
            
            with col2:
                if st.button("Clear All Data"):
                    st.session_state.structured_processor = StructuredDataProcessor()
                    st.success("Data cleared successfully!")
                    st.rerun()
                    
        except Exception as e:
            st.error(f"Error processing file: {str(e)}")
    else:
        # Sample transcript format
        st.info("Upload a transcript JSON file to get started")
        st.markdown("""
        Expected format:
        ```json
        [
            {
                "text": "Persian text",
                "translation": "English translation",
                "start": 0.0,
                "duration": 2.0
            },
            ...
        ]
        """
        )

def render_rag_implementation():
    """Render the RAG implementation stage"""
    st.title("🎯 Persian Learning Assistant")
    st.write("Transform YouTube transcripts into interactive Persian learning experiences.")
    
    st.markdown("This tool demonstrates:")
    st.markdown("- Base LLM Capabilities")
    st.markdown("- RAG (Retrieval Augmented Generation)")
    st.markdown("- Azure Speech Integration")
    st.markdown("- Agent-based Learning Systems")
    
    st.subheader("RAG System")
    
    query = st.text_input(
        "Text Query",
        placeholder="Enter a question about Persian...",
        key="rag_query"
    )
    
    if query:
        try:
            with st.spinner("Processing query..."):
                result = st.session_state.rag_system.query(query)
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.subheader("Retrieved Context")
                    if result['context']:
                        for i, ctx in enumerate(result['context'], 1):
                            with st.expander(f"Context {i} (Score: {ctx['score']:.3f})"):
                                st.markdown(f"**From Video:** {ctx['metadata']['title']}")
                                st.markdown(f"**Timestamp:** {ctx['metadata']['start']:.1f}s")
                                st.markdown("**Text:**")
                                st.markdown(ctx['text'])
                    else:
                        st.info("No relevant context found")
                
                with col2:
                    st.subheader("Generated Response")
                    if result['response']['answer']:
                        st.markdown("**Answer:**")
                        st.markdown(result['response']['answer'])
                        st.markdown(f"**Confidence:** {result['response']['confidence']:.2%}")
                    else:
                        st.warning("Could not generate a response")
                    
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
            with st.expander("Debug Information"):
                st.code(f"""
Query: {query}
Error Type: {type(e).__name__}
Error Details: {str(e)}
                """)
    else:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Retrieved Context")
            st.info("Enter a question to see relevant context")
        
        with col2:
            st.subheader("Generated Response")
            st.info("Generated response will appear here")

def render_interactive_stage():
    """Render the interactive learning stage"""
    st.title("🎯 Persian Learning Assistant")
    st.write("Transform YouTube transcripts into interactive Persian learning experiences.")
    
    st.markdown("This tool demonstrates:")
    st.markdown("- Base LLM Capabilities")
    st.markdown("- RAG (Retrieval Augmented Generation)")
    st.markdown("- Azure Speech Integration")
    st.markdown("- Agent-based Learning Systems")
    
    st.subheader("Interactive Learning")
    
    with st.container():
        # Practice type selection
        st.subheader("Select Practice Type")
        practice_type = st.selectbox(
            "Practice Type",
            ["Dialogue Practice", "Vocabulary Practice", "Grammar Practice"]
        )
        
        # Topic selection
        st.subheader("Select Topic")
        topic = st.selectbox(
            "Topic",
            [
                "Daily Conversation",
                "Shopping",
                "Travel",
                "Education",
                "Work and Business",
                "Health and Medical",
                "Family and Relationships",
                "Culture and Traditions"
            ]
        )
        
        # Generate button
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.button("Generate New Question", on_click=on_generate_click, use_container_width=True)
    
    # Handle generation when button is clicked
    if st.session_state.generate_clicked:
        st.session_state.generate_clicked = False  # Reset for next click
        with st.spinner("Generating question and audio..."):
            try:
                print("Generating new question...")
                question = st.session_state.question_generator.generate_similar_question(1, topic)
                print("Question generated:", question)
                
                if question:
                    # Store question in session state
                    st.session_state.current_question = question
                    st.session_state.selected_answer = None
                    st.session_state.feedback = None
                    
                    # Generate audio
                    print("Generating audio...")
                    audio_file = st.session_state.audio_generator.generate_audio(question)
                    print("Audio file path:", audio_file)
                    
                    if audio_file and os.path.exists(audio_file):
                        print(f"Audio file exists at {audio_file}, size: {os.path.getsize(audio_file)} bytes")
                        st.session_state.current_audio = audio_file
                        print("Audio file stored in session state")
                    else:
                        print("Audio file not found or not generated")
                        st.error("Failed to generate audio file")
                else:
                    st.error("Failed to generate question. Please try again.")
            except Exception as e:
                print("Error generating question:", str(e))
                st.error(f"Error: {str(e)}")
    
    # Display current question if available
    if st.session_state.current_question:
        question = st.session_state.current_question
        
        # Create a card-like container for the question
        with st.container():
            st.markdown('<div class="card">', unsafe_allow_html=True)
            
            # Display audio player if available
            if st.session_state.current_audio and os.path.exists(st.session_state.current_audio):
                try:
                    with open(st.session_state.current_audio, 'rb') as audio_file:
                        audio_bytes = audio_file.read()
                        if len(audio_bytes) > 0:
                            st.audio(audio_bytes, format='audio/mp3')
                except Exception as e:
                    print("Error playing audio:", str(e))
                    st.error("Failed to play audio file")
            
            # Display conversation
            st.markdown("### " + question.get('Introduction', ''))
            st.markdown(question.get('Conversation', ''))
            
            # Display question and options
            st.markdown("### " + question.get('Question', ''))
            
            # Create columns for options
            cols = st.columns(2)
            options = question.get('Options', [])
            for i, option in enumerate(options, 1):
                col_idx = (i - 1) % 2
                with cols[col_idx]:
                    if st.button(f"{i}. {option}", key=f"option_{i}", use_container_width=True):
                        st.session_state.selected_answer = i
                        feedback = st.session_state.question_generator.get_feedback(question, i)
                        st.session_state.feedback = feedback
            
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Display feedback if answer selected
            if st.session_state.feedback:
                feedback = st.session_state.feedback
                st.markdown('<div class="card">', unsafe_allow_html=True)
                if feedback['correct']:
                    st.success(feedback['explanation'])
                else:
                    st.error(feedback['explanation'])
                st.markdown('</div>', unsafe_allow_html=True)
    else:
        # Show initial message
        st.info("Click 'Generate New Question' to start practicing!")

def render_chat_with_nova():
    """Render the chat interface with Nova"""
    st.title("💬 Chat with Nova")
    st.write("Your personal Persian language tutor")
    
    # Initialize messages in session state if not present
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "سلام! من نوا هستم. (Salaam! Man Nova hastam.) I'm Nova, your Persian language tutor. How can I help you today?"}
        ]

    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("Ask me anything about Persian..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate and display assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = st.session_state.chat_system.generate_response(prompt)
                st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

    # Sidebar controls
    with st.sidebar:
        st.subheader("Chat Settings")
        
        if st.button("Clear Chat History"):
            st.session_state.messages = [
                {"role": "assistant", "content": "سلام! من نوا هستم. (Salaam! Man Nova hastam.) I'm Nova, your Persian language tutor. How can I help you today?"}
            ]
            st.session_state.chat_system.clear_history()
            st.rerun()
        
        st.divider()
        
        st.markdown("""
        ### Quick Topics
        Click to ask about:
        """)
        
        if st.button("🗣️ Basic Greetings"):
            prompt = "Can you teach me some basic Persian greetings?"
            st.session_state.messages.append({"role": "user", "content": prompt})
            response = st.session_state.chat_system.generate_response(prompt)
            st.session_state.messages.append({"role": "assistant", "content": response})
            st.rerun()
            
        if st.button("📝 Persian Alphabet"):
            prompt = "Can you explain the Persian alphabet?"
            st.session_state.messages.append({"role": "user", "content": prompt})
            response = st.session_state.chat_system.generate_response(prompt)
            st.session_state.messages.append({"role": "assistant", "content": response})
            st.rerun()
            
        if st.button("🔢 Numbers 1-10"):
            prompt = "How do I count from 1 to 10 in Persian?"
            st.session_state.messages.append({"role": "user", "content": prompt})
            response = st.session_state.chat_system.generate_response(prompt)
            st.session_state.messages.append({"role": "assistant", "content": response})
            st.rerun()

def main():
    try:
        if st.session_state.current_stage == "Chat with Nova":
            render_chat_with_nova()
        elif st.session_state.current_stage == "Raw Transcript":
            render_raw_transcript()
        elif st.session_state.current_stage == "Structured Data":
            render_structured_data()
        elif st.session_state.current_stage == "RAG Implementation":
            render_rag_implementation()
        else:  # Interactive Learning
            render_interactive_stage()
    except Exception as e:
        print("Error in main:", str(e))
        st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
