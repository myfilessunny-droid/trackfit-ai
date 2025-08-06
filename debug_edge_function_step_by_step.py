#!/usr/bin/env python3
"""
🔍 Edge Function Step-by-Step Debug
Test each component of the connection chain
"""

import requests
import json
import base64
import time
from datetime import datetime
from PIL import Image, ImageDraw

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (300, 200), color='white')
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 250, 150], outline='black', width=2)
    draw.text((100, 100), "TEST", fill='black')
    img.save("test_image.jpg")
    return "test_image.jpg"

def log_step(step_name, status, details=""):
    """Log each test step with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"{timestamp} {status_icon} {step_name}: {status}")
    if details:
        print(f"   Details: {details}")
    print()

def test_step_1_network_connectivity():
    """Step 1: Test basic network connectivity"""
    print("🔍 STEP 1: Network Connectivity")
    print("=" * 50)
    
    # Test 1.1: Edge Function reachability
    try:
        response = requests.get("https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food", timeout=10)
        log_step("Edge Function Reachability", "PASS", f"HTTP {response.status_code}")
    except Exception as e:
        log_step("Edge Function Reachability", "FAIL", f"Error: {str(e)}")
    
    # Test 1.2: Local YOLO service reachability
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        log_step("Local YOLO Service Reachability", "PASS", f"HTTP {response.status_code}")
    except Exception as e:
        log_step("Local YOLO Service Reachability", "FAIL", f"Error: {str(e)}")

def test_step_2_edge_function_parsing():
    """Step 2: Test Edge Function request parsing"""
    print("🔍 STEP 2: Edge Function Request Parsing")
    print("=" * 50)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
    # Test 2.1: Edge Function with proper form data
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
        
        log_step("Edge Function Form Data Parsing", "PASS" if response.ok else "FAIL", 
                f"HTTP {response.status_code}")
        
        if response.ok:
            result = response.json()
            log_step("Edge Function Response Structure", "PASS", 
                    f"Keys: {list(result.keys())}")
            
            # Check if response has expected structure
            if 'results' in result:
                log_step("Edge Function Results Structure", "PASS", 
                        f"Results keys: {list(result['results'].keys())}")
            else:
                log_step("Edge Function Results Structure", "FAIL", 
                        "No 'results' key in response")
        else:
            log_step("Edge Function Error Response", "INFO", 
                    f"Error: {response.text[:200]}...")
            
    except Exception as e:
        log_step("Edge Function Form Data Parsing", "FAIL", f"Exception: {str(e)}")

def test_step_3_yolo_service_communication():
    """Step 3: Test YOLO service communication"""
    print("🔍 STEP 3: YOLO Service Communication")
    print("=" * 50)
    
    # Test 3.1: YOLO service health
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.ok:
            result = response.json()
            log_step("YOLO Service Health", "PASS", 
                    f"Model loaded: {result.get('model_loaded')}")
        else:
            log_step("YOLO Service Health", "FAIL", f"HTTP {response.status_code}")
    except Exception as e:
        log_step("YOLO Service Health", "FAIL", f"Error: {str(e)}")
    
    # Test 3.2: YOLO service with image
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
            log_step("YOLO Service Image Processing", "PASS", 
                    f"Found {len(detections)} detections")
            
            # Check response structure
            expected_keys = ['detections', 'model_used', 'success']
            missing_keys = [key for key in expected_keys if key not in result]
            if missing_keys:
                log_step("YOLO Response Structure", "FAIL", 
                        f"Missing keys: {missing_keys}")
            else:
                log_step("YOLO Response Structure", "PASS", 
                        f"All expected keys present")
        else:
            log_step("YOLO Service Image Processing", "FAIL", 
                    f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        log_step("YOLO Service Image Processing", "FAIL", f"Error: {str(e)}")

def test_step_4_edge_function_to_yolo():
    """Step 4: Test Edge Function calling YOLO service"""
    print("🔍 STEP 4: Edge Function → YOLO Service")
    print("=" * 50)
    
    # This is the critical step - what the Edge Function should do
    try:
        test_image_path = create_test_image()
        with open(test_image_path, "rb") as f:
            image_data = f.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Simulate what Edge Function does
        payload = {
            "image": base64_image,
            "confidence_threshold": 0.5,
            "model": "best.pt"
        }
        
        # Test with different timeouts
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
                    log_step(f"YOLO Request ({timeout}s)", "PASS", 
                            f"Time: {elapsed:.2f}s, Detections: {len(detections)}")
                else:
                    log_step(f"YOLO Request ({timeout}s)", "FAIL", 
                            f"HTTP {response.status_code}")
                    
            except requests.exceptions.Timeout:
                log_step(f"YOLO Request ({timeout}s)", "FAIL", "Timeout")
            except Exception as e:
                log_step(f"YOLO Request ({timeout}s)", "FAIL", f"Error: {str(e)}")
                
    except Exception as e:
        log_step("Edge Function → YOLO Simulation", "FAIL", f"Error: {str(e)}")

def test_step_5_environment_variables():
    """Step 5: Test environment variables and configuration"""
    print("🔍 STEP 5: Environment Variables & Configuration")
    print("=" * 50)
    
    # Test 5.1: Check if YOLO service is accessible from different URLs
    test_urls = [
        "http://localhost:5000/predict",
        "http://127.0.0.1:5000/predict",
        "http://0.0.0.0:5000/predict"
    ]
    
    for url in test_urls:
        try:
            response = requests.get(url.replace('/predict', '/health'), timeout=5)
            log_step(f"YOLO Service {url}", "PASS" if response.ok else "FAIL", 
                    f"HTTP {response.status_code}")
        except Exception as e:
            log_step(f"YOLO Service {url}", "FAIL", f"Error: {str(e)}")

def test_step_6_response_analysis():
    """Step 6: Analyze Edge Function response in detail"""
    print("🔍 STEP 6: Edge Function Response Analysis")
    print("=" * 50)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
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
        
        log_step("Edge Function Response Status", "INFO", f"HTTP {response.status_code}")
        log_step("Edge Function Response Headers", "INFO", 
                f"Headers: {dict(response.headers)}")
        
        if response.ok:
            result = response.json()
            
            # Analyze response structure
            log_step("Response Analysis", "INFO", f"Response keys: {list(result.keys())}")
            
            if 'results' in result:
                results = result['results']
                log_step("Results Analysis", "INFO", f"Results keys: {list(results.keys())}")
                
                # Check processing time
                processing_time = results.get('processingTime', 'N/A')
                log_step("Processing Time", "INFO", f"Time: {processing_time}")
                
                # Check detections
                detections = results.get('detectedFoods', [])
                log_step("Detections Count", "INFO", f"Found: {len(detections)}")
                
                # Check if there's an error in results
                if 'error' in results:
                    log_step("Results Error", "FAIL", f"Error: {results['error']}")
                else:
                    log_step("Results Error", "PASS", "No error in results")
                    
            else:
                log_step("Results Structure", "FAIL", "No 'results' key found")
        else:
            log_step("Response Error", "FAIL", f"Error: {response.text[:200]}...")
            
    except Exception as e:
        log_step("Response Analysis", "FAIL", f"Exception: {str(e)}")

def main():
    """Run all step-by-step tests"""
    print("🚀 Edge Function Step-by-Step Debug Test")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run all tests
    test_step_1_network_connectivity()
    test_step_2_edge_function_parsing()
    test_step_3_yolo_service_communication()
    test_step_4_edge_function_to_yolo()
    test_step_5_environment_variables()
    test_step_6_response_analysis()
    
    print("🏁 Step-by-Step Debug Complete")
    print("=" * 60)
    print("📊 Summary:")
    print("- Step 1: Network connectivity")
    print("- Step 2: Edge Function request parsing")
    print("- Step 3: YOLO service communication")
    print("- Step 4: Edge Function → YOLO simulation")
    print("- Step 5: Environment variables")
    print("- Step 6: Response analysis")

if __name__ == "__main__":
    main() 