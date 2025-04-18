import cv2
import numpy as np
import gradio as gr
import logging
from PIL import Image
from datetime import datetime
from gesture_recognition import extract_mediapipe_features, predict_letter, draw_hand_analysis
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
        logger.info("ASL Finger Spelling App initialized (using MediaPipe)")

    def process_frame(self, image):
        """Process a single frame using MediaPipe."""
        if image is None:
            logger.warning("Received None image")
            return None, "No image received", ""
        
        predicted_letter = None
        confidence = 0.0
        output_image = image # Start with the original image
        ref_html = ""

        try:
            # Convert PIL Image to NumPy array (RGB)
            frame_rgb = np.array(image)
            if frame_rgb is None or frame_rgb.size == 0:
                 logger.warning("Failed to convert image to NumPy array")
                 return image, "Image conversion failed", ""
                 
            # Make a writable copy for drawing
            output_image = frame_rgb.copy()

            # 1. Extract Features using MediaPipe
            # This function now returns features AND landmarks
            features, hand_landmarks = extract_mediapipe_features(frame_rgb)

            # 2. Predict Letter (if features were extracted)
            if features is not None:
                predicted_letter, confidence = predict_letter(features)
                # logger.debug(f"Prediction: {predicted_letter}, Confidence: {confidence:.2f}")

            # 3. Draw Landmarks (if detected)
            # Pass the copy of the frame to draw on
            output_image = draw_hand_analysis(output_image, hand_landmarks)

            # Prepare output text and reference html
            if predicted_letter:
                result_text = f"Predicted: {predicted_letter} (Conf: {confidence:.2f})"
                ref_html = get_reference_image_html(predicted_letter)
            elif hand_landmarks:
                result_text = "Hand detected, gesture not recognized" 
                ref_html = ""
            else:
                result_text = "No hand detected"
                ref_html = ""
            
            # Add recording indicator if needed
            if self.recording:
                 cv2.putText(output_image, 'REC', (output_image.shape[1] - 70, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                 self.frame_buffer.append(output_image)

            return output_image, result_text, ref_html
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}", exc_info=True)
            # Return original image on error to avoid crashing Gradio
            return image, f"Error: {str(e)}... Check logs.", ""

    def practice_mode(self, image):
        """Practice mode - shows the detected letter."""
        return self.process_frame(image)

    def test_mode(self, image):
        """Test mode - compare detected letter with target."""
        if self.current_letter is None:
            self.current_letter = np.random.choice(list(self.letters))
        
        output_image, prediction_text, ref_html = self.process_frame(image)
        result_display_text = f"Target: {self.current_letter}, {prediction_text}"
        
        # Try to parse the predicted letter from the text for scoring
        if "Predicted: " in prediction_text:
            try:
                # Example: "Predicted: A (Conf: 0.95)" -> "A"
                parsed_prediction = prediction_text.split("Predicted: ")[1].split(" ")[0]
                if parsed_prediction == "MODEL?": # Handle case where model isn't loaded
                     result_display_text += " (Model not loaded)"
                elif parsed_prediction in self.letters: # Check if it's a valid letter
                    self.total_attempts += 1
                    if parsed_prediction == self.current_letter:
                        self.score += 1
                        result_display_text += " - Correct!" 
                    else:
                        result_display_text += " - Incorrect."
            except IndexError:
                 logger.warning(f"Could not parse predicted letter from: {prediction_text}")
                 pass # Ignore parsing errors for scoring

        # Calculate and add accuracy
        accuracy = (self.score / self.total_attempts) * 100 if self.total_attempts > 0 else 0
        result_display_text += f", Accuracy: {accuracy:.1f}%"
        
        return output_image, result_display_text, ref_html

    def new_letter(self):
        """Generate a new target letter for test mode."""
        self.current_letter = np.random.choice(list(self.letters))
        # Clear attempt flag maybe?
        return f"New target letter: {self.current_letter}"

    def reset_score(self):
        """Reset the accuracy score."""
        self.score = 0
        self.total_attempts = 0
        logger.info("Score reset.")
        return "Score reset to 0"

    def toggle_recording(self):
        """Toggle recording state"""
        self.recording = not self.recording
        status = "ON" if self.recording else "OFF"
        if not self.recording and self.frame_buffer:
            self.save_recording()
        elif self.recording:
             self.frame_buffer = [] # Clear buffer when starting
             logger.info("Started recording frames.")
             
        return f"Recording: {status}"

    def save_recording(self):
        """Save recorded frames as MP4 video"""
        if len(self.frame_buffer) > 10: # Ensure enough frames
            try:
                filename = f"recording_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
                # Ensure frames are BGR for VideoWriter
                # Assuming frame_buffer contains RGB NumPy arrays from process_frame
                frame_bgr_list = [cv2.cvtColor(frame, cv2.COLOR_RGB2BGR) for frame in self.frame_buffer]
                
                if not frame_bgr_list:
                    logger.warning("No frames to save.")
                    return
                    
                height, width, _ = frame_bgr_list[0].shape
                logger.info(f"Saving video {filename} with dimensions {width}x{height}")
                
                video = cv2.VideoWriter(
                    filename,
                    cv2.VideoWriter_fourcc(*'mp4v'),
                    10.0, # Lower frame rate for recordings might be fine
                    (width, height)
                )
                if not video.isOpened():
                     logger.error("Failed to open VideoWriter.")
                     return
                     
                for frame in frame_bgr_list:
                    video.write(frame)
                    
                video.release()
                logger.info(f"Saved recording: {filename}")
                self.frame_buffer = [] # Clear buffer after saving
                gr.Info(f"Recording saved as {filename}") # Gradio feedback
                
            except Exception as e:
                logger.error(f"Failed to save recording: {e}", exc_info=True)
            finally:
                self.frame_buffer = [] # Ensure buffer is cleared
        else:
            logger.warning("Not enough frames captured to save recording.")
            self.frame_buffer = []

def create_ui():
    """Create the Gradio interface."""
    app = ASLFingerSpellingApp()
    
    with gr.Blocks(title="ASL Finger Spelling Practice v2 (MediaPipe)") as interface:
        gr.Markdown("# ASL Finger Spelling Practice (MediaPipe)")
        gr.Markdown("""
        ## Instructions
        1. Position your **entire hand** clearly in front of the camera.
        2. Ensure **good, consistent lighting** without shadows on your hand.
        3. Keep your hand relatively **steady** while making the sign.
        4. Make **clear, distinct** finger spelling gestures.
        5. Detection relies on a **trained model (`asl_model.joblib`)**. If missing, prediction won't work.
        """)
        
        with gr.Tab("Reference Guide"):
            gr.HTML(get_all_reference_images_html())
            
        with gr.Tab("Help & Troubleshooting"):
            gr.Markdown("""
            ## Common Issues & Solutions (MediaPipe Version)
            
            ### "No hand detected"
            - **Lighting is Key:** Ensure your hand is brightly and evenly lit. Avoid backlighting (light source behind hand).
            - **Hand Position:** Keep your full hand visible within the frame. MediaPipe needs to see the palm/back and fingers.
            - **Distance:** Don't be too close or too far. Experiment with distance.
            - **Background:** While less sensitive than before, a relatively plain background still helps.
            - **Remove Obstructions:** Avoid watches, rings, or sleeves covering the wrist/hand.
            
            ### "Hand detected, gesture not recognized" or Incorrect Predictions
            - **Model Not Trained/Loaded:** Check the logs. If `asl_model.joblib` is missing or failed to load, prediction won't work. You need to train a model first (see `train_model_example.py`).
            - **Inaccurate Gesture:** Ensure you are forming the ASL sign correctly according to references.
            - **Inconsistent Gestures:** The trained model learned from specific examples. Try to replicate the signs consistently.
            - **Need More Training Data:** The accuracy heavily depends on the quality and variety of the data used to train the model.
            - **Confidence Too Low:** The model might detect *something* but isn't confident enough. Try making the sign clearer.
            
            ### Performance Issues
            - MediaPipe can be CPU/GPU intensive. Close other demanding applications.
            - Ensure your system meets MediaPipe's requirements.
            """)
        
        with gr.Tab("Practice Mode"):
            gr.Markdown("Practice ASL signs. The model will try to predict the letter.")
            with gr.Row():
                with gr.Column(scale=2):
                    practice_webcam_input = gr.Image(label="Webcam Feed", sources=["webcam"], streaming=True, type="pil")
                with gr.Column(scale=1):
                    practice_processed_output = gr.Image(label="Processed Image w/ Landmarks", interactive=False)
                    practice_prediction_text = gr.Textbox(label="Detection Result", interactive=False)
                    practice_ref_html = gr.HTML(label="Reference Image")
            
            practice_webcam_input.stream(
                app.practice_mode,
                inputs=[practice_webcam_input],
                outputs=[practice_processed_output, practice_prediction_text, practice_ref_html],
                show_progress="hidden"
            )
        
        with gr.Tab("Test Mode"):
            gr.Markdown("Test your ASL skills. Try to match the target letter.")
            with gr.Row():
                with gr.Column(scale=2):
                    test_webcam_input = gr.Image(label="Webcam Feed", sources=["webcam"], streaming=True, type="pil")
                with gr.Column(scale=1):
                    test_processed_output = gr.Image(label="Processed Image w/ Landmarks", interactive=False)
                    test_result_text = gr.Textbox(label="Test Result", interactive=False)
                    target_letter_display = gr.Textbox(label="Target Letter", value="Click 'New Letter'", interactive=False)
                    test_ref_html = gr.HTML(label="Reference Image")
            
            with gr.Row():
                new_letter_btn = gr.Button("New Letter")
                reset_btn = gr.Button("Reset Score")
                record_btn = gr.Button("Toggle Recording")
                recording_status = gr.Textbox(label="Recording Status", value="Recording: OFF", interactive=False)

            new_letter_btn.click(app.new_letter, outputs=[target_letter_display])
            record_btn.click(app.toggle_recording, outputs=[recording_status])
            reset_btn.click(app.reset_score, outputs=[test_result_text]) 

            test_webcam_input.stream(
                app.test_mode,
                inputs=[test_webcam_input],
                outputs=[test_processed_output, test_result_text, test_ref_html],
                show_progress="hidden"
            )
    
    return interface

if __name__ == "__main__":
    logger.info("Creating Gradio UI...")
    web_interface = create_ui()
    logger.info("Launching Gradio interface...")
    web_interface.launch(server_name="0.0.0.0", server_port=8002) # Make accessible over network
    logger.info("Gradio interface launched.")
