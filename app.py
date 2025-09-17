from flask import Flask, request, jsonify, render_template
import hdfc_investright

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return render_template("login.html")

@app.route("/holdings", methods=["POST"])
def holdings():
    username = request.form.get("username")
    password = request.form.get("password")
    otp = request.form.get("otp")

    if not username or not password or not otp:
        return jsonify({"error": "Username, password, and OTP required"}), 400

    try:
        # temporarily override env values with user input
        hdfc_investright.USERNAME = username
        hdfc_investright.PASSWORD = password

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
