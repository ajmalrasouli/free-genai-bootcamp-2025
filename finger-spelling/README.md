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
git clone https://github.com/ajmalrasouli/free-genai-bootcamp-2025
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

## Training Your Own Model

The pre-packaged application relies on a model (`asl_model.joblib`) trained on specific hand data. For best performance, you should generate your own dataset and train a model based on your hand, webcam, and lighting conditions.

1.  **Collect Data:**
    *   Run the data collection script from the `finger-spelling` directory:
        ```bash
        python collect_data.py
        ```
    *   Follow the on-screen prompts to record samples for each ASL letter. This will generate/append to the `asl_landmark_data.csv` file.

2.  **Train Model:**
    *   Once you have collected sufficient data (aim for 30-50 samples per letter), run the training script:
        ```bash
        python train_model_example.py
        ```
    *   This script reads `asl_landmark_data.csv` and outputs the trained model file `asl_model.joblib`.

3.  **Important Notes:**
    *   The files `asl_landmark_data.csv` and `asl_model.joblib` are specific to your setup and should **not** be committed to Git. Ensure they are listed in your `.gitignore` file.
    *   **Docker Usage:** If you are running this application via the main project Launcher (`launcher/docker-compose.yml`), the necessary volumes are already configured. This means the `asl_landmark_data.csv` and `asl_model.joblib` files you generate locally in the `finger-spelling` directory will automatically be used by the containerized application.

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
   - Position your hand closer to the camera
   - Make sure your hand occupies at least 2% of the frame
   - Try using a plain background for better contrast

3. **Performance Issues**:
   - Close unnecessary background applications
   - Check system requirements
   - Update graphics drivers if needed
   - If you experience memory errors, reduce camera resolution in settings
   - The application now includes optimizations for better memory management
   - For slow systems, try limiting the frame rate

## Recent Updates

- Improved hand detection with adaptive thresholding
- Added minimum contour size validation (hand must be large enough)
- Optimized memory usage and added error handling
- Reduced frame dimensions for better performance

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
