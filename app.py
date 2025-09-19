from flask import Flask, request, render_template, jsonify, session, redirect
from flask_session import Session
import hdfc_investright
import redis
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key")

# Session configuration (for Redis)
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_KEY_PREFIX"] = "hdfc:"
app.config["SESSION_REDIS"] = redis.from_url(os.environ.get("REDIS_URL"))

Session(app)

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
        session["token_id"] = token_id
        session["username"] = username
        session["password"] = password
        
        result = hdfc_investright.login_validate(token_id, username, password)
        print("Login validate response:", result)
        
        # Pass token_id to template
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
        
        if not otp_result.get("authorised"):
            return jsonify({"error": "OTP validation failed!"}), 400

        # Get callback URL for redirect
        callback_url = otp_result.get("callbackUrl")
        if not callback_url:
            return jsonify({"error": "No callback URL received"}), 400

        # Store request_token in session for use in callback
        request_token = otp_result.get("requestToken")
        session["request_token"] = request_token

        # Return redirect response to frontend
        return jsonify({
            "status": "redirect_required",
            "redirect_url": callback_url,
            "message": "Please complete authorization"
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Handle the OAuth callback from HDFC
@app.route("/api/callback", methods=["GET", "POST"])
def callback():
    # Extract any authorization data from callback
    auth_code = request.args.get("code") or request.args.get("request_token") or request.form.get("code")
    token_id = session.get("token_id")
    request_token = session.get("request_token")
    
    if not token_id or not request_token:
        return jsonify({"error": "Session expired. Please start over."}), 400
    
    try:
        # Try to get access token
        access_token = hdfc_investright.fetch_access_token(token_id, request_token)
        
        # Get Holdings
        holdings_data = hdfc_investright.get_holdings(access_token)

        # Map to member_id as per your config
        mapped = []
        for h in holdings_data:
            if h.get("exchange") in ["BSE", "NSE"]:
                h["member_id"] = "bef9db5e-2f21-4038-8f3f-f78ce1bbfb49"  # Pradeep Kumar V
            else:
                h["member_id"] = "d3a4fc84-a94b-494d-915c-60901f16d973"  # Sanchita Pradeep
            mapped.append(h)

        # Return success page or redirect to dashboard
        return f"""
        <html>
            <head><title>HDFC Holdings Imported</title></head>
            <body>
                <h2>✅ Success!</h2>
                <p>Holdings imported successfully: {len(mapped)} items</p>
                <p><a href="/">Return to Dashboard</a></p>
                <script>
                    setTimeout(() => window.location.href = '/', 3000);
                </script>
            </body>
        </html>
        """
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"""
        <html>
            <head><title>HDFC Import Error</title></head>
            <body>
                <h2>❌ Error</h2>
                <p>Failed to import holdings: {str(e)}</p>
                <p><a href="/">Try Again</a></p>
            </body>
        </html>
        """

if __name__ == "__main__":
    app.run(debug=True)
