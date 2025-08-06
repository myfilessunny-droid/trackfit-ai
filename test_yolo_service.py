#!/usr/bin/env python3
"""
Test script to verify YOLO service is working
"""

import requests
import base64
import json
from PIL import Image
import io

def create_test_image():
    """Create a simple test image"""
    # Create a simple 100x100 test image
    img = Image.new('RGB', (100, 100), color='red')
    
    # Convert to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    # Convert to base64
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
    return img_base64

def test_yolo_service():
    """Test the YOLO service"""
    print("🧪 Testing YOLO Service...")
    
    # Test 1: Health Check
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get('http://localhost:5000/health')
        health_data = response.json()
        print(f"✅ Health Check: {health_data}")
        
        if not health_data.get('model_loaded'):
            print("⚠️  Model not loaded - this might cause issues")
        else:
            print("✅ Model loaded successfully")
            
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: Image Processing
    print("\n2️⃣ Testing Image Processing...")
    try:
        # Create test image
        test_image = create_test_image()
        
        # Send to YOLO service
        payload = {
            'image': test_image,
            'confidence_threshold': 0.5
        }
        
        response = requests.post('http://localhost:5000/predict', json=payload)
        result = response.json()
        
        print(f"✅ Image Processing Response: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("✅ YOLO service is working!")
            return True
        else:
            print(f"❌ YOLO service error: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Image processing failed: {e}")
        return False

if __name__ == '__main__':
    success = test_yolo_service()
    if success:
        print("\n🎉 YOLO Service is working correctly!")
    else:
        print("\n❌ YOLO Service has issues - check the logs above") 