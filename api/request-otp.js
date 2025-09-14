export default async function handler(req, res) {
  setCors(res);

  // ✅ Handle preflight requests first
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ✅ Only allow POST for the actual OTP request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const { clientId, password, mobile } = req.body;
    if (!clientId || !password) {
      return res.status(400).json({ error: 'missing clientId or password' });
    }

    // build request to HDFC OTP API...
    // const hRes = await fetch(process.env.HDFC_REQUEST_OTP_URL, {...})

    // const hJson = await hRes.json();
    // return res.status(200).json({ ok: true, hdfc: hJson });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', details: String(err) });
  }
}
