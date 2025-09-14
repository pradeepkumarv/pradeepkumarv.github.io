// Frontend snippet (use API_BASE if your frontend and API are on different hosts)
const API_BASE = 'https://pradeepkumarv-github-io.vercel.app';

// Start auth (builds token_id and returns authorize URL)
async function startAuth() {
  try {
    const r = await fetch(`${API_BASE}/api/hdfc/start`, { method: 'GET', credentials: 'include' });
    const j = await r.json();
    if (!r.ok) {
      console.error('start auth failed', j);
      alert('Start auth failed: ' + (j.error || JSON.stringify(j)));
      return;
    }
    if (j.authUrl) {
      // redirect browser to HDFC login/consent page
      window.location.href = j.authUrl;
    } else {
      console.log('start returned', j);
      alert('Auth URL not returned; check server logs');
    }
  } catch (e) {
    console.error(e);
    alert('Start auth error: ' + String(e));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnRequestOtp');
  if (!btn) {
    console.error('Request OTP button not found');
    return;
  }
  btn.addEventListener('click', async () => {
    console.log('Request OTP button clicked');
    try {
      const API = (typeof API_BASE !== 'undefined' ? API_BASE : 'https://pradeepkumarv-github-io.vercel.app');
      const resp = await fetch(API + '/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: document.getElementById('username')?.value || 'TESTCLIENT',
          password: document.getElementById('password')?.value || 'TESTPWD',
          mobile: document.getElementById('mobile')?.value || '9999999999'
        })
      });
      const text = await resp.text();
      console.log('Request OTP response:', resp.status, text);
      alert('OTP request done. Status ' + resp.status);
    } catch (err) {
      console.error('Request OTP failed:', err);
      alert('Error: ' + err.message);
    }
  });
});

// After callback completes and cookie is set, call holdings:
async function getHoldings() {
  try {
    const r = await fetch(`${API_BASE}/api/hdfc/holdings`, { method: 'GET', credentials: 'include' });
    const j = await r.json();
    if (!r.ok) {
      console.error('holdings error', j);
      alert('Holdings error: ' + (j.error || JSON.stringify(j)));
      return;
    }
    console.log('holdings', j);
    // render holdings in UI
  } catch (e) {
    console.error('holdings fetch failed', e);
    alert('Holdings fetch failed: ' + String(e));
  }
}
