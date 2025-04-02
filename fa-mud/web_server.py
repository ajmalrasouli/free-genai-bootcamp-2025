"""Web server wrapper for Farsi MUD game."""
from flask import Flask, render_template_string, request, jsonify
import logging
import sys
import os
import traceback

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more verbose logging
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# Print diagnostic information
logger.info(f"Python version: {sys.version}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Python path: {sys.path}")
logger.info(f"Environment variables: {os.environ}")

app = Flask(__name__)

# Define a simple HTML page for errors
ERROR_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Error - Farsi MUD Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f0f0;
        }
        .error {
            background-color: #ffebee;
            border: 1px solid #f44336;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Farsi MUD Game - Error</h1>
    <div class="error">
        <h2>{{ error_title }}</h2>
        <p>{{ error_message }}</p>
        {% if error_traceback %}
        <h3>Technical Details:</h3>
        <pre>{{ error_traceback }}</pre>
        {% endif %}
    </div>
</body>
</html>
"""

# Initialize game components
game_initialized = False
engine = None
initialization_error = None

try:
    logger.info("Attempting to import game modules...")
    from game.vocabulary_loader import VocabularyLoader
    from game.engine import GameEngine
    from game.models import Room, Item, NPC
    from main import create_default_rooms
    
    logger.info("Creating game components...")
    vocab_loader = VocabularyLoader()
    logger.info("VocabularyLoader initialized")
    
    rooms = create_default_rooms()
    logger.info(f"Created {len(rooms)} rooms")
    
    logger.info("Initializing game engine...")
    engine = GameEngine(vocab_loader, rooms)
    logger.info("Game engine initialized successfully")
    
    game_initialized = True
except ImportError as e:
    error_tb = traceback.format_exc()
    logger.error(f"Import error: {e}\n{error_tb}")
    initialization_error = f"Failed to import required modules: {str(e)}"
except Exception as e:
    error_tb = traceback.format_exc()
    logger.error(f"Error initializing game components: {e}\n{error_tb}")
    initialization_error = f"Failed to initialize game components: {str(e)}"

# Main HTML template for the game
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Farsi MUD Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f0f0;
        }
        #game-output {
            background-color: white;
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
            height: 400px;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        #command-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
        .command-button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-right: 10px;
        }
        .command-button:hover {
            background-color: #45a049;
        }
        .error {
            color: red;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Farsi MUD Game</h1>
    <div id="game-output"></div>
    <div id="error-message" class="error"></div>
    <input type="text" id="command-input" placeholder="Enter command...">
    <button onclick="sendCommand()" class="command-button">Send</button>
    <div>
        <h3>Common Commands:</h3>
        <button onclick="sendCommand('look')" class="command-button">Look</button>
        <button onclick="sendCommand('inventory')" class="command-button">Inventory</button>
        <button onclick="sendCommand('help')" class="command-button">Help</button>
    </div>
    <script>
        const output = document.getElementById('game-output');
        const input = document.getElementById('command-input');
        const errorDiv = document.getElementById('error-message');

        function appendOutput(text) {
            output.textContent += text + '\\n';
            output.scrollTop = output.scrollHeight;
        }

        function showError(message) {
            errorDiv.textContent = message;
            setTimeout(() => {
                errorDiv.textContent = '';
            }, 5000);
        }

        async function sendCommand(cmd) {
            const command = cmd || input.value;
            if (!command) return;

            try {
                const response = await fetch('/command', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: command }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.error) {
                    showError(data.error);
                } else {
                    appendOutput('> ' + command);
                    appendOutput(data.response);
                    input.value = '';
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Error processing command: ' + error.message);
            }
        }

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendCommand();
            }
        });

        // Initial room description
        sendCommand('look');
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    try:
        if not game_initialized:
            error_message = initialization_error or "Game engine failed to initialize. Please check the container logs for details."
            return render_template_string(
                ERROR_TEMPLATE, 
                error_title="Game Initialization Error", 
                error_message=error_message
            ), 500
        return render_template_string(HTML_TEMPLATE)
    except Exception as e:
        logger.error(f"Error rendering template: {e}")
        error_tb = traceback.format_exc()
        return render_template_string(
            ERROR_TEMPLATE, 
            error_title="Template Error", 
            error_message=str(e),
            error_traceback=error_tb
        ), 500

@app.route('/command', methods=['POST'])
def process_command():
    try:
        if not game_initialized:
            return jsonify({"error": initialization_error or "Game engine not initialized"}), 500
            
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data received")
        
        command = data.get('command', '')
        if not command:
            raise ValueError("No command provided")
        
        # Process command through game engine
        response = engine.process_command(command)
        return jsonify({'response': response})
    
    except Exception as e:
        logger.error(f"Error processing command: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy' if game_initialized else 'unhealthy',
        'game_initialized': game_initialized,
        'error': initialization_error
    })

@app.errorhandler(Exception)
def handle_error(e):
    logger.error(f"Unhandled error: {e}")
    error_tb = traceback.format_exc()
    return jsonify({"error": str(e), "traceback": error_tb}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8001))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    
    logger.info(f"Starting Farsi MUD web server on {host}:{port} (debug={debug})...")
    try:
        app.run(host=host, port=port, debug=debug)
    except Exception as e:
        logger.error(f"Failed to start web server: {e}")
        error_tb = traceback.format_exc()
        logger.error(error_tb)