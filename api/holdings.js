import cookie from 'cookie';

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
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.hdfc_access_token;
    if (!accessToken) return res.status(401).json({ error: 'not authenticated' });

    const HDFC_HOLDINGS_URL = process.env.HDFC_HOLDINGS_URL;
    if (!HDFC_HOLDINGS_URL) return res.status(500).json({ error: 'HDFC_HOLDINGS_URL not set' });

    const hRes = await fetch(HDFC_HOLDINGS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': process.env.HDFC_API_KEY
      }
    });

    const data = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc error', details: data });

    return res.status(200).json({ ok: true, holdings: data });
  } catch (err) {
    console.error('holdings error', err);
    return res.status(500).json({ error: String(err) });
  }
}
