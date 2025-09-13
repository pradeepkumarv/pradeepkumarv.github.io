import { serialize } from 'cookie';

function setCors(res) {
  const allowedOrigins = [
    'https://pradeepkumarv.github.io',
    'https://pradeepkumarv-github-io.vercel.app'
  ];
  const origin = res.req?.headers?.origin || '';
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
    const { clientId, otp } = req.body;
    if (!clientId || !otp) return res.status(400).json({ error: 'missing clientId or otp' });

    const HDFC_VALIDATE_OTP_URL = process.env.HDFC_VALIDATE_OTP_URL || 'https://developer.hdfcsec.com/oapi/v1/login/validate';

    const body = {
      api_key: process.env.HDFC_API_KEY,
      client_id: clientId,
      otp: otp
    };

    const hRes = await fetch(HDFC_VALIDATE_OTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const hJson = await hRes.json();

    if (!hRes.ok) {
      return res.status(hRes.status).json({ error: 'hdfc validation failed', details: hJson });
    }

    const accessToken = hJson.access_token || hJson.token || null;
    if (!accessToken) {
      return res.status(200).json({ ok: true, hdfc: hJson });
    }

    const cookie = serialize('hdfc_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: hJson.expires_in ? parseInt(hJson.expires_in, 10) : 60 * 60
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ ok: true, tokenStored: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
