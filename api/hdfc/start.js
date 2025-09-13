function setCors(res) {
  const FRONTEND = process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', FRONTEND);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const HDFC_AUTH_URL = process.env.HDFC_AUTH_URL;
  if (!HDFC_AUTH_URL) return res.status(500).json({ error: 'HDFC_AUTH_URL not set' });

  const apiKey = encodeURIComponent(process.env.HDFC_API_KEY || '');
  // If HDFC requires token_id/request_token you may need to generate it before building this URL.
  const redirectUri = encodeURIComponent((process.env.FRONTEND_URL || '') + '/api/hdfc/callback');

  // Default query params: api_key and redirect_uri. Add others if HDFC docs say so.
  const state = Math.random().toString(36).slice(2);
  const authUrl = `${HDFC_AUTH_URL}?api_key=${apiKey}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

  return res.status(200).json({ authUrl });
}
