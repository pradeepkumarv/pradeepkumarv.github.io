// api/hdfc/callback.js
import { serialize } from 'cookie';

export default async function handler(req, res) {
  // Allow browser redirect usage (safe to include)
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { code, request_token, token_id } = req.query;
    const incomingToken = code || request_token || token_id;
    if (!incomingToken) return res.redirect((process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/?auth_error=missing_token');

    const tokenUrl = process.env.HDFC_TOKEN_EXCHANGE_URL;
    if (!tokenUrl) {
      console.error('HDFC_TOKEN_EXCHANGE_URL not set');
      return res.status(500).send('Server misconfigured');
    }

    const body = {
      api_key: process.env.HDFC_API_KEY,
      api_secret: process.env.HDFC_API_SECRET, // if required
      request_token: incomingToken // change field name to exact doc field if needed
    };

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Token exchange failed', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/?auth_error=exchange_failed');
    }

    const accessToken = tokenJson.access_token || tokenJson.token || tokenJson.session_token;
    const expiresIn = tokenJson.expires_in ? Number(tokenJson.expires_in) : 3600;
    if (!accessToken) {
      console.error('No access token in HDFC response', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/?auth_error=no_token');
    }

    const cookie = serialize('hdfc_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn
    });

    res.setHeader('Set-Cookie', cookie);
    const redirectTo = (process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/?hdfc=success';
    return res.redirect(302, redirectTo);

  } catch (err) {
    console.error('Callback error', err);
    return res.redirect((process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/?auth_error=server_error');
  }
}
