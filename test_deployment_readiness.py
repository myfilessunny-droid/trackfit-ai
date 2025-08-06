#!/usr/bin/env python3
"""
🔍 Test Deployment Readiness
Verify all files are ready for cloud deployment
"""

import os
import sys

def check_deployment_files():
    """Check if all required deployment files exist"""
    print("🔍 Checking Deployment Readiness")
    print("=" * 40)
    
    required_files = [
        "yolo_inference_service.py",
        "requirements.txt", 
        "Procfile",
        "runtime.txt",
        "railway.json",
        "public/models/best.pt"
    ]
    
    optional_files = [
        "CLOUD_DEPLOYMENT_GUIDE.md",
        "README.md"
    ]
    
    print("📁 Required Files:")
    all_required_present = True
    
    for file in required_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"  ✅ {file} ({size} bytes)")
        else:
            print(f"  ❌ {file} (MISSING)")
            all_required_present = False
    
    print("\n📁 Optional Files:")
    for file in optional_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"  ✅ {file} ({size} bytes)")
        else:
            print(f"  ⚠️  {file} (optional)")
    
    print("\n🔧 Configuration Check:")
    
    # Check YOLO service configuration
    if os.path.exists("yolo_inference_service.py"):
        with open("yolo_inference_service.py", "r") as f:
            content = f.read()
            if "0.0.0.0" in content:
                print("  ✅ Host configured for cloud deployment")
            else:
                print("  ❌ Host not configured for cloud")
                
            if "os.environ.get('PORT'" in content:
                print("  ✅ Port configured from environment")
            else:
                print("  ❌ Port not configured from environment")
    
    # Check requirements.txt
    if os.path.exists("requirements.txt"):
        with open("requirements.txt", "r") as f:
            requirements = f.read()
            required_packages = ["flask", "torch", "ultralytics", "pillow"]
            for package in required_packages:
                if package in requirements:
                    print(f"  ✅ {package} in requirements.txt")
                else:
                    print(f"  ❌ {package} missing from requirements.txt")
    
    # Check model file
    if os.path.exists("public/models/best.pt"):
        size = os.path.getsize("public/models/best.pt")
        print(f"  ✅ Model file: {size} bytes")
        if size > 1000000:  # > 1MB
            print("  ✅ Model file size looks reasonable")
        else:
            print("  ⚠️  Model file seems small - check if it's correct")
    else:
        print("  ❌ Model file missing")
    
    print("\n📊 Summary:")
    print("-" * 20)
    
    if all_required_present:
        print("✅ All required files present!")
        print("🚀 Ready for Railway deployment")
        print("\nNext steps:")
        print("1. Push code to GitHub")
        print("2. Deploy to Railway.app")
        print("3. Get your cloud URL")
        print("4. Update Edge Function")
    else:
        print("❌ Missing required files")
        print("Please add missing files before deployment")
    
    return all_required_present

def test_local_yolo_service():
    """Test if YOLO service runs locally"""
    print("\n🧪 Testing Local YOLO Service")
    print("-" * 30)
    
    try:
        import requests
        
        # Test health endpoint
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.ok:
            result = response.json()
            print(f"✅ Health check: Model loaded = {result.get('model_loaded')}")
            return True
        else:
            print(f"❌ Health check failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Local service test failed: {e}")
        print("  (This is expected if service isn't running)")
        return False

def main():
    """Run all checks"""
    print("🚀 Deployment Readiness Check")
    print("=" * 50)
    
    # Check files
    files_ready = check_deployment_files()
    
    # Test local service (optional)
    local_works = test_local_yolo_service()
    
    print("\n🎯 Final Status:")
    print("-" * 20)
    print(f"Files Ready: {'✅ Yes' if files_ready else '❌ No'}")
    print(f"Local Service: {'✅ Working' if local_works else '⚠️  Not running'}")
    
    if files_ready:
        print("\n🎉 You're ready to deploy to Railway!")
        print("Follow the CLOUD_DEPLOYMENT_GUIDE.md for next steps")
    else:
        print("\n❌ Please fix missing files before deployment")

if __name__ == "__main__":
    main() 