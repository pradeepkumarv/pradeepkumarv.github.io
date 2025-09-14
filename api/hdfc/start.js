// api/hdfc/start.js
// server-side: call HDFC token_id endpoint and return auth URL
export default async function handler(req, res) {
  // CORS helper
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
    const TOKEN_ID_URL = process.env.HDFC_TOKEN_ID_URL; // e.g. https://developer.hdfcsec.com/oapi/v1/login/token_id
    const AUTHORIZE_BASE = process.env.HDFC_AUTH_URL;   // e.g. https://developer.hdfcsec.com/oapi/v1/authorise
    const API_KEY = process.env.HDFC_API_KEY;
    if (!TOKEN_ID_URL || !AUTHORIZE_BASE || !API_KEY) {
      return res.status(500).json({ error: 'server misconfigured - set HDFC_TOKEN_ID_URL, HDFC_AUTH_URL, HDFC_API_KEY' });
    }

    // Fetch token_id from HDFC
    // Docs sometimes use GET with api_key as query param
    const tokenResp = await fetch(`${TOKEN_ID_URL}?api_key=${encodeURIComponent(API_KEY)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const text = await tokenResp.text();
    let tokenJson;
    try { tokenJson = JSON.parse(text); } catch (e) { tokenJson = { raw: text }; }

    if (!tokenResp.ok) {
      return res.status(tokenResp.status).json({ error: 'hdfc token_id failed', details: tokenJson });
    }

    // Map likely field names (adjust if docs show different)
    const token_id = tokenJson.token_id || tokenJson.request_token || tokenJson.token;
    if (!token_id) {
      return res.status(500).json({ error: 'no token_id in response', raw: tokenJson });
    }

    // Build the authorize URL for frontend redirect
    const FRONTEND = process.env.FRONTEND_URL || `https://${process.env.VERCEL_URL || 'pradeepkumarv-github-io.vercel.app'}`;
    const REDIRECT_URI = `${FRONTEND.replace(/\/$/, '')}/api/hdfc/callback`; // callback you registered in HDFC console
    const state = Math.random().toString(36).slice(2);

    // Compose authorize URL. Field names (token_id, consent, request_token) may vary — adapt if docs differ.
    const authUrl = `${AUTHORIZE_BASE}?api_key=${encodeURIComponent(API_KEY)}&token_id=${encodeURIComponent(token_id)}&consent=true&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${encodeURIComponent(state)}`;

    return res.status(200).json({ authUrl, token_id, state, raw: tokenJson });
  } catch (err) {
    console.error('start error', err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
