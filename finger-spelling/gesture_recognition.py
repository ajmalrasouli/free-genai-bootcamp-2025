import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def count_fingers(contour, hull):
    """Count number of fingers using contour properties."""
    try:
        if len(contour) < 5:
            return 0
            
        # Get convex hull and defects
        hull_indices = cv2.convexHull(contour, returnPoints=False)
        if len(hull_indices) < 3:
            return 0
            
        defects = cv2.convexityDefects(contour, hull_indices)
        if defects is None:
            return 0
            
        # Get bounding box for reference
        x, y, w, h = cv2.boundingRect(contour)
        hand_height = h
        
        n_fingers = 0
        potential_fingers = []
        
        for i in range(defects.shape[0]):
            s, e, f, d = defects[i, 0]
            start = tuple(contour[s][0])
            end = tuple(contour[e][0])
            far = tuple(contour[f][0])
            
            # Calculate angle between fingers
            a = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
            b = np.sqrt((far[0] - start[0])**2 + (far[1] - start[1])**2)
            c = np.sqrt((end[0] - far[0])**2 + (end[1] - far[1])**2)
            
            angle = np.arccos((b**2 + c**2 - a**2)/(2*b*c)) if b*c != 0 else 0
            angle = angle * 180/np.pi
            
            # Calculate relative height of defect point
            relative_height = (hand_height - far[1]) / hand_height if hand_height > 0 else 0
            
            # If angle is less than 90 degrees and defect is deep enough
            if angle <= 90 and d > 10000:
                # Check if defect point is in upper half of hand
                if relative_height > 0.3:  # Finger should be in upper 70% of hand
                    potential_fingers.append((far, angle, d))
                    n_fingers += 1
        
        # Add 1 for the highest point (fingertip)
        n_fingers = min(n_fingers + 1, 5)  # Cap at 5 fingers
        
        print(f"Detected {n_fingers} fingers")
        print(f"Found {len(potential_fingers)} potential finger valleys")
        
        return n_fingers
        
    except Exception as e:
        print(f"Error counting fingers: {e}")
        return 0

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
    try:
        # Basic contour checks
        if len(contour) < 5:
            print("Contour too small")
            return np.zeros(8)

        # Calculate basic shape features
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        
        print(f"Area: {area}, Perimeter: {perimeter}")
        
        if area < 1000:  # Minimum area threshold
            print("Area too small")
            return np.zeros(8)
            
        # Calculate convex hull
        hull = cv2.convexHull(contour)
        hull_area = cv2.contourArea(hull)
        
        # Calculate bounding box
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = float(w) / h if h > 0 else 0
        
        # Calculate rotated bounding box
        rect = cv2.minAreaRect(contour)
        box = cv2.boxPoints(rect)
        box = np.int0(box)
        rect_area = cv2.contourArea(box)
        
        # Calculate solidity and convexity
        solidity = float(area) / hull_area if hull_area > 0 else 0
        convexity = float(perimeter) / cv2.arcLength(hull, True) if cv2.arcLength(hull, True) > 0 else 0
        
        # Get accurate finger count
        n_fingers = count_fingers(contour, hull)
        print(f"Detected fingers: {n_fingers}")
        
        # Calculate shape descriptors
        moments = cv2.moments(contour)
        hu_moments = cv2.HuMoments(moments) if moments['m00'] != 0 else np.zeros(7)
        
        # Calculate extent (ratio of contour area to bounding rect area)
        extent = float(area) / (w * h) if w * h > 0 else 0
        
        # Calculate circularity
        circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
        
        print(f"Shape metrics:")
        print(f"- Solidity: {solidity:.3f}")
        print(f"- Convexity: {convexity:.3f}")
        print(f"- Aspect Ratio: {aspect_ratio:.3f}")
        print(f"- Extent: {extent:.3f}")
        print(f"- Circularity: {circularity:.3f}")
        
        # Create feature vector with normalized values
        features = np.array([
            solidity,              # How solid/filled the shape is
            convexity,            # Smoothness of the contour
            aspect_ratio,         # Width/height ratio
            extent,               # How much the shape fills its bounding box
            float(n_fingers)/5.0, # Normalized finger count
            circularity,          # How circular the shape is
            float(area)/hull_area if hull_area > 0 else 0,  # Area ratio
            abs(hu_moments[0][0]) # First Hu moment for rotation invariance
        ])
        
        # Normalize features
        features = features / np.linalg.norm(features) if np.any(features) else features
        
        print(f"Final normalized features: {features}")
        return features
        
    except Exception as e:
        print(f"Error in feature extraction: {str(e)}")
        return np.zeros(8)

