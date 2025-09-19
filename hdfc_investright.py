import os
import requests

# -----------------------------
# Config
# -----------------------------
BASE = "https://developer.hdfcsec.com/oapi/v1"
API_KEY = os.getenv("HDFC_API_KEY")
API_SECRET = os.getenv("HDFC_API_SECRET")
USERNAME = os.getenv("HDFC_USERNAME")
PASSWORD = os.getenv("HDFC_PASSWORD")
HEADERS_JSON = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

# -----------------------------
# Helper Functions
# -----------------------------

def get_token_id():
    url = f"{BASE}/login"
    params = {"api_key": API_KEY}
    print(f"➡️ Requesting token_id: {url} params={params}")
    r = requests.get(url, params=params)
    print("  Status:", r.status_code, "Body:", r.text)
    r.raise_for_status()
    data = r.json()
    token_id = data.get("tokenId") or data.get("token_id")
    print("  Parsed token_id:", token_id)
    if not token_id:
        raise ValueError(f"Could not extract token_id from response: {data}")
    return token_id

def login_validate(token_id, username, password):
    url = f"{BASE}/login/validate"
    params = {"api_key": API_KEY, "token_id": token_id}
    payload = {"username": username, "password": password}
    safe_password = "*" * len(password) if password else None
    print("🔐 Calling login_validate")
    print("  URL:", url)
    print("  Params:", params)
    print("  Payload:", {"username": username, "password": safe_password})
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", r.status_code, r.text)
    r.raise_for_status()
    return r.json()

def validate_otp(token_id, otp):
    url = f"{BASE}/twofa/validate"
    params = {"api_key": API_KEY, "token_id": token_id}
    payload = {"answer": otp}
    print("📲 Validating OTP (twofa)")
    print("  URL:", url)
    print("  Params:", params)
    print("  Payload:", payload)
    resp = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()

def authorise(token_id, request_token, consent="Y"):
    url = f"{BASE}/authorise"
    params = {
        "api_key": API_KEY,
        "token_id": token_id,
        "request_token": request_token,
        "consent": consent
    }
    print("🔑 Authorising session")
    print("  URL:", url)
    print("  Params:", params)
    resp = requests.post(url, params=params, headers=HEADERS_JSON)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()



def get_holdings(access_token):
    url = f"{BASE}/portfolio/holdings"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    print("📊 Fetching holdings")
    print("  URL:", url)
    print("  Headers:", headers)
    resp = requests.get(url, params={"api_key": API_KEY}, headers=headers)
    print("  Response:", resp.status_code, resp.text)def fetch_access_token(token_id, request_token):
    # CORRECT URL: access-token (with hyphen)
    url = f"{BASE}/access-token"
    
    # Use query parameters as shown in curl
    params = {
        "api_key": API_KEY,
        "request_token": request_token
    }
    
    # CORRECT payload: apiSecret (camelCase)
    payload = {
        "apiSecret": API_SECRET
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    }
    
    print("🔑 Fetching access token")
    print("  URL:", url)
    print("  Params:", params)
    print("  Payload:", payload)
    
    resp = requests.post(url, params=params, json=payload, headers=headers)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    
    data = resp.json()
    # Response key is "accessToken" (camelCase)
    access_token = data.get("accessToken")
    print("  Parsed access_token:", access_token)
    if not access_token:
        raise ValueError(f"Could not extract accessToken from response: {data}")
    return access_token

def authorise(token_id, request_token, consent="Y"):
    # Use the correct authorise endpoint with query parameters
    url = f"{BASE}/authorise"
    
    params = {
        "api_key": API_KEY,
        "token_id": token_id,
        "request_token": request_token,
        "consent": consent
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    }
    
    print("🔑 Authorising session")
    print("  URL:", url)
    print("  Params:", params)
    
    resp = requests.post(url, params=params, headers=headers)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()

    resp.raise_for_status()
    return resp.json()

def resend_2fa(token_id):
    url = f"{BASE}/twofa/resend"
    params = {"api_key": API_KEY, "token_id": token_id}
    print("🔁 Resending 2FA OTP")
    print("  URL:", url)
    print("  Params:", params)
    resp = requests.post(url, params=params, headers=HEADERS_JSON)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()

