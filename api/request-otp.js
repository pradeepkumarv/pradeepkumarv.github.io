// api/request-otp.js (temporary debug endpoint)
export default function handler(req, res) {
  // permissive CORS so your GitHub Pages frontend can call it
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Respond with a tiny JSON so you can see it in the browser
  return res.status(200).json({ ok: true, path: '/api/request-otp', time: Date.now() });
}
