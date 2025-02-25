from typing import Dict, List, Optional
import json
import os
from datetime import datetime

class ChatSystem:
    def __init__(self):
        self.conversation_history = []
        self.system_prompt = """You are Nova, a friendly and knowledgeable Persian language tutor. Your goal is to help users learn Persian effectively through natural conversation.

Key responsibilities:
1. Language Teaching:
   - Explain grammar concepts clearly
   - Provide vocabulary with proper pronunciation
   - Offer cultural context when relevant
   - Use transliteration when helpful

2. Conversation Practice:
   - Encourage speaking practice
   - Correct errors gently
   - Provide example sentences
   - Adapt to user's proficiency level

3. Cultural Integration:
   - Share Persian cultural insights
   - Explain customs and traditions
   - Connect language to cultural context

Remember to:
- Keep responses concise and focused
- Use both Persian and English
- Provide pronunciation guides
- Be encouraging and patient
- Adapt to the user's level
"""
        # Common Persian words and phrases with translations and pronunciation
        self.common_phrases = {
            "day": {
                "persian": "روز",
                "transliteration": "rooz",
                "example": "امروز روز خوبی است (emrooz rooz-e khobi ast) - Today is a good day"
            },
            "hello": {
                "persian": "سلام",
                "transliteration": "salaam",
                "example": "سلام، حال شما چطور است؟ (salaam, haal-e shomaa chetor ast?) - Hello, how are you?"
            },
            "goodbye": {
                "persian": "خداحافظ",
                "transliteration": "khodaa-haafez",
                "example": "خداحافظ، روز خوبی داشته باشید (khodaa-haafez, rooz-e khoobi daashte baashid) - Goodbye, have a good day"
            },
            "thank you": {
                "persian": "ممنون",
                "transliteration": "mamnoon",
                "example": "خیلی ممنون (kheyli mamnoon) - Thank you very much"
            },
            "yes": {
                "persian": "بله",
                "transliteration": "bale",
                "example": "بله، درست است (bale, dorost ast) - Yes, that's correct"
            },
            "no": {
                "persian": "نه",
                "transliteration": "na",
                "example": "نه، متشکرم (na, moteshakkeram) - No, thank you"
            }
        }
        
        # Learning resources and tips
        self.learning_tips = {
            "how to learn persian": """Here's a structured approach to learning Persian:

1. Start with the Basics:
   - Learn the Persian alphabet (الفبای فارسی)
   - Practice basic greetings (سلام، خداحافظ)
   - Learn numbers 1-10 (۱-۱۰)

2. Essential Resources:
   - Use language learning apps
   - Watch Persian movies with subtitles
   - Listen to Persian music
   - Practice with native speakers

3. Daily Practice:
   - Learn 5 new words each day
   - Practice writing the alphabet
   - Listen to Persian audio content
   - Try to think in Persian

4. Key Tips:
   - Focus on pronunciation first
   - Learn common phrases
   - Practice regularly
   - Don't be afraid to make mistakes""",
            
            "persian alphabet": """The Persian alphabet (الفبای فارسی) has 32 letters:

1. Basic Letters:
   - ا (alef) - like 'a' in father
   - ب (be) - like 'b' in boy
   - پ (pe) - like 'p' in pen
   
2. Writing Direction:
   - Persian is written from right to left
   - Letters connect to each other
   
3. Vowels:
   - Short vowels are usually not written
   - Long vowels: ا، و، ی

Would you like to practice writing any specific letters?""",
            
            "numbers": """Persian Numbers (اعداد):

۱ (yek) - one - یک
۲ (do) - two - دو
۳ (se) - three - سه
۴ (chahaar) - four - چهار
۵ (panj) - five - پنج
۶ (shesh) - six - شش
۷ (haft) - seven - هفت
۸ (hasht) - eight - هشت
۹ (noh) - nine - نه
۱۰ (dah) - ten - ده

Try practicing these numbers! Would you like to learn more?"""
        }

    def format_message(self, role: str, content: str) -> Dict[str, str]:
        return {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }

    def add_message(self, role: str, content: str):
        """Add a message to the conversation history"""
        self.conversation_history.append(self.format_message(role, content))

    def get_conversation_context(self, max_messages: int = 10) -> List[Dict[str, str]]:
        """Get the recent conversation context"""
        return self.conversation_history[-max_messages:]

    def clear_history(self):
        """Clear the conversation history"""
        self.conversation_history = []

    def generate_response(self, user_message: str) -> str:
        """Generate a response using predefined content or RAG system"""
        # Convert message to lowercase for matching
        message_lower = user_message.lower()
        
        # Add user message to history
        self.add_message("user", user_message)
        
        # Check for common word definitions
        for word, info in self.common_phrases.items():
            if word in message_lower or f"what is {word} in persian" in message_lower:
                response = f"""The Persian word for '{word}' is:
                
{info['persian']} ({info['transliteration']})

Example usage:
{info['example']}"""
                self.add_message("assistant", response)
                return response
        
        # Check for learning tips and resources
        for topic, content in self.learning_tips.items():
            if topic in message_lower:
                self.add_message("assistant", content)
                return content
        
        # If no predefined response matches, try using the RAG system
        try:
            # TODO: Implement RAG system integration
            # For now, return a more helpful default response
            response = """I understand you're interested in learning Persian! Let me help you get started.

Some basic phrases to begin with:

1. Hello - سلام (salaam)
2. How are you? - حال شما چطور است؟ (haal-e shomaa chetor ast?)
3. Thank you - ممنون (mamnoon)
4. You're welcome - خواهش می‌کنم (khaahesh mikonam)

Would you like to:
- Learn more basic phrases?
- Practice pronunciation?
- Learn about Persian grammar?
- Study the Persian alphabet?

Just let me know what interests you!"""
            
            self.add_message("assistant", response)
            return response
            
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            default_response = "I apologize, but I'm having trouble generating a response. Could you try rephrasing your question?"
            self.add_message("assistant", default_response)
            return default_response

    def save_conversation(self, filepath: str):
        """Save the conversation history to a file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.conversation_history, f, ensure_ascii=False, indent=2)

    def load_conversation(self, filepath: str):
        """Load a conversation history from a file"""
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                self.conversation_history = json.load(f)
