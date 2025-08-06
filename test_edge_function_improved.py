#!/usr/bin/env python3
"""
🔍 Test Improved Edge Function
Test with proper content types
"""

import requests
import json
import base64
from PIL import Image, ImageDraw

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (300, 200), color='white')
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 250, 150], outline='black', width=2)
    draw.text((100, 100), "TEST", fill='black')
    img.save("test_image.jpg")
    return "test_image.jpg"

def test_edge_function_improved():
    """Test Edge Function with proper content types"""
    print("🔍 Test Improved Edge Function")
    print("=" * 40)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
    # Create test image
    test_image_path = create_test_image()
    
    # Test 1: Form data (file upload)
    print("📡 Test 1: Form data upload")
    try:
        with open(test_image_path, "rb") as f:
            files = {'image': (test_image_path, f, 'image/jpeg')}
            
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            files=files,
            timeout=30
        )
        
        print(f"   Status: {response.status_code}")
        if response.ok:
            result = response.json()
            print(f"   ✅ Success: {result.get('message', 'No message')}")
            print(f"   📊 Detections: {result.get('results', {}).get('totalDetections', 0)}")
        else:
            print(f"   ❌ Error: {response.text[:200]}...")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    print()
    
    # Test 2: JSON with base64 image
    print("📡 Test 2: JSON with base64 image")
    try:
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
        
        payload = {
            "image": base64_image,
            "confidence_threshold": 0.5,
            "model": "best.pt"
        }
        
        response = requests.post(
            edge_function_url,
            headers={
                "Authorization": f"Bearer {anon_key}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=30
        )
        
        print(f"   Status: {response.status_code}")
        if response.ok:
            result = response.json()
            print(f"   ✅ Success: {result.get('message', 'No message')}")
            print(f"   📊 Detections: {result.get('results', {}).get('totalDetections', 0)}")
        else:
            print(f"   ❌ Error: {response.text[:200]}...")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    print()

if __name__ == "__main__":
    test_edge_function_improved() 