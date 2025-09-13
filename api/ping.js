function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default function handler(req, res) {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
}
