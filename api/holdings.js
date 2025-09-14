// api/holdings.js
import cookie from "cookie";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pradeepkumarv.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "method not allowed" });

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies.hdfc_access_token;
    if (!accessToken) return res.status(401).json({ error: "not authenticated" });

    const url = process.env.HDFC_HOLDINGS_URL;
    if (!url) return res.status(500).json({ error: "HDFC_HOLDINGS_URL not configured" });

    const hRes = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const text = await hRes.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!hRes.ok) return res.status(hRes.status).json({ error: "holdings fetch failed", details: data });
    return res.status(200).json(data);
  } catch (err) {
    console.error("holdings error", err);
    return res.status(500).json({ error: "server error", details: String(err) });
  }
}
