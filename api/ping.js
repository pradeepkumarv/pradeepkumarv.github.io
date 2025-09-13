function setCors(res) {
  const FRONTEND = process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', FRONTEND);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
}
