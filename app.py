from flask import Flask, request, jsonify, render_template
import hdfc_investright
import os

app = Flask(__name__)

# username & password pulled from Render secrets
USERNAME = os.getenv("HDFC_USER")
PASSWORD = os.getenv("HDFC_PASS")

@app.route("/", methods=["GET"])
def home():
    return render_template("otp.html")

@app.route("/holdings", methods=["GET", "POST"])
def holdings():
    if request.method == "GET":
        return "Please submit the OTP using the form at /"

    otp = request.form.get("otp")
    if not otp:
        return jsonify({"error": "OTP required"}), 400

    try:
        # Inject secrets into script
        hdfc_investright.USERNAME = USERNAME
        hdfc_investright.PASSWORD = PASSWORD

        token_id = hdfc_investright.get_token_id()
        hdfc_investright.login_validate(token_id)
        hdfc_investright.validate_2fa(token_id, otp)
        access_token = hdfc_investright.fetch_access_token(token_id)
        data = hdfc_investright.get_holdings(access_token)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
