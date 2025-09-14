// api/holdings.js

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "missing accessToken" });
    }

    const url = process.env.HDFC_HOLDINGS_URL;
    if (!url) return res.status(500).json({ error: "HDFC_HOLDINGS_URL not set" });

    const hRes = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const text = await hRes.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(hRes.status).json(data);
  } catch (err) {
    console.error("holdings error", err);
    return res.status(500).json({ error: "server error", details: String(err) });
  }
}
