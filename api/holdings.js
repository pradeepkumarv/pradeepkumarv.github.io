function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

import fetch from 'node-fetch';
import cookie from 'cookie';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

    // read token from cookie
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.hdfc_access_token || null;

    if (!accessToken) {
      return res.status(401).json({ error: 'not authenticated' });
    }

    // Replace with actual HDFC holdings URL
    const HDFC_HOLDINGS_URL = process.env.HDFC_HOLDINGS_URL || 'https://developer.hdfcsec.com/oapi/v1/holdings';

    // Example: some APIs want token in header Authorization: Bearer <token>
    const hRes = await fetch(HDFC_HOLDINGS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': process.env.HDFC_API_KEY // if needed
      },
      timeout: 15000
    });

    const data = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc error', details: data });

    return res.status(200).json({ ok: true, holdings: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
