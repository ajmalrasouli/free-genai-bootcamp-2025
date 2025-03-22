from typing import Optional, Dict, List
import boto3
import os
import json
import re
from dataclasses import dataclass
from datetime import datetime

# Model ID
#MODEL_ID = "amazon.nova-micro-v1:0"
MODEL_ID = "amazon.nova-lite-v1:0"

class TranscriptStructurer:
    def __init__(self, model_id: str = MODEL_ID):
        """Initialize Bedrock client"""
        self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.model_id = model_id
        self.prompts = {
            1: """Extract questions from section 問題1 of this JLPT transcript where the answer can be determined solely from the conversation without needing visual aids.
            
            ONLY include questions that meet these criteria:
            - The answer can be determined purely from the spoken dialogue
            - No spatial/visual information is needed (like locations, layouts, or physical appearances)
            - No physical objects or visual choices need to be compared
            
            For example, INCLUDE questions about:
            - Times and dates
            - Numbers and quantities
            - Spoken choices or decisions
            - Clear verbal directions
            
            DO NOT include questions about:
            - Physical locations that need a map or diagram
            - Visual choices between objects
            - Spatial arrangements or layouts
            - Physical appearances of people or things

            Format each question exactly like this:

            <question>
            Introduction:
            [the situation setup in Farsi]
            
            Conversation:
            [the dialogue in Farsi]
            
            Question:
            [the question being asked in Farsi]

            Options:
            1. [first option in Farsi]
            2. [second option in Farsi]
            3. [third option in Farsi]
            4. [fourth option in Farsi]
            </question>

            Rules:
            - Only extract questions from the 問題1 section
            - Only include questions where answers can be determined from dialogue alone
            - Ignore any practice examples (marked with 例)
            - Do not translate any Farsi text
            - Do not include any section descriptions or other text
            - Output questions one after another with no extra text between them
            """,
            
            2: """Extract questions from section 問題2 of this JLPT transcript where the answer can be determined solely from the conversation without needing visual aids.
            
            ONLY include questions that meet these criteria:
            - The answer can be determined purely from the spoken dialogue
            - No spatial/visual information is needed (like locations, layouts, or physical appearances)
            - No physical objects or visual choices need to be compared
            
            For example, INCLUDE questions about:
            - Times and dates
            - Numbers and quantities
            - Spoken choices or decisions
            - Clear verbal directions
            
            DO NOT include questions about:
            - Physical locations that need a map or diagram
            - Visual choices between objects
            - Spatial arrangements or layouts
            - Physical appearances of people or things

            Format each question exactly like this:

            <question>
            Introduction:
            [the situation setup in Farsi]
            
            Conversation:
            [the dialogue in Farsi]
            
            Question:
            [the question being asked in Farsi]
            </question>

            Rules:
            - Only extract questions from the 問題2 section
            - Only include questions where answers can be determined from dialogue alone
            - Ignore any practice examples (marked with 例)
            - Do not translate any Farsi text
            - Do not include any section descriptions or other text
            - Output questions one after another with no extra text between them
            """,
            
            3: """Extract all questions from section 問題3 of this JLPT transcript.
            Format each question exactly like this:

            <question>
            Situation:
            [the situation in Farsi where a phrase is needed]
            
            Question:
            何と言いますか
            </question>

            Rules:
            - Only extract questions from the 問題3 section
            - Ignore any practice examples (marked with 例)
            - Do not translate any Farsi text
            - Do not include any section descriptions or other text
            - Output questions one after another with no extra text between them
            """
        }

    def _invoke_bedrock(self, prompt: str, transcript: str) -> Optional[str]:
        """Make a single call to Bedrock with the given prompt"""
        full_prompt = f"{prompt}\n\nHere's the transcript:\n{transcript}"
        
        messages = [{
            "role": "user",
            "content": [{"text": full_prompt}]
        }]

        try:
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={"temperature": 0}
            )
            return response['output']['message']['content'][0]['text']
        except Exception as e:
            print(f"Error invoking Bedrock: {str(e)}")
            return None

    def structure_transcript(self, transcript: str) -> Dict[int, str]:
        """Structure the transcript into three sections using separate prompts"""
        results = {}
        # Skipping section 1 for now
        for section_num in range(2, 4):
            result = self._invoke_bedrock(self.prompts[section_num], transcript)
            if result:
                results[section_num] = result
        return results

    def save_questions(self, structured_sections: Dict[int, str], base_filename: str) -> bool:
        """Save each section to a separate file"""
        try:
            # Create questions directory if it doesn't exist
            os.makedirs(os.path.dirname(base_filename), exist_ok=True)
            
            # Save each section
            for section_num, content in structured_sections.items():
                filename = f"{os.path.splitext(base_filename)[0]}_section{section_num}.txt"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
            return True
        except Exception as e:
            print(f"Error saving questions: {str(e)}")
            return False

    def load_transcript(self, filename: str) -> Optional[str]:
        """Load transcript from a file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error loading transcript: {str(e)}")
            return None

@dataclass
class DialogueTurn:
    speaker: str
    text: str
    timestamp: float
    translation: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class VocabularyItem:
    persian: str
    english: str
    transliteration: str
    pos: str  # Part of speech
    example: str
    level: str  # beginner, intermediate, advanced

@dataclass
class GrammarPoint:
    title: str
    explanation: str
    examples: List[Dict[str, str]]  # Each example has persian, english, transliteration
    level: str

class StructuredDataProcessor:
    def __init__(self):
        self.dialogues: List[List[DialogueTurn]] = []
        self.vocabulary: List[VocabularyItem] = []
        self.grammar_points: List[GrammarPoint] = []
        
        # Common Persian patterns
        self.patterns = {
            'greeting': r'سلام|درود|صبح بخیر|عصر بخیر|شب بخیر',
            'question': r'آیا|چطور|کجا|چرا|چه|کی',
            'time': r'ساعت|دقیقه|ثانیه|صبح|ظهر|شب',
            'numbers': r'[۰-۹]+|یک|دو|سه|چهار|پنج|شش|هفت|هشت|نه|ده'
        }

    def process_transcript(self, transcript_data: List[Dict]) -> Dict:
        """Process transcript data into structured format"""
        try:
            # Ensure transcript_data is properly formatted
            if isinstance(transcript_data, str):
                transcript_data = json.loads(transcript_data)
            
            # If it's a dictionary, try to find the transcript data
            if isinstance(transcript_data, dict):
                if 'transcript' in transcript_data:
                    transcript_data = transcript_data['transcript']
                elif 'text' in transcript_data:
                    # Single entry format
                    transcript_data = [transcript_data]
                else:
                    # Try to convert dictionary values to list
                    transcript_data = list(transcript_data.values())
            
            if not isinstance(transcript_data, list):
                raise ValueError("Transcript data must be a list of entries")

            # Reset existing data
            self.dialogues = []
            self.vocabulary = []
            self.grammar_points = []
            
            # Extract dialogues
            current_dialogue = []
            for entry in transcript_data:
                if not isinstance(entry, dict):
                    if isinstance(entry, str):
                        # Simple string entry
                        entry = {'text': entry}
                    else:
                        continue
                    
                text = entry.get('text', '')
                if not text:  # Skip empty entries
                    continue
                    
                turn = DialogueTurn(
                    speaker="Speaker",  # You might want to add speaker detection
                    text=text,
                    timestamp=float(entry.get('start', 0.0)),
                    translation=entry.get('translation', None)
                )
                current_dialogue.append(turn)
                
                # If we detect a natural dialogue break (e.g., long pause or topic change)
                if self._is_dialogue_break(entry):
                    if current_dialogue:
                        self.dialogues.append(current_dialogue)
                        current_dialogue = []
            
            # Add any remaining dialogue
            if current_dialogue:
                self.dialogues.append(current_dialogue)
            
            # Extract vocabulary
            self._extract_vocabulary(transcript_data)
            
            # Extract grammar points
            self._extract_grammar_points(transcript_data)
            
            return {
                'dialogues': len(self.dialogues),
                'vocabulary': len(self.vocabulary),
                'grammar_points': len(self.grammar_points),
                'total_turns': sum(len(d) for d in self.dialogues)
            }
            
        except Exception as e:
            print(f"Error processing transcript: {str(e)}")
            import traceback
            traceback.print_exc()
            return {'error': str(e)}

    def _is_dialogue_break(self, entry: Dict) -> bool:
        """Detect natural breaks in dialogue"""
        try:
            # Consider a break if there's a long pause (> 2 seconds)
            current_end = float(entry.get('start', 0)) + float(entry.get('duration', 0))
            next_start = float(entry.get('next_start', current_end))
            if next_start - current_end > 2:
                return True
            
            # Or if we detect a topic change through keywords
            text = str(entry.get('text', '')).lower()
            topic_change_markers = ['خب', 'حالا', 'بنابراین', 'پس', 'در نتیجه']
            return any(marker in text for marker in topic_change_markers)
        except Exception:
            return False

    def _extract_vocabulary(self, transcript_data: List[Dict]):
        """Extract vocabulary items from transcript"""
        seen_words = set()
        
        for entry in transcript_data:
            if not isinstance(entry, dict):
                continue
                
            text = str(entry.get('text', ''))
            if not text:
                continue
                
            # Split text into words, handling Persian text properly
            words = re.findall(r'[\u0600-\u06FF]+', text)  # Match Persian characters
            
            for word in words:
                if word not in seen_words:
                    vocab_item = VocabularyItem(
                        persian=word,
                        english="",  # Would need translation
                        transliteration="",  # Would need transliteration
                        pos="",  # Would need POS tagging
                        example=text,  # Using current sentence as example
                        level="beginner"  # Would need difficulty assessment
                    )
                    self.vocabulary.append(vocab_item)
                    seen_words.add(word)

    def _extract_grammar_points(self, transcript_data: List[Dict]):
        """Extract grammar points from transcript"""
        patterns = {
            'present_tense': r'می‌?[خ|ر|گ|ش|ن]',
            'past_tense': r'[خ|ر|گ|ش|ن]د$',
            'future_tense': r'خواه',
            'plural': r'ها$',
            'possession': r'[م|ت|ش|مان|تان|شان]$'
        }
        
        for entry in transcript_data:
            if not isinstance(entry, dict):
                continue
                
            text = str(entry.get('text', ''))
            if not text:
                continue
                
            for pattern_name, pattern in patterns.items():
                if re.search(pattern, text):
                    grammar_point = GrammarPoint(
                        title=f"{pattern_name} usage",
                        explanation=f"Example of {pattern_name} in Persian",
                        examples=[{
                            'persian': text,
                            'english': str(entry.get('translation', '')),
                            'transliteration': ''  # Would need transliteration
                        }],
                        level="beginner"  # Would need difficulty assessment
                    )
                    self.grammar_points.append(grammar_point)

    def get_dialogues(self, level: Optional[str] = None) -> List[List[DialogueTurn]]:
        """Get dialogues, optionally filtered by level"""
        if level:
            # Implement level filtering logic
            return [d for d in self.dialogues if self._get_dialogue_level(d) == level]
        return self.dialogues

    def get_vocabulary(self, level: Optional[str] = None) -> List[VocabularyItem]:
        """Get vocabulary items, optionally filtered by level"""
        if level:
            return [v for v in self.vocabulary if v.level == level]
        return self.vocabulary

    def get_grammar_points(self, level: Optional[str] = None) -> List[GrammarPoint]:
        """Get grammar points, optionally filtered by level"""
        if level:
            return [g for g in self.grammar_points if g.level == level]
        return self.grammar_points

    def _get_dialogue_level(self, dialogue: List[DialogueTurn]) -> str:
        """Estimate difficulty level of a dialogue"""
        # Implement difficulty assessment logic
        # For now, return beginner
        return "beginner"

    def export_data(self, filepath: str):
        """Export structured data to JSON"""
        data = {
            'dialogues': [[vars(turn) for turn in dialogue] for dialogue in self.dialogues],
            'vocabulary': [vars(item) for item in self.vocabulary],
            'grammar_points': [vars(point) for point in self.grammar_points],
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'total_dialogues': len(self.dialogues),
                'total_vocabulary': len(self.vocabulary),
                'total_grammar_points': len(self.grammar_points)
            }
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def import_data(self, filepath: str):
        """Import structured data from JSON"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        self.dialogues = [
            [DialogueTurn(**turn) for turn in dialogue]
            for dialogue in data.get('dialogues', [])
        ]
        
        self.vocabulary = [
            VocabularyItem(**item)
            for item in data.get('vocabulary', [])
        ]
        
        self.grammar_points = [
            GrammarPoint(**point)
            for point in data.get('grammar_points', [])
        ]

if __name__ == "__main__":
    structurer = TranscriptStructurer()
    transcript = structurer.load_transcript("backend/data/transcripts/sY7L5cfCWno.txt")
    if transcript:
        structured_sections = structurer.structure_transcript(transcript)
        structurer.save_questions(structured_sections, "backend/data/questions/sY7L5cfCWno.txt")