// api/hdfc/start.js
export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Build auth URL per HDFC docs. Replace query param names as required.
  const HDFC_AUTH_URL = process.env.HDFC_AUTH_URL; // e.g. https://developer.hdfcsec.com/authorize
  if (!HDFC_AUTH_URL) return res.status(500).json({ error: 'HDFC_AUTH_URL not set' });

  const apiKey = process.env.HDFC_API_KEY;
  const redirectUri = encodeURIComponent((process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app') + '/api/hdfc/callback');

  // Typical params: api_key, redirect_uri, response_type=code, state
  const state = Math.random().toString(36).slice(2); // simple state; for production persist and validate
  const authUrl = `${HDFC_AUTH_URL}?api_key=${encodeURIComponent(apiKey)}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

  return res.status(200).json({ authUrl });
}
