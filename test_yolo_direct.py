#!/usr/bin/env python3
"""
Direct YOLO Test - Upload Image and Get Detections
This script directly tests the YOLO service with image upload
"""

import requests
import base64
import json
from PIL import Image
import io
import os

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_yolo_detection(image_path):
    """Test YOLO detection with an image file"""
    print(f"🧪 Testing YOLO Detection with: {image_path}")
    
    # Check if file exists
    if not os.path.exists(image_path):
        print(f"❌ Error: Image file not found: {image_path}")
        return False
    
    try:
        # Encode image to base64
        print("📸 Encoding image to base64...")
        base64_image = encode_image_to_base64(image_path)
        
        # Prepare request to YOLO service
        url = "http://localhost:5000/predict"
        payload = {
            "image": base64_image,
            "confidence_threshold": 0.5,
            "model": "best.pt"
        }
        
        print("🚀 Sending request to YOLO service...")
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ YOLO Service Response:")
            print(json.dumps(result, indent=2))
            
            # Display detections
            if 'detections' in result and result['detections']:
                print(f"\n🎯 Detected {len(result['detections'])} items:")
                for i, detection in enumerate(result['detections'], 1):
                    print(f"  {i}. {detection['name']} (confidence: {detection['confidence']:.2f})")
            else:
                print("❌ No detections found")
                
            return True
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to YOLO service at http://localhost:5000")
        print("Make sure the YOLO service is running: python yolo_inference_service.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🍎 Direct YOLO Detection Test")
    print("=" * 40)
    
    # Test with roti.jpg if it exists
    test_images = [
        "roti.jpg",
        "public/test-images/roti.jpg", 
        "test-images/roti.jpg",
        "images/roti.jpg"
    ]
    
    image_found = False
    for image_path in test_images:
        if os.path.exists(image_path):
            print(f"📁 Found image: {image_path}")
            success = test_yolo_detection(image_path)
            image_found = True
            break
    
    if not image_found:
        print("❌ No test image found!")
        print("Please place your roti.jpg image in the project directory")
        print("Or specify the image path manually:")
        
        # Manual input
        manual_path = input("Enter image path: ").strip()
        if manual_path and os.path.exists(manual_path):
            test_yolo_detection(manual_path)
        else:
            print("❌ Invalid image path")

if __name__ == "__main__":
    main() 