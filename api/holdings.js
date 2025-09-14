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
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  try {
    const accessToken = req.cookies?.hdfc_access_token;
    if (!accessToken) return res.status(401).json({ error: 'no access token' });

    const holdingsUrl = process.env.HDFC_HOLDINGS_URL + '?api_key=' + process.env.HDFC_API_KEY;
    const hRes = await fetch(holdingsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const hJson = await hRes.json();
    return res.status(hRes.status).json(hJson);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
