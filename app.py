from flask import Flask, request, render_template, jsonify
import hdfc_investright

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return render_template("login.html")

@app.route("/request-otp", methods=["POST"])
def request_otp():
    username = request.form.get("username")
    password = request.form.get("password")
    try:
        token_id = hdfc_investright.get_token_id()
        hdfc_investright.login_validate(token_id, username, password)
        return render_template("otp.html", username=username, password=password, token_id=token_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/holdings", methods=["POST"])
def holdings():
    username = request.form.get("username")
    password = request.form.get("password")
    otp = request.form.get("otp")
    token_id = request.form.get("token_id")
    try:
        hdfc_investright.validate_2fa(token_id, username, otp)
        access_token = hdfc_investright.fetch_access_token(token_id)
        data = hdfc_investright.get_holdings(access_token)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
