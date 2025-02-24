import os
import sys

# Add the project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print("Python path:", sys.path)
print("Current directory:", os.getcwd())

try:
    from backend.question_generator import QuestionGenerator
    print("Successfully imported QuestionGenerator")
    qg = QuestionGenerator()
    print("Successfully created QuestionGenerator instance")
except Exception as e:
    print("Error importing/creating QuestionGenerator:", str(e))

try:
    from backend.audio_generator import AudioGenerator
    print("Successfully imported AudioGenerator")
    ag = AudioGenerator()
    print("Successfully created AudioGenerator instance")
except Exception as e:
    print("Error importing/creating AudioGenerator:", str(e))
