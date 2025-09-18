import os
import requests

BASE = "https://developer.hdfcsec.com/oapi/v1"
API_KEY = os.getenv("HDFC_API_KEY")
API_SECRET = os.getenv("HDFC_API_SECRET")
HEADERS_JSON = {"Content-Type": "application/json"}

def get_token_id():
    url = f"{BASE}/login"
    params = {"api_key": API_KEY}
    r = requests.get(url, params=params)
    print("Request URL:", r.url)
    print("Status:", r.status_code, "Body:", r.text)
    r.raise_for_status()

    # Try both possible keys: tokenId (correct) or token_id (just in case)
    data = r.json()
    token_id = data.get("tokenId") or data.get("token_id")
    print("Parsed token_id:", token_id)

    if not token_id:
        raise ValueError(f"Could not extract token_id from response: {data}")

    return token_id

 def login_validate(token_id, username, password):
    url = f"{BASE}/login/validate"
    params = {"api_key": API_KEY, "token_id": token_id}
    payload = {"username": username, "password": password}

    # Debug logging
    safe_password = "*" * len(password) if password else None
    print("🔐 Calling login_validate")
    print("  URL:", url)
    print("  Params:", params)
    print("  Payload:", {"username": username, "password": safe_password})

    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", r.status_code, r.text)

    r.raise_for_status()
    return r.json()
   


def validate_2fa(token_id, username, otp):
    url = f"{BASE}/login/2fa/validate"
    params = {"api_key": API_KEY, "token_id": token_id}
    payload = {"username": username, "otp": otp}
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    r.raise_for_status()
    return r.json()

def fetch_access_token(token_id):
    url = f"{BASE}/access_token"
    params = {"api_key": API_KEY, "token_id": token_id}
    payload = {"api_secret": API_SECRET}
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    r.raise_for_status()
    return r.json().get("access_token")

def get_holdings(access_token):
    url = f"{BASE}/portfolio/holdings"
    headers = {"Authorization": f"Bearer {access_token}"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json()

