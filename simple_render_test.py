#!/usr/bin/env python3
"""
Simple Render YOLO Test
Quick test for the deployed YOLO model on Render
"""

import requests
import json

# Configuration
RENDER_URL = "https://trackfit-ai.onrender.com"

def test_health():
    """Quick health check"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{RENDER_URL}/health")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check PASSED")
            print(f"   Model Loaded: {data.get('model_loaded', 'Unknown')}")
            return True
        else:
            print(f"❌ Health Check FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Health Check ERROR: {e}")
        return False

def test_root():
    """Quick root endpoint test"""
    print("\n🔍 Testing Root Endpoint...")
    try:
        response = requests.get(RENDER_URL)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Root Endpoint PASSED")
            return True
        else:
            print(f"❌ Root Endpoint FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Root Endpoint ERROR: {e}")
        return False

def main():
    """Run simple tests"""
    print("🚀 Simple Render YOLO Test")
    print("=" * 30)
    
    health_ok = test_health()
    root_ok = test_root()
    
    print(f"\n📊 Results:")
    print(f"   Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"   Root Endpoint: {'✅ PASS' if root_ok else '❌ FAIL'}")
    
    if health_ok and root_ok:
        print(f"\n🎉 Your Render deployment is working!")
        print(f"   URL: {RENDER_URL}")
    else:
        print(f"\n⚠️  Some issues detected.")
    
    return health_ok and root_ok

if __name__ == "__main__":
    main() 