import requests
import json

# Test login with backend
def test_login():
    url = "http://localhost:8000/auth/login"
    
    # Test credentials based on database setup
    test_users = [
        {"employee_id": "E101", "username": "staff1", "password": "password123", "role": "staff"},
        {"employee_id": "E201", "username": "manager1", "password": "manager123", "role": "store_manager"},
        {"employee_id": "E301", "username": "area1", "password": "admin123", "role": "area_manager"},
    ]
    
    for user in test_users:
        try:
            response = requests.post(url, json=user)
            print(f"Testing {user['username']}:")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"✅ SUCCESS: {response.json()}")
            else:
                print(f"❌ FAILED: {response.text}")
            print("-" * 50)
        except Exception as e:
            print(f"❌ ERROR: {e}")
            print("-" * 50)

if __name__ == "__main__":
    test_login()