# Create BedrockChat
# bedrock_chat.py
import boto3
import streamlit as st
from typing import Optional, Dict, Any


# Set page config
st.set_page_config(page_title="Chat Interface", page_icon="💬")

# Model ID
MODEL_ID = "amazon.nova-micro-v1:0"


class BedrockChat:
    def __init__(self, model_id: str = MODEL_ID):
        """Initialize Bedrock chat client"""
        try:
            self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
            self.model_id = model_id
            self.initialized = True
        except Exception as e:
            st.error(f"Failed to initialize AWS client: {str(e)}")
            self.initialized = False

    def generate_response(self, message: str, inference_config: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """Generate a response using Amazon Bedrock"""
        if not self.initialized:
            return "Chat bot is not properly initialized. Please check AWS credentials."
            
        if inference_config is None:
            inference_config = {"temperature": 0.7}

        messages = [{
            "role": "user",
            "content": [{"text": message}]
        }]

        try:
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig=inference_config
            )
            return response['output']['message']['content'][0]['text']
            
        except Exception as e:
            st.error(f"Error generating response: {str(e)}")
            return f"Error: {str(e)}"


def main():
    st.title("💬 Chat Interface")
    
    # Initialize session state for chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    # Initialize chat bot
    if "chat_bot" not in st.session_state:
        st.session_state.chat_bot = BedrockChat()

    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("What's on your mind?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate response
        with st.chat_message("assistant"):
            response = st.session_state.chat_bot.generate_response(prompt)
            st.markdown(response)
            
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})


if __name__ == "__main__":
    main()
