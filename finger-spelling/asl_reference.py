import os
import base64
from pathlib import Path

# Dictionary containing base64 encoded reference images for ASL letters
ASL_IMAGES = {
    'A': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEwMCA1MCBDIDEwMCA1MCAxMDAgMTUwIDEwMCAxNTAgQyAxMDAgMTUwIDEwMCAxNTAgMTAwIDE1MCBDIDEwMCAxNTAgMTAwIDE1MCAxMDAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    'B': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDgwIDUwIEMgODAgNTAgODAgMTUwIDgwIDE1MCBNIDgwIDEwMCBDIDgwIDEwMCAxMjAgMTAwIDEyMCAxMDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    'C': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNIDEyMCA1MCBDIDY1IDUwIDY1IDE1MCAxMjAgMTUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4='
}

def get_reference_image_html(letter):
    """Get HTML for displaying reference image of an ASL letter."""
    if letter in ASL_IMAGES:
        return f"""
        <div style="text-align: center; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Reference: Letter {letter}</h3>
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="{ASL_IMAGES[letter]}" 
                     alt="ASL Letter {letter}" 
                     style="max-width: 200px; border: 2px solid #3498db; border-radius: 5px; background-color: white;">
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #7f8c8d;">
                Practice this hand shape
            </div>
        </div>
        """
    return ""

def get_all_reference_images_html():
    """Get HTML for displaying all ASL reference images."""
    html = """
    <div style="padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">ASL Alphabet Reference Guide</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
    """
    
    for letter in sorted(ASL_IMAGES.keys()):
        html += f"""
        <div style="text-align: center; border: 1px solid #e0e0e0; padding: 15px; border-radius: 10px; background-color: #f8f9fa; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Letter {letter}</h3>
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="{ASL_IMAGES[letter]}" 
                     alt="ASL Letter {letter}" 
                     style="width: 100%; max-width: 180px; border: 2px solid #3498db; border-radius: 5px; background-color: white;">
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #7f8c8d;">
                Practice this hand shape
            </div>
        </div>
        """
    
    html += """
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 10px;">
            <h3 style="color: #2c3e50;">How to Use</h3>
            <ol style="text-align: left; max-width: 600px; margin: 0 auto; color: #34495e;">
                <li>Study each letter's hand shape carefully</li>
                <li>Practice making the shape with your dominant hand</li>
                <li>Use the Practice Mode to check your gestures</li>
                <li>Try the Test Mode to test your knowledge</li>
            </ol>
        </div>
    </div>
    """
    return html

def get_letter_description(letter):
    """Get text description of how to form each letter."""
    descriptions = {
        'A': "Make a fist with your thumb resting against the side of your hand.",
        'B': "Hold your hand up with all fingers straight and together, thumb tucked.",
        'C': "Curve your fingers and thumb to form a 'C' shape."
    }
    return descriptions.get(letter, "")
