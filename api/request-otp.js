function setCors(res) {
  const FRONTEND = process.env.FRONTEND_URL || 'https://pradeepkumarv.github.io';
  res.setHeader('Access-Control-Allow-Origin', FRONTEND);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}


export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const { clientId, mobile } = req.body;
    if (!clientId || !mobile) return res.status(400).json({ error: 'missing clientId or mobile' });

    const HDFC_REQUEST_OTP_URL = process.env.HDFC_REQUEST_OTP_URL || 'https://developer.hdfcsec.com/oapi/v1/login/request_otp';

    const body = {
      api_key: process.env.HDFC_API_KEY,
      client_id: clientId,
      mobile: mobile
    };

    // Use built-in fetch (no node-fetch import)
    const hRes = await fetch(HDFC_REQUEST_OTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const hJson = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc error', details: hJson });

    return res.status(200).json({ ok: true, hdfc: hJson });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
