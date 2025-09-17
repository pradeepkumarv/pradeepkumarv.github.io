from flask import Flask, request, jsonify
import hdfc_investright

app = Flask(__name__)

@app.route("/holdings", methods=["GET"])
def holdings():
    otp = request.args.get("otp")
    if not otp:
        return jsonify({"error": "OTP required"}), 400
    try:
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
