#!/usr/bin/env python3
"""
hdfc_investright.py
Simple script to get access_token from HDFC InvestRight APIs and call holdings.
Requires: pip install requests
"""

import os
import requests
import time

BASE = "https://developer.hdfcsec.com/api/v1"

API_KEY = os.getenv("HDFC_API_KEY")        # set in env
API_SECRET = os.getenv("HDFC_API_SECRET")  # set in env (if required)
USERNAME = os.getenv("HDFC_USER")          # or prompt / vault
PASSWORD = os.getenv("HDFC_PASS")

HEADERS_JSON = {"Content-Type": "application/json"}

def get_token_id():
    url = f"{BASE}/token_id"
    params = {"api_key": API_KEY}
    response = requests.get(url, params=params)
    print("Request URL: ", response.url)
    print("Status Code: ", response.status_code)
    print("Response Body: ", response.text)
    response.raise_for_status()
    return response.json().get("token_id")

if __name__ == "__main__":
    token = get_token_id()
    print("Token ID:", token)

def login_validate():
    url = f"{BASE}/login/validate"
    params = {"api_key": API_KEY}
    payload = {"username": USERNAME, "password": PASSWORD}
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    r.raise_for_status()
    return r.json()   # should indicate OTP sent

def validate_2fa(otp):
    url = f"{BASE}/login/2fa/validate"
    params = {"api_key": API_KEY}
    payload = {"username": USERNAME, "otp": otp}
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    r.raise_for_status()
    return r.json()

def fetch_access_token():
    url = f"{BASE}/access_token"
    params = {"api_key": API_KEY}
    payload = {"api_secret": API_SECRET}
    r = requests.post(url, params=params, json=payload, headers=HEADERS_JSON)
    r.raise_for_status()
    return r.json().get("access_token")


def get_holdings(access_token):
    # example holdings endpoint; check docs for exact path & params
    url = f"{BASE}/portfolio/holdings"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json()

def main():
    # basic checks
    for var in ("HDFC_API_KEY", "HDFC_API_SECRET", "HDFC_USER", "HDFC_PASS"):
        if not os.getenv(var):
            print(f"Warning: env {var} not set. You can still input interactively.")
    # 1. token_id
    token_id = get_token_id()
    print("token_id:", token_id)
    # 2. login validate
    resp = login_validate(token_id)
    print("login_validate response:", resp)
    # If response indicates OTP sent:
    otp = input("Enter OTP sent to your registered mobile/email: ").strip()
    resp2 = validate_2fa(token_id, otp)
    print("2FA validate response:", resp2)
    # 3. fetch access_token
    access_token = fetch_access_token(token_id)
    print("access_token:", access_token)
    # 4. sample holdings
    holdings = get_holdings(access_token)
    print("holdings:", holdings)

if __name__ == "__main__":
    main()
