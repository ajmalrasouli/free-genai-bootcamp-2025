# ASL Finger Spelling Application

An interactive application that helps users learn and practice American Sign Language (ASL) finger spelling using computer vision and machine learning.

## Features

- Real-time hand tracking and gesture recognition
- ASL finger spelling detection and translation
- Interactive learning mode for practicing ASL alphabet
- Performance feedback and accuracy metrics
- User-friendly interface with webcam integration

## Prerequisites

1. Python 3.8 or higher
2. Webcam
3. Required Python packages (install via requirements.txt)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd finger-spelling
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
python app.py
```

2. The web interface will open in your browser

3. Choose a mode:
   - Practice Mode: Learn individual ASL letters
   - Test Mode: Test your knowledge with random letters
   - Free Spelling: Spell words in real-time

4. Position your hand in the camera view:
   - Keep your hand steady and well-lit
   - Make sure all fingers are visible
   - Follow the on-screen guidance

## Supported ASL Alphabet

The application recognizes all 26 letters of the ASL alphabet (A-Z).

## Technical Details

- Hand tracking using MediaPipe
- Custom TensorFlow model for gesture recognition
- Real-time image processing with OpenCV
- Gradio-based web interface

## Troubleshooting

1. **Camera Issues**:
   - Ensure webcam is properly connected
   - Check camera permissions
   - Try closing other applications using the camera

2. **Recognition Issues**:
   - Ensure good lighting conditions
   - Keep hand within the marked area
   - Make gestures clear and precise

3. **Performance Issues**:
   - Close unnecessary background applications
   - Check system requirements
   - Update graphics drivers if needed

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
