import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    const { clientId, mobile } = req.body;
    if (!clientId || !mobile) return res.status(400).json({ error: 'missing clientId or mobile' });

    // === Replace this with the real HDFC request OTP URL and body ===
    const HDFC_REQUEST_OTP_URL = process.env.HDFC_REQUEST_OTP_URL || 'https://developer.hdfcsec.com/oapi/v1/login/request_otp';

    // Example JSON body - change keys as per HDFC doc
    const body = {
      api_key: process.env.HDFC_API_KEY,
      client_id: clientId,
      mobile: mobile
    };

    const hRes = await fetch(HDFC_REQUEST_OTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      timeout: 15000
    });

    const hJson = await hRes.json();

    // HDFC will typically return success + some request token or temporary id — return to frontend
    if (!hRes.ok) {
      return res.status(hRes.status).json({ error: 'hdfc error', details: hJson });
    }

    // Example: return request_token to client (or store in server side if required)
    return res.status(200).json({ ok: true, hdfc: hJson });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