# Reference feature vectors for each ASL letter
# Format: [solidity, convexity, aspect_ratio, extent, n_fingers, circularity, area_ratio, hu_moment]
LETTER_FEATURES = {
    'A': np.array([0.95, 0.90, 0.45, 0.85, 0.2, 0.85, 0.95, 0.20]),  # Closed fist
    'B': np.array([0.80, 0.75, 0.35, 0.75, 1.0, 0.60, 0.80, 0.25]),  # Open palm
    'C': np.array([0.85, 0.80, 0.80, 0.70, 0.2, 0.75, 0.85, 0.22]),  # Curved hand
    'D': np.array([0.75, 0.70, 0.50, 0.65, 0.4, 0.70, 0.75, 0.24]),  # Point up
    'E': np.array([0.90, 0.85, 0.60, 0.80, 0.0, 0.80, 0.90, 0.21]),  # Curved fingers
    'F': np.array([0.85, 0.80, 0.55, 0.75, 0.2, 0.75, 0.85, 0.23]),  # Index-thumb touch
    'G': np.array([0.75, 0.70, 0.45, 0.65, 0.2, 0.70, 0.75, 0.25]),  # Point sideways
    'H': np.array([0.70, 0.65, 0.50, 0.60, 0.4, 0.65, 0.70, 0.26]),  # Two fingers
    'I': np.array([0.85, 0.80, 0.30, 0.75, 0.2, 0.75, 0.85, 0.22]),  # Pinky
    'J': np.array([0.85, 0.80, 0.35, 0.75, 0.2, 0.75, 0.85, 0.22]),  # Moving pinky
    'K': np.array([0.70, 0.65, 0.45, 0.60, 0.4, 0.65, 0.70, 0.26]),  # Victory spread
    'L': np.array([0.75, 0.70, 0.40, 0.65, 0.4, 0.70, 0.75, 0.24]),  # L shape
    'M': np.array([0.75, 0.70, 0.55, 0.65, 0.6, 0.65, 0.75, 0.25]),  # Three down
    'N': np.array([0.80, 0.75, 0.50, 0.70, 0.4, 0.70, 0.80, 0.24]),  # Two down
    'O': np.array([0.90, 0.85, 0.90, 0.85, 0.0, 0.90, 0.90, 0.20]),  # O shape
    'P': np.array([0.80, 0.75, 0.45, 0.70, 0.2, 0.75, 0.80, 0.23]),  # P shape
    'Q': np.array([0.80, 0.75, 0.45, 0.70, 0.2, 0.75, 0.80, 0.23]),  # Q shape
    'R': np.array([0.75, 0.70, 0.45, 0.65, 0.4, 0.70, 0.75, 0.25]),  # Crossed
    'S': np.array([0.95, 0.90, 0.35, 0.85, 0.0, 0.85, 0.95, 0.20]),  # Fist
    'T': np.array([0.85, 0.80, 0.40, 0.75, 0.2, 0.75, 0.85, 0.23]),  # T shape
    'U': np.array([0.70, 0.65, 0.45, 0.60, 0.4, 0.65, 0.70, 0.26]),  # Two up
    'V': np.array([0.70, 0.65, 0.40, 0.60, 0.4, 0.65, 0.70, 0.26]),  # Peace
    'W': np.array([0.65, 0.60, 0.45, 0.55, 0.6, 0.60, 0.65, 0.27]),  # Three spread
    'X': np.array([0.85, 0.80, 0.45, 0.75, 0.2, 0.75, 0.85, 0.23]),  # Hook
    'Y': np.array([0.70, 0.65, 0.35, 0.60, 0.4, 0.65, 0.70, 0.26]),  # Hang loose
    'Z': np.array([0.85, 0.80, 0.45, 0.75, 0.2, 0.75, 0.85, 0.23])   # Z motion
}

def normalize_features(features):
    """Normalize feature vector."""
    if np.any(features):
        return features / np.linalg.norm(features)
    return features

def predict_letter(features):
    """Predict ASL letter from hand features."""
    try:
        if not np.any(features):  # Check if features are all zero
            return None, 0
            
        # Feature weights (give more importance to key features)
        weights = np.array([
            1.5,  # solidity - important for closed vs open hand
            1.2,  # convexity - important for finger separation
            1.0,  # aspect_ratio
            1.0,  # extent
            2.0,  # n_fingers - very important for letter distinction
            1.2,  # circularity
            1.3,  # area_ratio
            0.8   # hu_moment
        ])
        
        # Apply weights to features
        features = features * weights
        features = features / np.linalg.norm(features) if np.any(features) else features
        
        print(f"\nInput features (weighted):")
        for i, (feat, weight) in enumerate(zip(features, weights)):
            print(f"Feature {i}: {feat:.3f} (weight: {weight})")
        
        best_matches = []
        for letter, ref_features in LETTER_FEATURES.items():
            # Apply same weights to reference features
            ref_features = ref_features * weights
            ref_features = ref_features / np.linalg.norm(ref_features)
            
            # Calculate similarity
            similarity = cosine_similarity(
                features.reshape(1, -1),
                ref_features.reshape(1, -1)
            )[0][0]
            
            best_matches.append((letter, similarity))
            
        # Sort matches by similarity
        best_matches.sort(key=lambda x: x[1], reverse=True)
        
        # Print top 3 matches
        print("\nTop 3 matches:")
        for letter, sim in best_matches[:3]:
            print(f"{letter}: {sim:.3f}")
            
        best_match, highest_similarity = best_matches[0]
        second_match, second_similarity = best_matches[1]
        
        # Stricter confidence thresholds
        confidence_threshold = 0.7  # Increased from 0.5
        difference_threshold = 0.15  # Increased from 0.1
        
        if highest_similarity > confidence_threshold and \
           (highest_similarity - second_similarity) > difference_threshold:
            print(f"\nConfident prediction: {best_match} ({highest_similarity:.3f})")
            print(f"Gap to second best: {highest_similarity - second_similarity:.3f}")
            return best_match, highest_similarity
        else:
            if highest_similarity <= confidence_threshold:
                print(f"\nNo prediction - confidence too low: {highest_similarity:.3f}")
            else:
                print(f"\nNo prediction - difference too small: {highest_similarity - second_similarity:.3f}")
            return None, 0
            
    except Exception as e:
        print(f"Error in prediction: {e}")
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
