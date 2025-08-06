#!/usr/bin/env python3
"""
Test Render YOLO Model Deployment
Tests the deployed YOLO model on Render at https://trackfit-ai.onrender.com
"""

import requests
import json
import base64
import time
import os
from pathlib import Path

# Configuration
RENDER_URL = "https://trackfit-ai.onrender.com"
TEST_IMAGE_PATH = "test_image.jpg"  # You can use any test image

class RenderYOLOTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'TrackFit-AI-Tester/1.0'
        })
    
    def test_health_check(self):
        """Test the health endpoint"""
        print("🔍 Testing Health Check...")
        try:
            response = self.session.get(f"{self.base_url}/health")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health Check PASSED")
                print(f"   Model Loaded: {data.get('model_loaded', 'Unknown')}")
                print(f"   Model Info: {data.get('model_info', {})}")
                return True
            else:
                print(f"❌ Health Check FAILED")
                return False
                
        except Exception as e:
            print(f"❌ Health Check ERROR: {e}")
            return False
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        print("\n🔍 Testing Root Endpoint...")
        try:
            response = self.session.get(self.base_url)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            
            if response.status_code == 200:
                print(f"✅ Root Endpoint PASSED")
                return True
            else:
                print(f"❌ Root Endpoint FAILED")
                return False
                
        except Exception as e:
            print(f"❌ Root Endpoint ERROR: {e}")
            return False
    
    def encode_image(self, image_path):
        """Encode image to base64"""
        try:
            with open(image_path, 'rb') as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except FileNotFoundError:
            print(f"❌ Image file not found: {image_path}")
            return None
        except Exception as e:
            print(f"❌ Error encoding image: {e}")
            return None
    
    def test_prediction_with_image(self, image_path):
        """Test prediction with an actual image"""
        print(f"\n🔍 Testing Prediction with {image_path}...")
        
        # Encode image
        base64_image = self.encode_image(image_path)
        if not base64_image:
            return False
        
        # Prepare request payload
        payload = {
            "image": base64_image,
            "confidence_threshold": 0.5
        }
        
        try:
            start_time = time.time()
            response = self.session.post(f"{self.base_url}/predict", json=payload)
            end_time = time.time()
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Time: {end_time - start_time:.2f} seconds")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Prediction PASSED")
                print(f"   Success: {data.get('success', False)}")
                print(f"   Detections: {len(data.get('detections', []))}")
                print(f"   Processing Time: {data.get('processing_time', 'Unknown')}")
                
                # Print detections
                detections = data.get('detections', [])
                if detections:
                    print(f"   Detected Foods:")
                    for i, detection in enumerate(detections[:5]):  # Show first 5
                        print(f"     {i+1}. {detection.get('name', 'Unknown')} "
                              f"(Confidence: {detection.get('confidence', 0):.2f})")
                else:
                    print(f"   No detections found")
                
                return True
            else:
                print(f"❌ Prediction FAILED")
                print(f"   Error Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Prediction ERROR: {e}")
            return False
    
    def test_prediction_without_image(self):
        """Test prediction without image (should fail)"""
        print(f"\n🔍 Testing Prediction without Image...")
        
        payload = {
            "confidence_threshold": 0.5
        }
        
        try:
            response = self.session.post(f"{self.base_url}/predict", json=payload)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 400:
                print(f"✅ No Image Test PASSED (correctly rejected)")
                return True
            else:
                print(f"❌ No Image Test FAILED (should have been rejected)")
                return False
                
        except Exception as e:
            print(f"❌ No Image Test ERROR: {e}")
            return False
    
    def test_invalid_payload(self):
        """Test with invalid payload"""
        print(f"\n🔍 Testing Invalid Payload...")
        
        payload = {
            "invalid_field": "test"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/predict", json=payload)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 400:
                print(f"✅ Invalid Payload Test PASSED (correctly rejected)")
                return True
            else:
                print(f"❌ Invalid Payload Test FAILED")
                return False
                
        except Exception as e:
            print(f"❌ Invalid Payload Test ERROR: {e}")
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Render YOLO Model Tests")
        print("=" * 50)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Root Endpoint", self.test_root_endpoint),
            ("Prediction without Image", self.test_prediction_without_image),
            ("Invalid Payload", self.test_invalid_payload),
        ]
        
        # Add image test if image exists
        if os.path.exists(TEST_IMAGE_PATH):
            tests.append(("Prediction with Image", lambda: self.test_prediction_with_image(TEST_IMAGE_PATH)))
        else:
            print(f"⚠️  Test image not found: {TEST_IMAGE_PATH}")
            print(f"   Skipping image prediction test")
        
        results = []
        for test_name, test_func in tests:
            print(f"\n{'='*20} {test_name} {'='*20}")
            result = test_func()
            results.append((test_name, result))
        
        # Summary
        print(f"\n{'='*50}")
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = 0
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name}: {status}")
            if result:
                passed += 1
        
        print(f"\nResults: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Your Render deployment is working correctly!")
        else:
            print("⚠️  Some tests failed. Check the logs above for details.")
        
        return passed == total

def main():
    """Main test function"""
    tester = RenderYOLOTester(RENDER_URL)
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎯 Your YOLO model is ready for production!")
        print(f"   URL: {RENDER_URL}")
        print(f"   Health: {RENDER_URL}/health")
        print(f"   Predict: {RENDER_URL}/predict")
    else:
        print(f"\n🔧 Some issues detected. Please check the deployment logs.")
    
    return success

if __name__ == "__main__":
    main() 