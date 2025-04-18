import cv2
import numpy as np
import mediapipe as mp
import pandas as pd
import os
import logging
import time

# Import functions from gesture_recognition (assuming it's in the same directory)
try:
    from gesture_recognition import extract_mediapipe_features, draw_hand_analysis, NUM_LANDMARKS, NUM_COORDS
except ImportError:
    print("Error: Failed to import from gesture_recognition.py.")
    print("Make sure collect_data.py and gesture_recognition.py are in the same directory.")
    exit()

# --- Configuration ---
SAVE_PATH = 'asl_landmark_data.csv'
LETTERS_TO_COLLECT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' # Or specify a subset like 'ABC'
SAMPLES_PER_LETTER = 50 # Aim for at least 50-100 good samples per letter
DELAY_BETWEEN_SAMPLES = 0.3 # Seconds delay after capture before next is allowed

# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
EXPECTED_FEATURE_COUNT = NUM_LANDMARKS * NUM_COORDS

# --- Data Storage ---
def initialize_csv(filepath):
    """Create CSV with header if it doesn't exist."""
    if not os.path.exists(filepath):
        header = [f'feat_{i}' for i in range(EXPECTED_FEATURE_COUNT)] + ['label']
        df = pd.DataFrame(columns=header)
        df.to_csv(filepath, index=False)
        logging.info(f"Created data file: {filepath}")
    else:
        logging.info(f"Appending data to existing file: {filepath}")

def append_to_csv(filepath, features, label):
    """Append a single sample to the CSV."""
    if features is None or len(features) != EXPECTED_FEATURE_COUNT:
        logging.warning(f"Skipping save for label {label}: Invalid features received.")
        return
    try:
        data_row = np.append(features, label).reshape(1, -1)
        df = pd.DataFrame(data_row) # No header needed for appending
        df.to_csv(filepath, mode='a', header=False, index=False)
        # logging.info(f"Saved sample for label: {label}")
    except Exception as e:
        logging.error(f"Error saving data to {filepath}: {e}")

# --- Main Collection Loop ---
def collect_data():
    cap = cv2.VideoCapture(0) # 0 is usually the default webcam
    if not cap.isOpened():
        logging.error("Error: Could not open webcam.")
        return

    initialize_csv(SAVE_PATH)
    collected_counts = {letter: 0 for letter in LETTERS_TO_COLLECT}
    current_letter_index = 0
    last_capture_time = 0

    print("\n--- ASL Landmark Data Collection ---")
    print(f"Target letters: {LETTERS_TO_COLLECT}")
    print(f"Target samples per letter: {SAMPLES_PER_LETTER}")
    print(f"Data will be saved to: {SAVE_PATH}")
    print("\nInstructions:")
    print("  - Hold the sign for the TARGET LETTER shown on screen.")
    print("  - Press SPACEBAR to capture the landmarks for that letter.")
    print("  - Try to vary hand angle/position slightly for each capture.")
    print("  - Press 'N' to manually skip to the NEXT letter.")
    print("  - Press 'Q' to quit and save.")
    print("------------------------------------")

    while True:
        target_letter = LETTERS_TO_COLLECT[current_letter_index]
        ret, frame = cap.read()
        if not ret:
            logging.error("Error: Failed to capture frame from webcam.")
            break

        # Flip frame horizontally for a more intuitive view
        frame = cv2.flip(frame, 1)
        display_frame = frame.copy()

        # Convert to RGB for MediaPipe
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False # Optimize

        # Extract features and landmarks
        features, landmarks = extract_mediapipe_features(image_rgb)

        image_rgb.flags.writeable = True # Make writable again if needed?

        # Draw landmarks on the display frame
        display_frame = draw_hand_analysis(display_frame, landmarks)

        # --- Display Info ---
        screen_h, screen_w, _ = display_frame.shape
        # Target Letter
        cv2.putText(display_frame, f"TARGET: {target_letter}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        # Collected Count
        count = collected_counts[target_letter]
        text_color = (0, 255, 0) if count >= SAMPLES_PER_LETTER else (0, 165, 255)
        cv2.putText(display_frame, f"Collected: {count}/{SAMPLES_PER_LETTER}", (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, text_color, 2, cv2.LINE_AA)
        # Instructions
        cv2.putText(display_frame, "SPACE: Capture | N: Next Ltr | Q: Quit", (10, screen_h - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

        # Show frame
        cv2.imshow('ASL Data Collection', display_frame)

        # --- Handle Input ---
        key = cv2.waitKey(1) & 0xFF
        current_time = time.time()

        # Quit
        if key == ord('q'):
            print("\nQuitting...")
            break

        # Capture Sample
        elif key == ord(' ') and (current_time - last_capture_time > DELAY_BETWEEN_SAMPLES):
            if features is not None:
                append_to_csv(SAVE_PATH, features, target_letter)
                collected_counts[target_letter] += 1
                last_capture_time = current_time
                print(f"  Captured sample {collected_counts[target_letter]}/{SAMPLES_PER_LETTER} for '{target_letter}'")
                # Automatically move to next letter if enough samples collected
                if collected_counts[target_letter] >= SAMPLES_PER_LETTER:
                     print(f"-- Letter '{target_letter}' complete! --")
                     current_letter_index = (current_letter_index + 1) % len(LETTERS_TO_COLLECT)
                     # Check if all letters are done
                     if all(c >= SAMPLES_PER_LETTER for c in collected_counts.values()):
                         print("\n*** All target samples collected! ***")
                         break # Exit loop
            else:
                print("  Capture failed: No hand landmarks detected.")

        # Next Letter
        elif key == ord('n'):
             current_letter_index = (current_letter_index + 1) % len(LETTERS_TO_COLLECT)
             print(f"\nManually skipped to next letter: '{LETTERS_TO_COLLECT[current_letter_index]}'")

    # --- Cleanup ---
    cap.release()
    cv2.destroyAllWindows()
    print(f"Data collection finished. Data saved to {SAVE_PATH}")

if __name__ == "__main__":
    collect_data() 