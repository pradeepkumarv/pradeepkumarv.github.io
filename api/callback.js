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

  try {
    const { code, request_token, token_id } = req.query;
    const incomingToken = code || request_token || token_id;
    if (!incomingToken) {
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=missing_token');
    }

    const tokenUrl = process.env.HDFC_TOKEN_EXCHANGE_URL;
    if (!tokenUrl) throw new Error('HDFC_TOKEN_EXCHANGE_URL not set');

    const body = {
      api_key: process.env.HDFC_API_KEY,
      api_secret: process.env.HDFC_API_SECRET,
      request_token: incomingToken
    };

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('token exchange failed', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=exchange_failed');
    }

    const accessToken = tokenJson.access_token || tokenJson.token || tokenJson.session_token;
    const expiresIn = tokenJson.expires_in ? Number(tokenJson.expires_in) : 3600;
    if (!accessToken) {
      console.error('no access token', tokenJson);
      return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=no_token');
    }

    const cookie = serialize('hdfc_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn
    });

    res.setHeader('Set-Cookie', cookie);
    return res.redirect(302, (process.env.FRONTEND_URL || '/') + '/?hdfc=success');
  } catch (err) {
    console.error('callback error', err);
    return res.redirect((process.env.FRONTEND_URL || '/') + '/?auth_error=server_error');
  }
}
