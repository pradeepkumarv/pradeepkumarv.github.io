
from flask import Flask, request, render_template, jsonify, session
import hdfc_investright

app = Flask(__name__)
app.secret_key = "super-secret-key"  # replace with env var in Render

@app.route("/", methods=["GET"])
def home():
    return render_template("login.html")

@app.route("/request-otp", methods=["POST"])
def request_otp():
    username = request.form.get("username")
    password = request.form.get("password")

    try:
        # Step 1: get token_id
        token_id = hdfc_investright.get_token_id()
        session["token_id"] = token_id
        session["username"] = username
        session["password"] = password

        # Step 2: call login/validate (this triggers OTP)
        result = hdfc_investright.login_validate(token_id, username, password)
        print("Login validate response:", result)

        # Step 3: show OTP form
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
        hdfc_investright.validate_otp(token_id, username, otp)

        # Step 5: fetch access token
        access_token = hdfc_investright.fetch_access_token(token_id)

        # Step 6: get holdings
        data = hdfc_investright.get_holdings(access_token)
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
