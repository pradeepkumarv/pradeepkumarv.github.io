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
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'missing username or password' });

    const loginUrl = process.env.HDFC_LOGIN_URL;
    const hRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.HDFC_API_KEY,
        username,
        password
      })
    });
    const hJson = await hRes.json();
    return res.status(hRes.status).json(hJson);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
