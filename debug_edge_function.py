#!/usr/bin/env python3
"""
🔍 Edge Function Debug Test
Step-by-step verification of each component
"""

import requests
import json
import base64
import time
import os
from datetime import datetime
from PIL import Image, ImageDraw

def create_test_image():
    """Create a simple test image if roti.jpg doesn't exist"""
    if os.path.exists("roti.jpg"):
        return "roti.jpg"
    
    # Create a simple test image
    img = Image.new('RGB', (300, 200), color='white')
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 250, 150], outline='black', width=2)
    draw.text((100, 100), "TEST", fill='black')
    
    img.save("test_image.jpg")
    print("📸 Created test_image.jpg for testing")
    return "test_image.jpg"

def log_step(step_name, status, details=""):
    """Log each test step with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"{timestamp} {status_icon} {step_name}: {status}")
    if details:
        print(f"   Details: {details}")
    print()

def test_yolo_service_direct():
    """Test 1: Direct YOLO service communication"""
    print("🔍 TEST 1: Direct YOLO Service Communication")
    print("=" * 50)
    
    # Step 1.1: Health check
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.ok:
            result = response.json()
            log_step("YOLO Health Check", "PASS", f"Model loaded: {result.get('model_loaded')}")
        else:
            log_step("YOLO Health Check", "FAIL", f"HTTP {response.status_code}")
            return False
    except Exception as e:
        log_step("YOLO Health Check", "FAIL", f"Connection error: {str(e)}")
        return False
    
    # Step 1.2: Test with image
    try:
        test_image_path = create_test_image()
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
        
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
            log_step("YOLO Direct Test", "PASS", f"Found {len(detections)} detections")
            for i, det in enumerate(detections):
                log_step(f"Detection {i+1}", "PASS", f"{det['name']} (confidence: {det['confidence']:.2f})")
        else:
            log_step("YOLO Direct Test", "FAIL", f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_step("YOLO Direct Test", "FAIL", f"Error: {str(e)}")
        return False
    
    return True

def test_edge_function_direct():
    """Test 2: Direct Edge Function communication"""
    print("🔍 TEST 2: Direct Edge Function Communication")
    print("=" * 50)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
    # Step 2.1: Test without image (should fail gracefully)
    try:
        response = requests.post(
            edge_function_url,
            headers={
                "Authorization": f"Bearer {anon_key}",
                "Content-Type": "application/json"
            },
            json={},
            timeout=10
        )
        
        if response.status_code == 400:
            log_step("Edge Function - No Image", "PASS", "Properly rejected missing image")
        else:
            log_step("Edge Function - No Image", "FAIL", f"Unexpected response: {response.status_code}")
            
    except Exception as e:
        log_step("Edge Function - No Image", "FAIL", f"Connection error: {str(e)}")
    
    # Step 2.2: Test with image
    try:
        test_image_path = create_test_image()
        with open(test_image_path, "rb") as f:
            files = {'image': (test_image_path, f, 'image/jpeg')}
            
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            files=files,
            timeout=30
        )
        
        log_step("Edge Function Response", "INFO", f"Status: {response.status_code}")
        log_step("Edge Function Response", "INFO", f"Headers: {dict(response.headers)}")
        
        if response.ok:
            result = response.json()
            log_step("Edge Function - With Image", "PASS", f"Response received")
            log_step("Edge Function Result", "INFO", f"Result: {json.dumps(result, indent=2)}")
        else:
            log_step("Edge Function - With Image", "FAIL", f"HTTP {response.status_code}")
            log_step("Edge Function Error", "INFO", f"Error: {response.text}")
            
    except Exception as e:
        log_step("Edge Function - With Image", "FAIL", f"Error: {str(e)}")

def test_network_connectivity():
    """Test 3: Network connectivity tests"""
    print("🔍 TEST 3: Network Connectivity")
    print("=" * 50)
    
    # Step 3.1: Test localhost connectivity
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        log_step("Localhost Connectivity", "PASS", f"Response time: {response.elapsed.total_seconds():.2f}s")
    except Exception as e:
        log_step("Localhost Connectivity", "FAIL", f"Error: {str(e)}")
    
    # Step 3.2: Test Edge Function connectivity
    try:
        response = requests.get("https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food", timeout=10)
        log_step("Edge Function Connectivity", "PASS", f"Response time: {response.elapsed.total_seconds():.2f}s")
    except Exception as e:
        log_step("Edge Function Connectivity", "FAIL", f"Error: {str(e)}")

def test_yolo_service_from_edge_function():
    """Test 4: Simulate what Edge Function should do"""
    print("🔍 TEST 4: Simulate Edge Function Process")
    print("=" * 50)
    
    # Step 4.1: Load and encode image
    try:
        test_image_path = create_test_image()
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
        
        log_step("Image Encoding", "PASS", f"Image size: {len(image_data)} bytes")
        
    except Exception as e:
        log_step("Image Encoding", "FAIL", f"Error: {str(e)}")
        return
    
    # Step 4.2: Create payload like Edge Function would
    payload = {
        "image": base64_image,
        "confidence_threshold": 0.5,
        "model": "best.pt"
    }
    
    log_step("Payload Creation", "PASS", f"Payload size: {len(json.dumps(payload))} chars")
    
    # Step 4.3: Send to YOLO service with different timeouts
    timeouts = [5, 10, 30]
    
    for timeout in timeouts:
        try:
            start_time = time.time()
            response = requests.post(
                "http://localhost:5000/predict",
                json=payload,
                timeout=timeout
            )
            elapsed = time.time() - start_time
            
            if response.ok:
                result = response.json()
                detections = result.get('detections', [])
                log_step(f"YOLO Request ({timeout}s timeout)", "PASS", 
                        f"Time: {elapsed:.2f}s, Detections: {len(detections)}")
            else:
                log_step(f"YOLO Request ({timeout}s timeout)", "FAIL", 
                        f"HTTP {response.status_code}")
                        
        except requests.exceptions.Timeout:
            log_step(f"YOLO Request ({timeout}s timeout)", "FAIL", "Timeout")
        except Exception as e:
            log_step(f"YOLO Request ({timeout}s timeout)", "FAIL", f"Error: {str(e)}")

def main():
    """Run all debug tests"""
    print("🚀 Edge Function Debug Test Suite")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run all tests
    test_yolo_service_direct()
    test_network_connectivity()
    test_edge_function_direct()
    test_yolo_service_from_edge_function()
    
    print("🏁 Debug Test Suite Complete")
    print("=" * 60)

if __name__ == "__main__":
    main() 