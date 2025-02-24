import os
import json
from typing import Dict, List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from transformers import pipeline

class RAGSystem:
    def __init__(self, data_dir: str = "backend/data/transcripts", model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        """Initialize the RAG system.
        
        Args:
            data_dir (str): Directory containing transcript files
            model_name (str): Name of the sentence transformer model to use
        """
        self.data_dir = data_dir
        self.model = SentenceTransformer(model_name)
        self.qa_pipeline = pipeline("question-answering", model="timpal0l/mdeberta-v3-base-squad2")
        
        # Initialize FAISS index
        self.embedding_size = 384  # Size of embeddings from the model
        self.index = faiss.IndexFlatL2(self.embedding_size)
        
        # Store for text segments and their metadata
        self.segments = []
        self.metadata = []
        
        # Load and index all available transcripts
        self.load_transcripts()
    
    def load_transcripts(self):
        """Load all transcript files from the data directory and create embeddings."""
        if not os.path.exists(self.data_dir):
            print(f"Data directory {self.data_dir} does not exist")
            return
            
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.data_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # Process transcript segments
                    if 'transcript' in data:
                        for segment in data['transcript']:
                            text = segment['text']
                            self.segments.append(text)
                            self.metadata.append({
                                'video_id': data['video_info']['video_id'],
                                'title': data['video_info']['title'],
                                'start': segment.get('start', 0),
                                'duration': segment.get('duration', 0)
                            })
                except Exception as e:
                    print(f"Error loading transcript {filename}: {str(e)}")
        
        # Create embeddings and add to index
        if self.segments:
            embeddings = self.model.encode(self.segments)
            self.index.add(np.array(embeddings).astype('float32'))
            print(f"Indexed {len(self.segments)} segments from transcripts")
    
    def search(self, query: str, k: int = 5) -> List[Dict]:
        """Search for relevant context using the query.
        
        Args:
            query (str): Query text
            k (int): Number of results to return
            
        Returns:
            List[Dict]: List of relevant segments with metadata
        """
        # Get query embedding
        query_embedding = self.model.encode([query])
        
        # Search index
        distances, indices = self.index.search(
            np.array(query_embedding).astype('float32'), 
            k
        )
        
        # Get results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.segments):
                results.append({
                    'text': self.segments[idx],
                    'metadata': self.metadata[idx],
                    'score': float(distances[0][i])
                })
        
        return results
    
    def generate_response(self, query: str, context: str) -> Dict:
        """Generate a response using the question-answering model.
        
        Args:
            query (str): User query
            context (str): Retrieved context
            
        Returns:
            Dict: Model response with answer and confidence score
        """
        try:
            result = self.qa_pipeline(
                question=query,
                context=context,
                max_answer_len=50
            )
            
            return {
                'answer': result['answer'],
                'confidence': float(result['score']),
                'context': context
            }
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return {
                'answer': "I couldn't generate a response. Please try rephrasing your question.",
                'confidence': 0.0,
                'context': context
            }
    
    def query(self, query: str) -> Dict:
        """Process a query through the RAG pipeline.
        
        Args:
            query (str): User query
            
        Returns:
            Dict: Response containing retrieved context and generated answer
        """
        # Get relevant context
        results = self.search(query)
        
        if not results:
            return {
                'context': [],
                'response': {
                    'answer': "I couldn't find any relevant information. Please try another question.",
                    'confidence': 0.0,
                    'context': ""
                }
            }
        
        # Combine context
        context = " ".join([r['text'] for r in results])
        
        # Generate response
        response = self.generate_response(query, context)
        
        return {
            'context': results,
            'response': response
        }
