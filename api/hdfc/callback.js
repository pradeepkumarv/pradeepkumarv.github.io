// api/hdfc/callback.js
import { serialize } from 'cookie';

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
  // The callback will be called by browser redirect (GET)
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  try {
    // HDFC will send back one of these as query params
    const { request_token, token_id, code, state } = req.query;
    const incoming = request_token || token_id || code;
    if (!incoming) {
      // we redirect back to frontend with error (frontend can display message)
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=missing_token');
    }

    const EXCHANGE_URL = process.env.HDFC_TOKEN_EXCHANGE_URL || process.env.HDFC_VALIDATE_2FA_URL || process.env.HDFC_LOGIN_URL;
    if (!EXCHANGE_URL) {
      console.error('HDFC_TOKEN_EXCHANGE_URL not set');
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=server_misconfigured');
    }

    // HDFC docs differ: some expect GET with query, some expect POST JSON.
    // We'll try POST JSON first. Adjust to form-encoded or GET if docs require.
    const body = {
      api_key: process.env.HDFC_API_KEY,
      api_secret: process.env.HDFC_API_SECRET || undefined,
      request_token: incoming
    };

    const tokenRes = await fetch(EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await tokenRes.text();
    let tokenJson;
    try { tokenJson = JSON.parse(text); } catch (e) { tokenJson = { raw: text }; }

    if (!tokenRes.ok) {
      console.error('token exchange failed', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=exchange_failed');
    }

    // Map likely fields (adjust if HDFC uses different names)
    const accessToken = tokenJson.access_token || tokenJson.token || tokenJson.session_token || tokenJson.data?.access_token;
    const expiresIn = tokenJson.expires_in ? Number(tokenJson.expires_in) : 3600;

    if (!accessToken) {
      console.error('no access token received', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=no_token');
    }

    // set httpOnly cookie so frontend can't read token directly
    const cookieStr = serialize('hdfc_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn
    });
    res.setHeader('Set-Cookie', cookieStr);

    // redirect back to frontend app (adjust path if needed)
    return res.redirect(302, (process.env.FRONTEND_URL || '/') + '/?hdfc=success');
  } catch (err) {
    console.error('callback error', err);
    return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=server_error');
  }
}
