#!/usr/bin/env python3
"""
🧪 Test Render YOLO Deployment
Quick script to test your Render deployment
"""

import requests
import json
import base64
from PIL import Image
import io

def test_render_deployment(render_url):
    """Test your Render YOLO deployment"""
    
    print(f"🧪 Testing Render deployment: {render_url}")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1️⃣ Testing Health Check...")
    try:
        health_response = requests.get(f"{render_url}/health", timeout=30)
        if health_response.status_code == 200:
            health_data = health_response.json()
            print("✅ Health check passed!")
            print(f"   Status: {health_data.get('status')}")
            print(f"   Model loaded: {health_data.get('model_loaded')}")
            if health_data.get('model_info'):
                print(f"   Model type: {health_data.get('model_info', {}).get('model_type')}")
        else:
            print(f"❌ Health check failed: {health_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test 2: Root endpoint
    print("\n2️⃣ Testing Root Endpoint...")
    try:
        root_response = requests.get(render_url, timeout=30)
        if root_response.status_code == 200:
            root_data = root_response.json()
            print("✅ Root endpoint working!")
            print(f"   Service: {root_data.get('service')}")
            print(f"   Model loaded: {root_data.get('model_loaded')}")
        else:
            print(f"❌ Root endpoint failed: {root_response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test 3: Prediction with test image
    print("\n3️⃣ Testing Prediction Endpoint...")
    try:
        # Create a simple test image (1x1 pixel)
        test_image = Image.new('RGB', (100, 100), color='red')
        img_buffer = io.BytesIO()
        test_image.save(img_buffer, format='JPEG')
        img_buffer.seek(0)
        
        # Convert to base64
        base64_image = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        
        # Send prediction request
        prediction_data = {
            "image": base64_image,
            "confidence_threshold": 0.5,
            "model": "best.pt"
        }
        
        prediction_response = requests.post(
            f"{render_url}/predict",
            json=prediction_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if prediction_response.status_code == 200:
            prediction_result = prediction_response.json()
            print("✅ Prediction endpoint working!")
            print(f"   Success: {prediction_result.get('success')}")
            print(f"   Detections: {prediction_result.get('total_detections', 0)}")
            if prediction_result.get('processing_time'):
                print(f"   Processing time: {prediction_result.get('processing_time')}s")
        else:
            print(f"❌ Prediction failed: {prediction_response.status_code}")
            print(f"   Response: {prediction_response.text}")
            
    except Exception as e:
        print(f"❌ Prediction error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Render deployment test completed!")
    print("If all tests passed, your YOLO service is ready!")
    
    return True

def main():
    """Main function"""
    print("🚀 Render YOLO Deployment Test")
    print("=" * 50)
    
    # Get Render URL from user
    render_url = input("Enter your Render URL (e.g., https://your-app.onrender.com): ").strip()
    
    if not render_url:
        print("❌ Please provide a valid Render URL")
        return
    
    # Remove trailing slash if present
    if render_url.endswith('/'):
        render_url = render_url[:-1]
    
    # Test the deployment
    test_render_deployment(render_url)

if __name__ == "__main__":
    main() 