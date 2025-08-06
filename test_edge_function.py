#!/usr/bin/env python3
"""
Test Edge Function Communication
This script tests the Edge Function directly to see what's happening
"""

import requests
import base64
import json
import os

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_edge_function(image_path):
    """Test the Edge Function directly"""
    print(f"🧪 Testing Edge Function with: {image_path}")
    
    try:
        # Encode image to base64
        print("📸 Encoding image to base64...")
        base64_image = encode_image_to_base64(image_path)
        
        # Prepare FormData (like the frontend does)
        files = {'image': ('roti.jpg', open(image_path, 'rb'), 'image/jpeg')}
        
        # Edge Function URL
        url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
        
        print("🚀 Sending request to Edge Function...")
        response = requests.post(url, files=files, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Edge Function Response:")
            print(json.dumps(result, indent=2))
            
            # Check if we got detections
            if 'results' in result and 'detectedFoods' in result['results']:
                detections = result['results']['detectedFoods']
                if detections:
                    print(f"\n🎯 Edge Function detected {len(detections)} items:")
                    for i, detection in enumerate(detections, 1):
                        print(f"  {i}. {detection['name']} (confidence: {detection['confidence']:.2f})")
                else:
                    print("❌ Edge Function returned 0 detections")
            else:
                print("❌ Edge Function response format unexpected")
                
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🌐 Edge Function Test")
    print("=" * 40)
    
    # Test with the same image
    image_path = r"C:\Users\shrav\OneDrive\Pictures\roti.jpg"
    
    if os.path.exists(image_path):
        test_edge_function(image_path)
    else:
        print(f"❌ Image not found: {image_path}")

if __name__ == "__main__":
    main() 