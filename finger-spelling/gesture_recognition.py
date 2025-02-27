import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def count_fingers(contour, hull):
    """Count number of fingers using contour properties."""
    try:
        if len(contour) < 5:
            return 0
            
        # Simplify contour to reduce noise
        epsilon = 0.01 * cv2.arcLength(contour, True)
        approx_contour = cv2.approxPolyDP(contour, epsilon, True)
        
        # Get convex hull
        hull_indices = cv2.convexHull(approx_contour, returnPoints=False)
        if len(hull_indices) < 3:
            return 0
            
        try:
            defects = cv2.convexityDefects(approx_contour, hull_indices)
            if defects is None:
                return 0
        except cv2.error:
            # Fall back to simpler method if convexity defects fail
            return estimate_fingers_from_contour(contour)
        
        n_fingers = 0
        for i in range(defects.shape[0]):
            s, e, f, d = defects[i, 0]
            start = tuple(approx_contour[s][0])
            end = tuple(approx_contour[e][0])
            far = tuple(approx_contour[f][0])
            
            # Calculate angle between fingers
            a = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
            b = np.sqrt((far[0] - start[0])**2 + (far[1] - start[1])**2)
            c = np.sqrt((end[0] - far[0])**2 + (end[1] - far[1])**2)
            
            # Avoid division by zero
            if b * c == 0:
                continue
                
            angle = np.arccos((b**2 + c**2 - a**2)/(2*b*c))
            angle = angle * 180/np.pi
            
            # If angle is less than 90 degrees, count as finger
            if angle <= 90 and d > 1000:
                n_fingers += 1
                
        return n_fingers + 1  # Add 1 for the last finger
        
    except Exception:
        return estimate_fingers_from_contour(contour)

def estimate_fingers_from_contour(contour):
    """Estimate number of fingers using contour area and perimeter."""
    # Simple estimation based on contour properties
    area = cv2.contourArea(contour)
    perimeter = cv2.arcLength(contour, True)
    circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
    
    # Rough estimation based on circularity
    if circularity > 0.8:  # Closed fist
        return 0
    elif circularity < 0.4:  # Open hand
        return 5
    else:  # Something in between
        return 2

def extract_hand_features(contour):
    """Extract features from hand contour."""
    if len(contour) < 5:
        return np.zeros(8)  # Return zero features if contour is too small
        
    try:
        # Simplify contour to reduce noise
        epsilon = 0.01 * cv2.arcLength(contour, True)
        contour = cv2.approxPolyDP(contour, epsilon, True)
        
        # Calculate basic shape features
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        
        # Calculate convex hull and its features
        hull = cv2.convexHull(contour)
        hull_area = cv2.contourArea(hull)
        
        # Calculate solidity (ratio of contour area to hull area)
        solidity = float(area) / hull_area if hull_area > 0 else 0
        
        # Calculate aspect ratio using bounding rectangle
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = float(w) / h if h > 0 else 0
        
        # Calculate extent (ratio of contour area to bounding rectangle area)
        extent = float(area) / (w * h) if w * h > 0 else 0
        
        # Hu moments for shape recognition
        moments = cv2.moments(contour)
        hu_moments = cv2.HuMoments(moments)
        hu_features = np.log(np.abs(hu_moments[:3].flatten()) + 1e-9)
        
        # Finger count with improved detection
        n_fingers = count_fingers(contour, hull) / 5  # Normalized 0-1
        
        # Calculate circularity
        circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
        
        # Calculate compactness
        compactness = np.sqrt(4 * area / np.pi) / perimeter if perimeter > 0 else 0
        
        # Return feature vector
        features = np.array([
            area,
            perimeter,
            solidity,
            aspect_ratio,
            hu_features[0],
            hu_features[1],
            hu_features[2],
            n_fingers
        ])
        
        # L2 normalization
        return features / np.linalg.norm(features)
        
    except Exception:
        return np.zeros(8)  # Return zero features if any error occurs

