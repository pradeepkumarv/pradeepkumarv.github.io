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
