import os
import requests
from flask import Flask, request, jsonify

# -----------------------------
# Config
# -----------------------------
app = Flask(__name__)
app.secret_key = "super_secret_key"

BASE = "https://developer.hdfcsec.com/oapi/v1"
API_KEY = os.getenv("HDFC_API_KEY")
API_SECRET = os.getenv("HDFC_API_SECRET")
USERNAME = os.getenv("HDFC_USERNAME")
PASSWORD = os.getenv("HDFC_PASSWORD")
HEADERS_JSON = {"Content-Type": "application/json"}


# -----------------------------
# Helper Functions
# -----------------------------
def get_token_id():
    url = f"{BASE}/login"
    params = {"api_key": API_KEY}
    r = requests.get(url, params=params)
    print("Request URL:", r.url)
    print("Status:", r.status_code, "Body:", r.text)
    r.raise_for_status()

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

    safe_password = "*" * len(password) if password else None
    print("🔐 Calling login_validate")
    print("  URL:", url)
    print("  Params:", params)
    print("  Payload:", {"username": username, "password": safe_password})

    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", r.status_code, r.text)

    r.raise_for_status()
    return r.json()


def validate_otp(api_key, token_id, username, otp):
    # ✅ Corrected endpoint
    url = f"{BASE}/2fa/validate"
    params = {"api_key": api_key, "token_id": token_id}
    payload = {"username": username, "otp": otp}

    print("📲 Validating OTP")
    print("  URL:", url)
    resp = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()


def fetch_access_token(api_key, token_id, api_secret):
    url = f"{BASE}/access_token"
    params = {"api_key": api_key, "token_id": token_id}
    payload = {"api_secret": api_secret}

    print("🔑 Fetching access token")
    resp = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()["access_token"]


def get_holdings(access_token):
    url = f"{BASE}/portfolio/holdings"
    headers = {"Authorization": f"Bearer {access_token}"}

    print("📊 Fetching holdings")
    resp = requests.get(url, headers=headers)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return
