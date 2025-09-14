// api/validate-otp.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pradeepkumarv.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const { clientId, password, mobile, otp } = req.body;
    if (!clientId || !password || !mobile || !otp) {
      return res.status(400).json({ error: "missing parameters" });
    }

    // 🔑 HDFC Validate OTP endpoint (update to exact doc URL)
    const url = process.env.HDFC_VALIDATE_OTP_URL;

    const hRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.HDFC_API_KEY,
        client_id: clientId,
        password,
        mobile,
        otp
      })
    });

    const text = await hRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!hRes.ok) {
      return res.status(hRes.status).json({ error: "validate-otp failed", details: data });
    }

    const accessToken = data.access_token || data.token || data.session_token;
    if (!accessToken) {
      return res.status(500).json({ error: "no access token", details: data });
    }

    // Store token in secure cookie
    const cookie = serialize("hdfc_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ ok: true, message: "OTP validated", accessTokenStored: true });
  } catch (err) {
    console.error("validate-otp error", err);
    return res.status(500).json({ error: "server error", details: String(err) });
  }
}
