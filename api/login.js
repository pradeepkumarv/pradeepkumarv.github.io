export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'method not allowed'});
  try {
    const { username, mobile } = req.body;
    if (!username) return res.status(400).json({ error:'username required' });

    const HDFC_LOGIN_URL = process.env.HDFC_LOGIN_URL; // e.g. https://developer.hdfcsec.com/oapi/v1/login
    const apiKey = process.env.HDFC_API_KEY;

    // Build payload according to your HDFC docs.
    const payload = {
      api_key: apiKey,
      username: username,
      // include token_id/request_token if required (token_id from previous step).
      // mobile included if doc asks for it.
      ...(mobile ? { mobile } : {})
    };

    const hRes = await fetch(HDFC_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc login error', details: body });
    // Typically HDFC returns a request_token or confirmation that OTP sent — return it to frontend
    return res.status(200).json({ ok:true, login_response: body });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
