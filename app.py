from flask import Flask, request, render_template, jsonify, session, redirect
import hdfc_investright
import os

app = Flask(__name__)
app.secret_key = "super-secret-key"  # replace with env var in Render

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

        session['tokenid'] = tokenid
        return render_template("otp.html", tokenid=tokenid) 
       

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/holdings", methods=["POST"])
def holdings():
    otp = request.form.get("otp")
    token_id = session.get("tokenid")
    if not token_id:
        return jsonify({"error": "Session expired. Please login again."}), 401
    try:
        # Validate OTP
        otp_result = hdfcinvestright.validate_otp(token_id, otp)
        request_token = otp_result.get("requestToken")
        if not request_token:
            return jsonify({"error": "OTP validation failed!"}), 400

        # Authorise
        auth_result = hdfcinvestright.authorise(token_id, request_token)
        if not auth_result.get("callbackUrl"):
            return jsonify({"error": "Authorization failed!"}), 400

        # Fetch Access Token
        access_token = hdfcinvestright.fetch_access_token(token_id, request_token)

        # Get Holdings
        holdings = hdfcinvestright.get_holdings(access_token)

        # Map to member_id as per JS config (equity → Pradeep, mf → Sanchita)
        mapped = []
        for h in holdings:
            # You may need to adjust this based on holding fields
            if h.get("exchange") in ["BSE", "NSE"]:
                h["member_id"] = "bef9db5e-2f21-4038-8f3f-f78ce1bbfb49"  # Pradeep Kumar V
            else:
                h["member_id"] = "d3a4fc84-a94b-494d-915c-60901f16d973"  # Sanchita Pradeep
            mapped.append(h)

        return jsonify({"status": "success", "data": mapped})
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500



# ✅ New callback route
@app.route("/api/callback", methods=["GET"])
def callback():
    request_token = request.args.get("request_token")
    token_id = session.get("token_id")

    if not request_token or not token_id:
        return jsonify({"error": "Missing request_token or session expired"}), 400

    try:
        access_token = hdfc_investright.fetch_access_token(API_KEY, token_id, API_SECRET)
        print("✅ Access token:", access_token)

        data = hdfc_investright.get_holdings(access_token)
        return jsonify(data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
