import { supabaseClient } from './script.js';

// Auto-load user data
async function loadDashboard() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "auth.html"; // redirect if not logged in
    return;
  }

  // Example: Load balances (replace with your own Supabase tables)
  const { data: investments, error } = await supabaseClient.from("investments").select("*");
  
  if (error) {
    console.error(error);
    return;
  }

  // Simple aggregation (assumes investments table has: type, amount)
  let equity = 0, mf = 0, savings = 0, fd = 0;
  let insuranceList = [];

  investments.forEach(inv => {
    if (inv.type === "equity") equity += inv.amount;
    if (inv.type === "mutualfund") mf += inv.amount;
    if (inv.type === "savings") savings += inv.amount;
    if (inv.type === "fd") fd += inv.amount;
    if (inv.type === "insurance") insuranceList.push(inv.name + " - Renewal: " + inv.renewal_date);
  });

  document.getElementById("equity-balance").textContent = "₹" + equity.toLocaleString();
  document.getElementById("mf-balance").textContent = "₹" + mf.toLocaleString();
  document.getElementById("savings-balance").textContent = "₹" + savings.toLocaleString();
  document.getElementById("fd-balance").textContent = "₹" + fd.toLocaleString();

  const insuranceUl = document.getElementById("insurance-list");
  insuranceUl.innerHTML = "";
  insuranceList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    insuranceUl.appendChild(li);
  });
}

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "auth.html";
});

loadDashboard();
