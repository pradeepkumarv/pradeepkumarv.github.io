// api/callback.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pradeepkumarv.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const { request_token } = req.query;
    if (!request_token) {
      return res.redirect(process.env.FRONTEND_URL + "/?auth_error=missing_token");
    }

    const url = process.env.HDFC_TOKEN_EXCHANGE_URL;
    const body = {
      api_key: process.env.HDFC_API_KEY,
      api_secret: process.env.HDFC_API_SECRET,
      request_token
    };

    const tokenRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await tokenRes.json();
    const accessToken = data.access_token || data.token;
    if (!accessToken) {
      return res.redirect(process.env.FRONTEND_URL + "/?auth_error=no_token");
    }

    const cookie = serialize("hdfc_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600
    });

    res.setHeader("Set-Cookie", cookie);
    return res.redirect(process.env.FRONTEND_URL + "/?hdfc=success");
  } catch (err) {
    console.error("callback error", err);
    return res.redirect(process.env.FRONTEND_URL + "/?auth_error=server_error");
  }
}
