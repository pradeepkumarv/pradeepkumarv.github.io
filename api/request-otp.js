function setCors(req, res) {
  const allowedOrigins = [
    'https://pradeepkumarv.github.io',
    'https://pradeepkumarv-github-io.vercel.app'
  ];
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  else res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { clientId, password, mobile } = req.body;
    if (!clientId || !password) return res.status(400).json({ error: 'missing clientId or password' });

    const hRes = await fetch(process.env.HDFC_REQUEST_OTP_URL, {
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
    } catch (e) {
      hJson = { raw: text };
    }
    return res.status(hRes.status).json(hJson);
    
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
