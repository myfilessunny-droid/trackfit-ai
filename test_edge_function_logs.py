#!/usr/bin/env python3
"""
🔍 Test Edge Function Logs
Check current Edge Function behavior and logs
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

def test_edge_function_with_detailed_logging():
    """Test Edge Function and analyze response for debugging info"""
    print("🔍 Testing Edge Function with Detailed Analysis")
    print("=" * 50)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
    # Create test image
    test_image_path = create_test_image()
    
    print("📁 Test 1: Form Data Upload")
    print("-" * 30)
    
    try:
        with open(test_image_path, "rb") as f:
            files = {'image': (test_image_path, f, 'image/jpeg')}
            
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            files=files,
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.ok:
            result = response.json()
            print(f"✅ Success Response:")
            print(f"  - Message: {result.get('message', 'No message')}")
            print(f"  - Success: {result.get('success', 'No success field')}")
            
            if 'results' in result:
                results = result['results']
                print(f"  - Processing Time: {results.get('processingTime', 'N/A')}")
                print(f"  - Detections: {len(results.get('detectedFoods', []))}")
                print(f"  - Model Used: {results.get('modelUsed', 'N/A')}")
                print(f"  - Image Size: {results.get('imageSize', 'N/A')}")
                print(f"  - Image Type: {results.get('imageType', 'N/A')}")
                
                # Check for error in results
                if 'error' in results:
                    print(f"  - ❌ Error in results: {results['error']}")
                if 'errorStack' in results:
                    print(f"  - ❌ Error Stack: {results['errorStack']}")
                    
            else:
                print(f"  - ❌ No 'results' key in response")
                
            # Check for requestId
            if 'requestId' in result:
                print(f"  - Request ID: {result['requestId']}")
            else:
                print(f"  - No Request ID (old version)")
                
        else:
            print(f"❌ Error Response:")
            print(f"  - Error: {response.text[:200]}...")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n📄 Test 2: JSON with Base64")
    print("-" * 30)
    
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
        
        print(f"Status: {response.status_code}")
        
        if response.ok:
            result = response.json()
            print(f"✅ Success Response:")
            print(f"  - Message: {result.get('message', 'No message')}")
            print(f"  - Success: {result.get('success', 'No success field')}")
            
            if 'results' in result:
                results = result['results']
                print(f"  - Processing Time: {results.get('processingTime', 'N/A')}")
                print(f"  - Detections: {len(results.get('detectedFoods', []))}")
                print(f"  - Model Used: {results.get('modelUsed', 'N/A')}")
                
                # Check for error in results
                if 'error' in results:
                    print(f"  - ❌ Error in results: {results['error']}")
                if 'errorStack' in results:
                    print(f"  - ❌ Error Stack: {results['errorStack']}")
                    
        else:
            print(f"❌ Error Response:")
            print(f"  - Error: {response.text[:200]}...")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n🔍 Analysis:")
    print("-" * 30)
    print("1. Check if processing time is realistic (> 1 second)")
    print("2. Check if there are any error messages in results")
    print("3. Check if requestId is present (indicates new version)")
    print("4. Check if YOLO service URL is being called")

if __name__ == "__main__":
    test_edge_function_with_detailed_logging() 