# Reference feature vectors for each ASL letter
LETTER_FEATURES = {
    'A': np.array([0.2, 0.15, 0.95, 0.4, 0.8, 0, 0.7, 0.8]),  # Closed fist
    'B': np.array([0.4, 0.3, 0.75, 0.3, 0.6, 5, 0.4, 0.5]),   # Open palm, fingers together
    'C': np.array([0.3, 0.25, 0.8, 0.8, 0.7, 2, 0.6, 0.7]),   # Curved hand
    'D': np.array([0.25, 0.2, 0.85, 0.6, 0.7, 1, 0.5, 0.6]),  # Index finger pointing up
    'E': np.array([0.15, 0.1, 0.9, 0.5, 0.8, 0, 0.8, 0.9]),   # Curved fingers
    'F': np.array([0.3, 0.25, 0.8, 0.7, 0.7, 2, 0.6, 0.7]),   # Index and thumb touching
    'G': np.array([0.25, 0.2, 0.85, 0.6, 0.7, 1, 0.5, 0.6]),  # Index finger pointing sideways
    'H': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 2, 0.5, 0.6]),   # Index and middle fingers
    'I': np.array([0.2, 0.15, 0.9, 0.3, 0.8, 1, 0.7, 0.8]),   # Pinky finger
    'J': np.array([0.2, 0.15, 0.9, 0.3, 0.8, 1, 0.7, 0.8]),   # Pinky moving in J shape
    'K': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 2, 0.5, 0.6]),   # Index and middle finger spread
    'L': np.array([0.3, 0.25, 0.8, 0.5, 0.7, 2, 0.5, 0.6]),   # L shape with thumb and index
    'M': np.array([0.25, 0.2, 0.85, 0.7, 0.7, 3, 0.6, 0.7]),  # Three fingers down
    'N': np.array([0.25, 0.2, 0.85, 0.7, 0.7, 2, 0.6, 0.7]),  # Two fingers down
    'O': np.array([0.25, 0.2, 0.85, 0.9, 0.7, 0, 0.7, 0.8]),  # O shape
    'P': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 2, 0.5, 0.6]),   # P shape
    'Q': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 1, 0.5, 0.6]),   # Q shape
    'R': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 2, 0.5, 0.6]),   # Crossed fingers
    'S': np.array([0.2, 0.15, 0.95, 0.4, 0.8, 0, 0.7, 0.8]),  # Fist with thumb in front
    'T': np.array([0.25, 0.2, 0.85, 0.5, 0.7, 1, 0.6, 0.7]),  # T shape
    'U': np.array([0.3, 0.25, 0.8, 0.6, 0.7, 2, 0.5, 0.6]),   # Two fingers up
    'V': np.array([0.3, 0.25, 0.8, 0.5, 0.7, 2, 0.5, 0.6]),   # V shape
    'W': np.array([0.35, 0.3, 0.75, 0.5, 0.6, 3, 0.4, 0.5]),  # Three fingers spread
    'X': np.array([0.25, 0.2, 0.85, 0.6, 0.7, 1, 0.5, 0.6]),  # Hook shape
    'Y': np.array([0.3, 0.25, 0.8, 0.4, 0.7, 2, 0.5, 0.6]),   # Y shape
    'Z': np.array([0.25, 0.2, 0.85, 0.6, 0.7, 1, 0.5, 0.6]),  # Z shape motion
}

def normalize_features(features):
    """Normalize feature vector."""
    if np.any(features):
        return features / np.linalg.norm(features)
    return features

def predict_letter(features):
    """Predict ASL letter from hand features."""
    try:
        best_match = None
        highest_similarity = -1
        
        features = normalize_features(features)
        
        for letter, ref_features in LETTER_FEATURES.items():
            similarity = cosine_similarity(
                features.reshape(1, -1),
                ref_features.reshape(1, -1)
            )[0][0]
            
            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match = letter
        
        # Only return a prediction if we're confident enough
        if highest_similarity > 0.6:  
            return best_match, highest_similarity
        return None, 0
        
    except Exception:
        return None, 0

def draw_hand_analysis(image, contour):
    """Draw analysis of hand features on image."""
    try:
        # Simplify contour
        epsilon = 0.01 * cv2.arcLength(contour, True)
        approx_contour = cv2.approxPolyDP(contour, epsilon, True)
        
        # Draw contour
        cv2.drawContours(image, [approx_contour], -1, (0, 255, 0), 2)
        
        # Draw bounding rectangle
        x, y, w, h = cv2.boundingRect(approx_contour)
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)
        
        # Draw convex hull
        hull = cv2.convexHull(approx_contour)
        cv2.drawContours(image, [hull], -1, (0, 0, 255), 2)
        
        # Extract and display features
        features = extract_hand_features(approx_contour)
        n_fingers = int(features[7] * 5)
        
        # Add text with shadow for better visibility
        text = f"Fingers: {n_fingers}"
        cv2.putText(
            image,
            text,
            (x, y - 32),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 0),
            3
        )
        cv2.putText(
            image,
            text,
            (x, y - 32),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )
        
        return image
        
    except Exception:
        return image
