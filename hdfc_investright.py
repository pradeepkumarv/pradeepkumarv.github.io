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


# ---- STEP 1: Validate OTP ----
def validate_otp(api_key, token_id, username, otp):
    url = f"{BASE_URL}/login/otp/validate"
    params = {"api_key": api_key, "token_id": token_id}
    payload = {"username": username, "otp": otp}

    print("📲 Validating OTP")
    print("  URL:", url)
    resp = requests.post(url, params=params, json=payload)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()


# ---- STEP 2: Get Access Token ----
def fetch_access_token(api_key, token_id, api_secret):
    url = f"{BASE_URL}/access_token"
    params = {"api_key": api_key, "token_id": token_id}
    payload = {"api_secret": api_secret}

    print("🔑 Fetching access token")
    resp = requests.post(url, params=params, json=payload)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()["access_token"]


# ---- STEP 3: Fetch Holdings ----
def get_holdings(access_token):
    url = f"{BASE_URL}/portfolio/holdings"
    headers = {"Authorization": f"Bearer {access_token}"}

    print("📊 Fetching holdings")
    resp = requests.get(url, headers=headers)
    print("  Response:", resp.status_code, resp.text)
    resp.raise_for_status()
    return resp.json()


# ---- FLASK ROUTE ----
@app.route("/holdings", methods=["POST"])
def holdings_route():
    try:
        data = request.json
        otp = data.get("otp")
        token_id = data.get("token_id")

        if not otp or not token_id:
            return jsonify({"error": "OTP and token_id are required"}), 400

        # Step 1: Validate OTP
        validate_otp(API_KEY, token_id, USERNAME, otp)

        # Step 2: Fetch access token
        access_token = fetch_access_token(API_KEY, token_id, API_SECRET)

        # Step 3: Fetch holdings
        holdings = get_holdings(access_token)

        return jsonify(holdings)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

   

