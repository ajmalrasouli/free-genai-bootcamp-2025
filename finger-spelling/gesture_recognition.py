import cv2
import numpy as np
import mediapipe as mp
import joblib
import os
import logging

logger = logging.getLogger(__name__)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, # Use False for video stream
                       max_num_hands=1,          # Detect only one hand
                       min_detection_confidence=0.5,
                       min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Define expected number of landmarks and features
NUM_LANDMARKS = 21
NUM_COORDS = 3 # x, y, z
MODEL_FILENAME = 'asl_model.joblib' # Placeholder for your trained model

# Load the trained model (if it exists)
if os.path.exists(MODEL_FILENAME):
    try:
        model = joblib.load(MODEL_FILENAME)
        logger.info(f"Loaded trained model from {MODEL_FILENAME}")
        # Assuming the model has a 'classes_' attribute (like scikit-learn models)
        if hasattr(model, 'classes_'):
            CLASS_LABELS = model.classes_
            logger.info(f"Model classes (labels): {CLASS_LABELS}")
        else:
            # Fallback if classes_ attribute is not available
            CLASS_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' # Default assumption
            logger.warning("Model does not have 'classes_' attribute, using default A-Z labels.")

    except Exception as e:
        logger.error(f"Error loading model {MODEL_FILENAME}: {e}. Prediction will not work.")
        model = None
        CLASS_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' # Default
else:
    logger.warning(f"Model file {MODEL_FILENAME} not found. Prediction will not work. Please train a model.")
    model = None
    CLASS_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' # Default

def extract_mediapipe_features(image_rgb):
    """
    Extracts and normalizes hand landmarks using MediaPipe.
    Returns None if no hand detected, otherwise returns a flattened numpy array of normalized landmarks.
    """
    features = None
    hand_landmarks = None

    try:
        # Process the image
        results = hands.process(image_rgb)

        if results.multi_hand_landmarks:
            # Get landmarks for the first detected hand
            hand_landmarks = results.multi_hand_landmarks[0]
            landmark_list = []

            # Use wrist (landmark 0) as the origin for normalization
            wrist = hand_landmarks.landmark[0]
            origin_x, origin_y, origin_z = wrist.x, wrist.y, wrist.z

            for i, landmark in enumerate(hand_landmarks.landmark):
                # Normalize coordinates relative to the wrist
                norm_x = landmark.x - origin_x
                norm_y = landmark.y - origin_y
                norm_z = landmark.z - origin_z # Keep Z for potential 3D features
                landmark_list.extend([norm_x, norm_y, norm_z])

            # Convert to numpy array and flatten
            features = np.array(landmark_list, dtype=np.float32)

            # --- Further Normalization (Optional but Recommended) ---
            # Normalize the entire feature vector by its magnitude (L2 norm)
            # This makes the features scale-invariant
            norm = np.linalg.norm(features)
            if norm > 1e-6: # Avoid division by zero
                features /= norm
            # logger.debug(f"Extracted Features (normalized): {features[:6]}...") # Log first few features

    except Exception as e:
        logger.error(f"Error during MediaPipe processing or feature extraction: {e}", exc_info=True)
        return None, None # Return None for features and landmarks on error

    return features, hand_landmarks # Return both features and landmarks

def predict_letter(features):
    """
    Predict ASL letter from normalized MediaPipe landmark features using the loaded model.
    Requires a trained model saved as 'asl_model.joblib'.
    """
    if model is None:
        # logger.warning("Prediction skipped: Model not loaded.")
        return "MODEL?", 0.0 # Indicate model is missing
    if features is None or features.ndim == 0 or features.size == 0:
        # logger.debug("Prediction skipped: No valid features provided.")
        return None, 0.0

    try:
        # Ensure features are in the correct shape (1 sample, N features)
        if features.ndim == 1:
            features_reshaped = features.reshape(1, -1)
        else:
            features_reshaped = features

        # Make prediction
        prediction_proba = model.predict_proba(features_reshaped)
        best_proba_index = np.argmax(prediction_proba[0])
        predicted_letter = CLASS_LABELS[best_proba_index]
        confidence = prediction_proba[0][best_proba_index]

        # logger.info(f"Predicted: {predicted_letter} (Confidence: {confidence:.2f})")

        # --- Confidence Thresholding (Optional) ---
        # You might want to return None if confidence is too low
        confidence_threshold = 0.6 # Example threshold
        if confidence < confidence_threshold:
             logger.debug(f"Prediction below threshold: {predicted_letter} ({confidence:.2f} < {confidence_threshold})")
             return None, confidence # Or return the uncertain prediction

        return predicted_letter, confidence

    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        return None, 0.0

def draw_hand_analysis(image, hand_landmarks):
    """
    Draws the detected hand landmarks and connections on the image.
    Modifies the input image directly.
    """
    if hand_landmarks:
        try:
            mp_drawing.draw_landmarks(
                image,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())
        except Exception as e:
            logger.error(f"Error drawing landmarks: {e}")
    return image # Return the modified image
