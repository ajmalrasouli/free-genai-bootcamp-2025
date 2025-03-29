const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8003;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Create a simple index.html file
  const indexPath = path.join(publicDir, 'index.html');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Language Learning Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .word {
            background-color: #e7f4ff;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .word h3 {
            margin-top: 0;
            color: #3498db;
        }
        button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <h1>Language Learning Portal</h1>
    
    <div class="card">
        <h2>Current Status: Placeholder</h2>
        <p>This is a placeholder for the Language Learning Portal. The actual application requires additional setup.</p>
    </div>
    
    <div class="card">
        <h2>Sample Vocabulary</h2>
        
        <div class="word">
            <h3>سلام (salām)</h3>
            <p><strong>Definition:</strong> Hello, peace</p>
            <p><strong>Example:</strong> سلام، حالت چطوره؟ (Hello, how are you?)</p>
        </div>
        
        <div class="word">
            <h3>خداحافظ (khodāhāfez)</h3>
            <p><strong>Definition:</strong> Goodbye</p>
            <p><strong>Example:</strong> خداحافظ، فردا می‌بینمت. (Goodbye, see you tomorrow.)</p>
        </div>
        
        <div class="word">
            <h3>متشکرم (moteshakkeram)</h3>
            <p><strong>Definition:</strong> Thank you</p>
            <p><strong>Example:</strong> متشکرم برای کمکت. (Thank you for your help.)</p>
        </div>
    </div>
    
    <div class="card">
        <h2>Development Status</h2>
        <p>This placeholder interface is running in Docker container <strong>genai-lang-portal</strong> on port <strong>8003</strong>.</p>
        <p>To complete the full implementation, the TypeScript build issues need to be resolved.</p>
    </div>
</body>
</html>
  `;
  fs.writeFileSync(indexPath, htmlContent);
}

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Language Learning Portal is running' });
});

app.get('/api/words', (req, res) => {
  // Return some sample data
  res.json([
    {
      id: 1,
      word: 'سلام',
      transliteration: 'salām',
      definition: 'Hello, peace',
      example: 'سلام، حالت چطوره؟'
    },
    {
      id: 2,
      word: 'خداحافظ',
      transliteration: 'khodāhāfez',
      definition: 'Goodbye',
      example: 'خداحافظ، فردا می‌بینمت.'
    },
    {
      id: 3,
      word: 'متشکرم',
      transliteration: 'moteshakkeram',
      definition: 'Thank you',
      example: 'متشکرم برای کمکت.'
    }
  ]);
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}); 