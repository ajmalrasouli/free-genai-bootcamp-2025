import cv2
import numpy as np
import gradio as gr
import logging
from PIL import Image
from datetime import datetime
from gesture_recognition import extract_hand_features, predict_letter, draw_hand_analysis
from asl_reference import get_reference_image_html, get_all_reference_images_html

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('asl_app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ASLFingerSpellingApp:
    def __init__(self):
        self.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        self.current_letter = None
        self.score = 0
        self.total_attempts = 0
        self.recording = False
        self.frame_buffer = []
        logger.info("ASL Finger Spelling App initialized")

    def process_frame(self, image):
        """Process a single frame from webcam."""
        if image is None:
            return None, "No image received", ""
        
        try:
            # Convert from RGB to BGR (OpenCV format)
            frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)  # Reduced kernel size
            
            # Apply adaptive thresholding with adjusted parameters
            thresh = cv2.adaptiveThreshold(
                blurred, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV, 15, 5  # Adjusted block size and C
            )
            
            # Find contours
            contours, _ = cv2.findContours(
                thresh,
                cv2.RETR_EXTERNAL,
                cv2.CHAIN_APPROX_SIMPLE
            )
            
            # Find the largest contour (presumably the hand)
            if contours:
                max_contour = max(contours, key=cv2.contourArea)
                area = cv2.contourArea(max_contour)
                
                # Check if contour is large enough to be a hand
                min_area = frame.shape[0] * frame.shape[1] * 0.02  # 2% of frame area
                if area > min_area:
                    # Extract features and predict letter
                    features = extract_hand_features(max_contour)
                    predicted_letter, confidence = predict_letter(features)
                    
                    # Draw analysis visualization
                    frame = draw_hand_analysis(frame, max_contour)
                    
                    # Draw processed threshold image
                    thresh_rgb = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)
                    debug_image = np.vstack([frame, thresh_rgb])
                    
                    # Add confidence text if letter was predicted
                    if predicted_letter:
                        cv2.putText(
                            debug_image,
                            f"Predicted: {predicted_letter} ({confidence:.2f})",
                            (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 0),
                            2
                        )
                        
                        # Add debug info
                        cv2.putText(debug_image, f"Features: {features.round(2)}", (10, 60),
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
                        
                        # Get reference image HTML
                        ref_html = get_reference_image_html(predicted_letter)
                    else:
                        predicted_letter = None
                        ref_html = ""
                else:
                    predicted_letter = None
                    debug_image = frame.copy()
                    logging.debug(f"Contour too small: {area:.2f} < {min_area:.2f}")
                    ref_html = ""
            else:
                predicted_letter = None
                debug_image = frame.copy()
                ref_html = ""
            
            # Convert back to RGB for display
            output_image = cv2.cvtColor(debug_image, cv2.COLOR_BGR2RGB)
            
            if self.recording:
                self.frame_buffer.append(output_image)
            
            if predicted_letter:
                return output_image, f"Predicted Letter: {predicted_letter} (Confidence: {confidence:.2f})", ref_html
            else:
                return output_image, "No hand detected or gesture not recognized", ""
            
        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            return image, f"Error: {str(e)}", ""

    def practice_mode(self, image):
        """Practice mode - shows the detected letter."""
        return self.process_frame(image)

    def test_mode(self, image):
        """Test mode - compare detected letter with target."""
        if self.current_letter is None:
            self.current_letter = np.random.choice(list(self.letters))
        
        output_image, prediction, ref_html = self.process_frame(image)
        
        if "Predicted Letter" in prediction:
            predicted_letter = prediction.split(": ")[1].split(" ")[0]
            
            if predicted_letter == self.current_letter:
                self.score += 1
            self.total_attempts += 1
            
            accuracy = (self.score / self.total_attempts) * 100 if self.total_attempts > 0 else 0
            return output_image, f"Target: {self.current_letter}, {prediction}, Accuracy: {accuracy:.1f}%", ref_html
        
        return output_image, prediction, ref_html

    def new_letter(self):
        """Generate a new target letter for test mode."""
        self.current_letter = np.random.choice(list(self.letters))
        return f"New target letter: {self.current_letter}"

    def reset_score(self):
        """Reset the accuracy score."""
        self.score = 0
        self.total_attempts = 0
        return "Score reset to 0"

    def toggle_recording(self):
        """Toggle recording state"""
        self.recording = not self.recording
        if not self.recording:
            self.save_recording()
        return "Recording: " + ("ON" if self.recording else "OFF")

    def save_recording(self):
        """Save recorded frames as MP4 video"""
        if len(self.frame_buffer) > 10:
            try:
                filename = f"recording_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp4"
                height, width, _ = self.frame_buffer[0].shape
                video = cv2.VideoWriter(
                    filename,
                    cv2.VideoWriter_fourcc(*'mp4v'),
                    20.0, 
                    (width, height)
                )
                for frame in self.frame_buffer:
                    video.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
                video.release()
                logger.info(f"Saved recording: {filename}")
            except Exception as e:
                logger.error(f"Failed to save recording: {e}")
            finally:
                self.frame_buffer = []

def create_ui():
    """Create the Gradio interface."""
    app = ASLFingerSpellingApp()
    
    with gr.Blocks(title="ASL Finger Spelling Practice") as interface:
        gr.Markdown("# ASL Finger Spelling Practice")
        gr.Markdown("""
        ## Instructions
        1. Position your hand in front of the camera
        2. Make sure there is good lighting
        3. Keep your hand steady
        4. Make clear gestures
        """)
        
        with gr.Tab("Reference Guide"):
            gr.HTML(get_all_reference_images_html())
            
        with gr.Tab("Help & Troubleshooting"):
            gr.Markdown("""
            ## Common Issues & Solutions
            
            ### Hand Detection Problems
            - **Position your hand closer to the camera** - Your hand should occupy at least 2% of the frame
            - **Use good lighting** - Ensure your hand is well-lit without harsh shadows
            - **Use a plain background** - Complex backgrounds can confuse the detection
            - **Hold your hand still** - Rapid movements can be difficult to detect
            
            ### Performance Issues
            - If the app runs slowly, try closing other applications
            - For memory errors, reduce your camera resolution
            - Make sure you have updated graphics drivers
            """)
        
        with gr.Tab("Practice Mode"):
            gr.Markdown("Practice ASL finger spelling - show your hand to the camera")
            with gr.Row():
                with gr.Column():
                    practice_input = gr.Image(sources=["webcam"], streaming=True)
                    practice_text = gr.Textbox(label="Detection Result")
                    practice_ref = gr.HTML(label="Reference")
                with gr.Column():
                    practice_output = gr.Image()
            
            practice_input.stream(
                app.practice_mode,
                inputs=practice_input,
                outputs=[practice_input, practice_text, practice_ref]
            )
        
        with gr.Tab("Test Mode"):
            gr.Markdown("Test your ASL finger spelling - match the target letter")
            with gr.Row():
                with gr.Column():
                    test_input = gr.Image(sources=["webcam"], streaming=True)
                    test_text = gr.Textbox(label="Test Result")
                    new_letter_btn = gr.Button("New Letter")
                    reset_btn = gr.Button("Reset Score")
                    record_btn = gr.Button("Toggle Recording")
                with gr.Column():
                    test_output = gr.Image()
                    test_reference = gr.HTML()
            
            test_input.change(
                fn=app.test_mode,
                inputs=test_input,
                outputs=[test_output, test_text, test_reference],
                show_progress=False
            )
            new_letter_btn.click(fn=app.new_letter, outputs=test_text)
            reset_btn.click(fn=app.reset_score, outputs=test_text)
            record_btn.click(fn=app.toggle_recording, outputs=test_text)
    
    return interface

if __name__ == "__main__":
    import os
    interface = create_ui()
    # Get host and port from environment variables or use defaults
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8002))
    
    print(f"Starting ASL Finger Spelling app on {host}:{port}")
    interface.launch(server_name=host, server_port=port, share=False)
