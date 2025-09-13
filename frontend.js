const API_BASE = 'https://pradeepkumarv-github-g4z3mkshe-pradeep-kumar-vs-projects.vercel.app';

const out = document.getElementById('out');
const clientIdInput = document.getElementById('clientId');
const mobileInput = document.getElementById('mobile');
const otpInput = document.getElementById('otp');
const btnRequestOtp = document.getElementById('btnRequestOtp');
const btnValidateOtp = document.getElementById('btnValidateOtp');
const btnGetHoldings = document.getElementById('btnGetHoldings');
const otpSection = document.getElementById('otpSection');

function show(o){ out.textContent = JSON.stringify(o, null, 2); }

btnRequestOtp.addEventListener('click', async () => {
  const clientId = clientIdInput.value.trim();
  const mobile = mobileInput.value.trim();
  if(!clientId || !mobile) return show({ error: 'enter client id and mobile' });

  show({ status: 'requesting otp...' });

  try {
    const res = await fetch('/api/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, mobile })
    });
    const json = await res.json();
    if(!res.ok) throw json;
    show(json);
    otpSection.classList.remove('hidden');
  } catch(err) {
    show(err);
  }
});

btnValidateOtp.addEventListener('click', async () => {
  const otp = otpInput.value.trim();
  const clientId = clientIdInput.value.trim();
  if(!otp) return show({ error: 'enter otp' });

  show({ status: 'validating otp...' });

  try {
    const res = await fetch('/api/validate-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, otp })
    });
    const json = await res.json();
    if(!res.ok) throw json;
    show(json);
    // after success you can call holdings
  } catch(err) {
    show(err);
  }
});

btnGetHoldings.addEventListener('click', async () => {
  show({ status: 'fetching holdings...' });
  try {
    const res = await fetch('/api/holdings', { method: 'GET' });
    const json = await res.json();
    if(!res.ok) throw json;
    show(json);
  } catch(err) {
    show(err);
  }
});
