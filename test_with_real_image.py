#!/usr/bin/env python3
"""
🔍 Test with Real Image
Test with actual roti.jpg image
"""

import requests
import json
import base64
import os

def test_with_real_image():
    """Test with the actual roti.jpg image"""
    print("🔍 Testing with Real Image (roti.jpg)")
    print("=" * 50)
    
    # Check if roti.jpg exists
    if not os.path.exists("roti.jpg"):
        print("❌ roti.jpg not found in current directory")
        print("Please place roti.jpg in the current directory")
        return
    
    print("✅ Found roti.jpg")
    
    # Test 1: YOLO Service Directly
    print("\n🎯 Test 1: YOLO Service Direct")
    print("-" * 30)
    
    try:
        with open("roti.jpg", "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
        
        print(f"📁 Image loaded: {len(image_data)} bytes")
        print(f"📄 Base64 length: {len(base64_image)}")
        
        payload = {
            "image": base64_image,
            "confidence_threshold": 0.5,
            "model": "best.pt"
        }
        
        response = requests.post(
            "http://localhost:5000/predict",
            json=payload,
            timeout=30
        )
        
        if response.ok:
            result = response.json()
            detections = result.get('detections', [])
            print(f"✅ YOLO Direct: Found {len(detections)} detections")
            for i, det in enumerate(detections):
                print(f"  - Detection {i+1}: {det['name']} (confidence: {det['confidence']:.2f})")
        else:
            print(f"❌ YOLO Direct: HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ YOLO Direct Error: {e}")
    
    # Test 2: Edge Function
    print("\n🚀 Test 2: Edge Function")
    print("-" * 30)
    
    try:
        edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
        anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
        
        with open("roti.jpg", "rb") as f:
            files = {'image': ('roti.jpg', f, 'image/jpeg')}
            
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            files=files,
            timeout=30
        )
        
        print(f"📡 Edge Function Status: {response.status_code}")
        
        if response.ok:
            result = response.json()
            print(f"✅ Edge Function: Success")
            print(f"  - Message: {result.get('message', 'No message')}")
            
            if 'results' in result:
                results = result['results']
                print(f"  - Processing Time: {results.get('processingTime', 'N/A')}")
                print(f"  - Detections: {len(results.get('detectedFoods', []))}")
                print(f"  - Model Used: {results.get('modelUsed', 'N/A')}")
                
                # Check for error in results
                if 'error' in results:
                    print(f"  - ❌ Error: {results['error']}")
                if 'errorStack' in results:
                    print(f"  - ❌ Error Stack: {results['errorStack']}")
                    
                # Show detections if any
                detections = results.get('detectedFoods', [])
                if detections:
                    print(f"  - Detected Items:")
                    for i, det in enumerate(detections):
                        print(f"    {i+1}. {det['name']} (confidence: {det['confidence']:.2f})")
                else:
                    print(f"  - No detections found")
                    
            else:
                print(f"  - ❌ No 'results' key in response")
                
        else:
            print(f"❌ Edge Function: HTTP {response.status_code}")
            print(f"  - Error: {response.text[:200]}...")
            
    except Exception as e:
        print(f"❌ Edge Function Error: {e}")
    
    print("\n📊 Summary:")
    print("-" * 30)
    print("1. YOLO Service should find butter_naan detections")
    print("2. Edge Function should show network error (expected)")
    print("3. The issue is Edge Function can't reach local YOLO service")

if __name__ == "__main__":
    test_with_real_image() 