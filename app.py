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

        return render_template("otp.html")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/holdings", methods=["POST"])
def holdings():
    otp = request.form.get("otp")

    token_id = session.get("token_id")
    username = session.get("username")
    password = session.get("password")

    if not (token_id and username and password):
        return jsonify({"error": "Session expired. Please login again."}), 401

    try:
        # Step 4: validate OTP
        otp_result = hdfc_investright.validate_otp(API_KEY, token_id, otp)
        print("✅ OTP validation result:", otp_result)

        request_token = otp_result.get("requestToken")
        if not request_token:
            return jsonify({"error": "No requestToken in OTP response"}), 400

        # Step 5: redirect to HDFC authorise page
        authorise_url = hdfc_investright.get_authorise_url(API_KEY, token_id, request_token)
        return redirect(authorise_url)

    except Exception as e:
        import traceback
        traceback.print_exc()
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
