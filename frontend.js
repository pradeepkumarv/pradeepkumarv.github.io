// frontend.js
// Your backend API base on Vercel
const API_BASE = 'https://pradeepkumarv-github-io.vercel.app';

const out = document.getElementById('out');
const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const mobileEl = document.getElementById('mobile');
const otpEl = document.getElementById('otp');
const btnRequestOtp = document.getElementById('btnRequestOtp');
const btnValidateOtp = document.getElementById('btnValidateOtp');
const btnGetHoldings = document.getElementById('btnGetHoldings');
const btnStartAuth = document.getElementById('btnStartAuth');
const otpSection = document.getElementById('otpSection');

function show(msg) {
  if (typeof msg === 'object') out.textContent = JSON.stringify(msg, null, 2);
  else out.textContent = String(msg);
  console.log(msg);
}

// Generic API caller
async function callApi(path, opts = {}) {
  const url = API_BASE + path;
  try {
    const res = await fetch(url, opts);
    const text = await res.text().catch(() => null);
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (e) { json = text; }
    if (!res.ok) {
      throw { status: res.status, body: json || text || 'no body' };
    }
    return json;
  } catch (err) {
    throw err;
  }
}

// Request OTP
btnRequestOtp?.addEventListener('click', async () => {
  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  const mobile = mobileEl.value.trim();

  if (!username || !password) {
    return show('Enter username and password before requesting OTP.');
  }

  show({ status: 'requesting otp...' });
  try {
    const payload = { clientId: username, password, mobile };
    const r = await callApi('/api/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    show({ ok: true, response: r });
    otpSection.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    show({ error: 'request-otp failed', details: err });
  }
});

// Validate OTP
btnValidateOtp?.addEventListener('click', async () => {
  const username = usernameEl.value.trim();
  const otp = otpEl.value.trim();
  if (!username || !otp) return show('Enter username and OTP.');

  show({ status: 'validating otp...' });
  try {
    const r = await callApi('/api/validate-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, otp })
    });
    show({ ok: true, response: r });
  } catch (err) {
    console.error(err);
    show({ error: 'validate-otp failed', details: err });
  }
});

// Redirect-start flow
btnStartAuth?.addEventListener('click', async () => {
  show('starting redirect flow...');
  try {
    const r = await callApi('/api/hdfc/start', { method: 'GET' });
    if (!r || !r.authUrl) return show({ error: 'no authUrl returned', raw: r });
    window.location.href = r.authUrl;
  } catch (err) {
    console.error(err);
    show({ error: 'start auth failed', details: err });
  }
});

// Get holdings
btnGetHoldings?.addEventListener('click', async () => {
  show('fetching holdings...');
  try {
    const r = await callApi('/api/hdfc/holdings', {
      method: 'GET',
      credentials: 'include'
    });
    show({ ok: true, holdings: r });
  } catch (err) {
    console.error(err);
    show({ error: 'holdings failed', details: err });
  }
});

// Confirm frontend loaded
show('frontend loaded — ready');
