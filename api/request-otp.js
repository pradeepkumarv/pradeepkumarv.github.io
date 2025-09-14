// api/request-otp.js
export default async function handler(req, res) {
  // ✅ Allow calls from your GitHub Pages frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const { clientId, password, mobile } = req.body || {};
    if (!clientId || !password) {
      // If frontend didn’t send proper values → still return debug
      return res.status(200).json({
        ok: false,
        warning: 'missing clientId or password',
        path: '/api/request-otp',
        time: Date.now()
      });
    }

    // ✅ Check if HDFC URL exists in environment
    const url = process.env.HDFC_REQUEST_OTP_URL;
    if (!url) {
      return res.status(200).json({
        ok: false,
        warning: 'HDFC_REQUEST_OTP_URL not set in env',
        path: '/api/request-otp',
        time: Date.now()
      });
    }

    // ✅ Try hitting HDFC API
    const hRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.HDFC_API_KEY,
        client_id: clientId,
        password,
        mobile
      })
    });

    const text = await hRes.text();
    let hJson;
    try {
      hJson = JSON.parse(text);
    } catch {
      hJson = { raw: text };
    }

    // ✅ Return both HDFC response and debug info
    return res.status(hRes.status).json({
      ok: hRes.ok,
      hdfc: hJson,
      path: '/api/request-otp',
      time: Date.now()
    });

  } catch (err) {
    console.error('💥 request-otp error:', err);
    return res.status(200).json({
      ok: false,
      error: 'server error',
      details: String(err),
      path: '/api/request-otp',
      time: Date.now()
    });
  }
}
