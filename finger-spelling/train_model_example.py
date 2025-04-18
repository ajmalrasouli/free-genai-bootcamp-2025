import numpy as np
import pandas as pd
import joblib
import os
import glob
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier # Example: KNN
# from sklearn.svm import SVC # Example: SVM
# from sklearn.neural_network import MLPClassifier # Example: Neural Network
from sklearn.metrics import accuracy_score, classification_report

# --- Configuration ---
DATA_CSV_PATH = 'asl_landmark_data.csv' # Path where you save collected data
MODEL_SAVE_PATH = 'asl_model.joblib'    # Path to save the trained model
N_NEIGHBORS = 5 # Example parameter for KNN

# --- Data Loading ---
def load_data(csv_path):
    """Loads landmark data from a CSV file."""
    if not os.path.exists(csv_path):
        print(f"Error: Data file not found at {csv_path}")
        print("Please run the data collection process first.")
        return None, None
    try:
        df = pd.read_csv(csv_path)
        # Assuming last column is 'label' and rest are features
        X = df.iloc[:, :-1].values
        y = df.iloc[:, -1].values
        print(f"Loaded {len(df)} samples from {csv_path}")
        return X, y
    except Exception as e:
        print(f"Error loading data from {csv_path}: {e}")
        return None, None

# --- Model Training ---
def train_model(X, y):
    """Trains a simple model on the provided data."""
    if X is None or y is None or len(X) == 0:
        print("Cannot train model: No data loaded.")
        return None

    print(f"Training model on {len(X)} samples...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")

    # --- Choose your model --- 
    # 1. K-Nearest Neighbors (Simple, good starting point)
    model = KNeighborsClassifier(n_neighbors=N_NEIGHBORS)
    
    # 2. Support Vector Machine (Often good for classification)
    # model = SVC(probability=True, random_state=42) # probability=True needed for predict_proba

    # 3. Multi-layer Perceptron (Neural Network - might need more data/tuning)
    # model = MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=500, random_state=42, early_stopping=True)
    # -------------------------
    
    try:
        model.fit(X_train, y_train)
        print("Model training complete.")

        # Evaluate the model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"\nModel Evaluation on Test Set:")
        print(f"Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        # Get unique labels present in both y_test and y_pred
        labels = sorted(list(set(y_test) | set(y_pred)))
        print(classification_report(y_test, y_pred, labels=labels, zero_division=0))

        return model, accuracy

    except Exception as e:
        print(f"Error during model training or evaluation: {e}")
        return None, 0.0

# --- Saving Model ---
def save_model(model, filepath):
    """Saves the trained model to a file."""
    if model is None:
        print("No model to save.")
        return
    try:
        joblib.dump(model, filepath)
        print(f"Model successfully saved to {filepath}")
    except Exception as e:
        print(f"Error saving model to {filepath}: {e}")

# --- Main Execution ---
if __name__ == "__main__":
    print("--- ASL Finger Spelling Model Training Example ---")
    
    # 1. Load Data (Replace with your actual data collection first!)
    # You would need a separate script or function to capture landmarks
    # using extract_mediapipe_features and save them with labels to DATA_CSV_PATH.
    print(f"\nAttempting to load data from: {DATA_CSV_PATH}")
    X, y = load_data(DATA_CSV_PATH)

    if X is not None and y is not None:
        # 2. Train Model
        trained_model, model_accuracy = train_model(X, y)

        # 3. Save Model
        if trained_model is not None:
             print(f"\nAttempting to save model to: {MODEL_SAVE_PATH}")
             save_model(trained_model, MODEL_SAVE_PATH)
    else:
        print("\nExiting training process due to data loading issues.")

    print("\n-----------------------------------------------------")
    print("REMINDER: This is an example training script.")
    print("You MUST collect training data first by capturing hand landmarks")
    print("for each ASL letter and saving them (e.g., to asl_landmark_data.csv).")
    print("Run your data collection, then run this script to train and save the model.")
    print("-----------------------------------------------------") 