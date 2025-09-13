import { serialize } from 'cookie';

function setCors(res) {
  const allowedOrigins = [
    'https://pradeepkumarv.github.io',          // your frontend (GitHub Pages)
    'https://pradeepkumarv-github-io.vercel.app' // your backend domain
  ]
   const origin = res.req?.headers?.origin || ''; // fallback if available
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { username, otp } = req.body;
    if (!username || !otp) return res.status(400).json({ error: 'username and otp required' });

    const HDFC_VALIDATE_2FA_URL = process.env.HDFC_VALIDATE_2FA_URL || 'https://developer.hdfcsec.com/oapi/v1/login/validate';
    const apiKey = process.env.HDFC_API_KEY;

    const payload = {
      api_key: apiKey,
      username,
      otp
    };

    const hRes = await fetch(HDFC_VALIDATE_2FA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc validate failed', details: body });

    const accessToken = body.access_token || body.token || body.session_token || null;
    const expiresIn = body.expires_in ? Number(body.expires_in) : 3600;

    if (accessToken) {
      const cookie = serialize('hdfc_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: expiresIn
      });
      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ ok: true, tokenStored: true, raw: body });
    } else {
      return res.status(200).json({ ok: true, raw: body });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
