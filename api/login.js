function setCors(res) {
  const FRONTEND = process.env.FRONTEND_URL || 'https://pradeepkumarv.github.io';
  res.setHeader('Access-Control-Allow-Origin', FRONTEND);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { username, mobile } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });

    const HDFC_LOGIN_URL = process.env.HDFC_LOGIN_URL || 'https://developer.hdfcsec.com/oapi/v1/login';
    const apiKey = process.env.HDFC_API_KEY;

    const payload = {
      api_key: apiKey,
      username,
      ...(mobile ? { mobile } : {})
    };

    const hRes = await fetch(HDFC_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await hRes.json();
    if (!hRes.ok) return res.status(hRes.status).json({ error: 'hdfc login error', details: body });

    return res.status(200).json({ ok: true, login_response: body });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
