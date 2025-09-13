// frontend.js
const API_BASE = 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app';

async function startAuth() {
  // request a server-built auth URL and redirect browser
  const res = await fetch(`${API_BASE}/api/hdfc/start`, { method: 'GET' });
  const j = await res.json();
  if (!res.ok) {
    console.error('start auth failed', j);
    alert('Auth start failed: ' + (j.error || JSON.stringify(j)));
    return;
  }
  // either authUrl returned or server may redirect directly
  window.location.href = j.authUrl;
}

// Example function to call holdings after login
async function getHoldings() {
  try {
    const res = await fetch(`${API_BASE}/api/hdfc/holdings`, { method: 'GET', credentials: 'include' });
    const j = await res.json();
    if (!res.ok) throw j;
    console.log('holdings', j);
    alert('Holdings fetched — check console');
  } catch (e) {
    console.error(e);
    alert('Error fetching holdings: ' + (e.error || JSON.stringify(e)));
  }
}

// Example hooks for your page buttons
document.getElementById('btnStartAuth')?.addEventListener('click', startAuth);
document.getElementById('btnGetHoldings')?.addEventListener('click', getHoldings);
