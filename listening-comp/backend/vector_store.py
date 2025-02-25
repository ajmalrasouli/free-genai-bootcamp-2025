import numpy as np
import json
import os
from typing import Dict, List, Optional

class SimpleVectorStore:
    def __init__(self, persist_directory: str = "backend/data/vectorstore"):
        """Initialize a simple vector store for JLPT listening questions"""
        self.persist_directory = persist_directory
        self.collections = {}
        self.load_or_create_collections()
    
    def load_or_create_collections(self):
        """Create or load collections from disk"""
        os.makedirs(self.persist_directory, exist_ok=True)
        
        # Initialize empty collections if they don't exist
        self.collections = {
            "section2": {
                "embeddings": [],
                "metadata": [],
                "documents": [],
                "ids": []
            },
            "section3": {
                "embeddings": [],
                "metadata": [],
                "documents": [],
                "ids": []
            }
        }
        
        # Try to load existing data
        for section in self.collections:
            file_path = os.path.join(self.persist_directory, f"{section}.json")
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.collections[section] = data
                except Exception as e:
                    print(f"Error loading collection {section}: {str(e)}")

    def save_collections(self):
        """Save collections to disk"""
        for section, data in self.collections.items():
            file_path = os.path.join(self.persist_directory, f"{section}.json")
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Error saving collection {section}: {str(e)}")

    def add_questions(self, section: str, questions: List[Dict], ids: Optional[List[str]] = None):
        """Add questions to the vector store"""
        if section not in self.collections:
            self.collections[section] = {
                "embeddings": [],
                "metadata": [],
                "documents": [],
                "ids": []
            }
        
        # For testing, just use random vectors as embeddings
        for i, question in enumerate(questions):
            # Create a random embedding vector (this is just for testing)
            embedding = np.random.rand(384).tolist()  # Using 384 dimensions
            
            # Generate an ID if not provided
            question_id = ids[i] if ids and i < len(ids) else f"q{len(self.collections[section]['ids']) + 1}"
            
            self.collections[section]["embeddings"].append(embedding)
            self.collections[section]["metadata"].append(question)
            self.collections[section]["documents"].append(str(question))
            self.collections[section]["ids"].append(question_id)
        
        self.save_collections()

    def search_questions(self, section: str, query: str, n_results: int = 5) -> List[Dict]:
        """Search for similar questions (simplified version)"""
        if section not in self.collections or not self.collections[section]["metadata"]:
            return []
        
        # For testing, just return random questions
        metadata = self.collections[section]["metadata"]
        n = min(n_results, len(metadata))
        indices = np.random.choice(len(metadata), n, replace=False)
        
        return [metadata[i] for i in indices]

    def get_question_by_id(self, section: str, question_id: str) -> Optional[Dict]:
        """Get a question by its ID"""
        if section not in self.collections:
            return None
        
        try:
            idx = self.collections[section]["ids"].index(question_id)
            return self.collections[section]["metadata"][idx]
        except ValueError:
            return None

    def parse_questions_from_file(self, filename: str) -> List[Dict]:
        """Parse questions from a structured text file"""
        questions = []
        current_question = {}
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                
                if line.startswith('<question>'):
                    current_question = {}
                elif line.startswith('Introduction:'):
                    i += 1
                    if i < len(lines):
                        current_question['Introduction'] = lines[i].strip()
                elif line.startswith('Conversation:'):
                    i += 1
                    if i < len(lines):
                        current_question['Conversation'] = lines[i].strip()
                elif line.startswith('Situation:'):
                    i += 1
                    if i < len(lines):
                        current_question['Situation'] = lines[i].strip()
                elif line.startswith('Question:'):
                    i += 1
                    if i < len(lines):
                        current_question['Question'] = lines[i].strip()
                elif line.startswith('Options:'):
                    options = []
                    for _ in range(4):
                        i += 1
                        if i < len(lines):
                            option = lines[i].strip()
                            if option.startswith('1.') or option.startswith('2.') or option.startswith('3.') or option.startswith('4.'):
                                options.append(option[2:].strip())
                    current_question['Options'] = options
                elif line.startswith('</question>'):
                    if current_question:
                        questions.append(current_question)
                        current_question = {}
                i += 1
            return questions
        except Exception as e:
            print(f"Error parsing questions from {filename}: {str(e)}")
            return []

    def index_questions_file(self, filename: str, section_num: int):
        """Index all questions from a file into the vector store"""
        # Extract video ID from filename
        video_id = os.path.basename(filename).split('_section')[0]
        
        # Parse questions from file
        questions = self.parse_questions_from_file(filename)
        
        # Add to vector store
        if questions:
            self.add_questions(f"section{section_num}", questions)
            print(f"Indexed {len(questions)} questions from {filename}")

if __name__ == "__main__":
    # Example usage
    store = SimpleVectorStore()
    
    # Index questions from files
    question_files = [
        ("backend/data/questions/sY7L5cfCWno_section2.txt", 2),
        ("backend/data/questions/sY7L5cfCWno_section3.txt", 3)
    ]
    
    for filename, section_num in question_files:
        if os.path.exists(filename):
            store.index_questions_file(filename, section_num)
    
    # Search for similar questions
    similar = store.search_questions("section2", "誕生日について質問", n_results=1)
