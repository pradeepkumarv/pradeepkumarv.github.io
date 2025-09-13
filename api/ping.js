function setCors(res) {
  const allowedOrigins = [
    'https://pradeepkumarv.github.io',           // your frontend (GitHub Pages)
    'https://pradeepkumarv-github-io.vercel.app' // your backend domain
  ];

  const origin = res.req?.headers?.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}


export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
}
