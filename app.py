from flask import Flask, request, render_template, jsonify, session, redirect
from flask_session import Session  # ← Missing import
import hdfc_investright
import redis
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key")  # Use env var

# Session configuration (for Redis)
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_KEY_PREFIX"] = "hdfc:"
app.config["SESSION_REDIS"] = redis.from_url(os.environ.get("REDIS_URL"))

Session(app)  # Now this will work

API_KEY = os.getenv("HDFC_API_KEY")
API_SECRET = os.getenv("HDFC_API_SECRET")

@app.route("/", methods=["GET"])
def home():
    return render_template("login.html")

@app.route("/request-otp", methods=["POST"])
def request_otp():
    username = request.form.get("username")
    password = request.form.get("password")
    try:
        token_id = hdfc_investright.get_token_id()
        session["token_id"] = token_id  # Use snake_case consistently
        session["username"] = username
        session["password"] = password
        
        result = hdfc_investright.login_validate(token_id, username, password)
        print("Login validate response:", result)
        
        # Pass token_id to template (not undefined 'tokenid')
        return render_template("otp.html", tokenid=token_id)
       
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/holdings", methods=["POST"])
def holdings():
    otp = request.form.get("otp")
    token_id = request.form.get("tokenid") or session.get("token_id")
    
    if not token_id:
        return jsonify({"error": "Session expired. Please login again."}), 401
    
    try:
        # Validate OTP
        otp_result = hdfc_investright.validate_otp(token_id, otp)
        request_token = otp_result.get("requestToken")
        
        if not request_token:
            return jsonify({"error": "OTP validation failed!"}), 400

        # Check if already authorized (skip separate authorize call)
        if not otp_result.get("authorised"):
            return jsonify({"error": "Authorization failed!"}), 400

        # Skip the separate authorise() call - it's already done!
        # Fetch Access Token directly
        access_token = hdfc_investright.fetch_access_token(token_id, request_token)

        # Get Holdings
        holdings_data = hdfc_investright.get_holdings(access_token)

        # Map to member_id as per JS config
        mapped = []
        for h in holdings_data:
            if h.get("exchange") in ["BSE", "NSE"]:
                h["member_id"] = "bef9db5e-2f21-4038-8f3f-f78ce1bbfb49"  # Pradeep Kumar V
            else:
                h["member_id"] = "d3a4fc84-a94b-494d-915c-60901f16d973"  # Sanchita Pradeep
            mapped.append(h)

        return jsonify({"status": "success", "data": mapped})
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Callback route (if needed for OAuth flow)
@app.route("/api/callback", methods=["GET"])
def callback():
    request_token = request.args.get("request_token")
    token_id = session.get("token_id")
    
    if not request_token or not token_id:
        return jsonify({"error": "Missing request_token or session expired"}), 400
    
    try:
        access_token = hdfc_investright.fetch_access_token(token_id, request_token)
        print("✅ Access token:", access_token)
        data = hdfc_investright.get_holdings(access_token)
        return jsonify(data)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
