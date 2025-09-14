// api/request-otp.js

export default async function handler(req, res) {
  // CORS: open
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const { clientId, password, mobile } = req.body;
    if (!clientId || !password || !mobile) {
      return res.status(400).json({ error: "missing parameters" });
    }

    const url = process.env.HDFC_REQUEST_OTP_URL;
    if (!url) return res.status(500).json({ error: "HDFC_REQUEST_OTP_URL not set" });

    const hRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.HDFC_API_KEY,
        client_id: clientId,
        password,
        mobile
      })
    });

    const text = await hRes.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(hRes.status).json(data);
  } catch (err) {
    console.error("request-otp error", err);
    return res.status(500).json({ error: "server error", details: String(err) });
  }
}
