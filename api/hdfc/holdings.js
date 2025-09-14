// api/hdfc/holdings.js
import cookie from 'cookie';

export default async function handler(req, res) {
  function setCors(req, res) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://pradeepkumarv.github.io',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://pradeepkumarv-github-io.vercel.app'
    ];
    const origin = req.headers.origin || '';
    if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    else res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.hdfc_access_token;
    if (!accessToken) return res.status(401).json({ error: 'not authenticated' });

    const HDFC_HOLDINGS_URL = process.env.HDFC_HOLDINGS_URL;
    if (!HDFC_HOLDINGS_URL) return res.status(500).json({ error: 'HDFC_HOLDINGS_URL not set' });

    // Build holdings URL (some HDFC endpoints expect api_key as query or header)
    const url = HDFC_HOLDINGS_URL.includes('?') ? HDFC_HOLDINGS_URL + `&api_key=${encodeURIComponent(process.env.HDFC_API_KEY)}` : `${HDFC_HOLDINGS_URL}?api_key=${encodeURIComponent(process.env.HDFC_API_KEY)}`;

    const hRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': process.env.HDFC_API_KEY
      }
    });

    const text = await hRes.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc error', details: data });
    return res.status(200).json({ ok: true, holdings: data });
  } catch (err) {
    console.error('holdings error', err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
