#!/usr/bin/env python3
"""
🔍 Simple Edge Function Test
Isolate the exact issue causing 500 errors
"""

import requests
import json

def test_edge_function_simple():
    """Test Edge Function with minimal request"""
    print("🔍 Simple Edge Function Test")
    print("=" * 40)
    
    edge_function_url = "https://yiscgtqmwjcdrgypdjvz.supabase.co/functions/v1/detect-food"
    anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ"
    
    # Test 1: Simple GET request (should return 405 Method Not Allowed)
    print("📡 Test 1: GET request")
    try:
        response = requests.get(edge_function_url, timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   Error: {e}")
    print()
    
    # Test 2: POST with no data
    print("📡 Test 2: POST with no data")
    try:
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   Error: {e}")
    print()
    
    # Test 3: POST with empty JSON
    print("📡 Test 3: POST with empty JSON")
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
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   Error: {e}")
    print()
    
    # Test 4: POST with minimal form data
    print("📡 Test 4: POST with minimal form data")
    try:
        response = requests.post(
            edge_function_url,
            headers={"Authorization": f"Bearer {anon_key}"},
            data={},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   Error: {e}")
    print()

if __name__ == "__main__":
    test_edge_function_simple() 