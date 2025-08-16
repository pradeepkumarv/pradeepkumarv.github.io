import { supabaseClient } from './script.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js'; // Chart.js CDN

async function loadDashboard() {
  // Check login session
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "auth.html";
    return;
  }

  // Fetch investments from Supabase
  const { data: investments, error } = await supabaseClient.from("investments").select("*");
  if (error) {
    console.error("Error loading investments:", error.message);
    return;
  }

  // Totals per category
  let totals = { equity: 0, mutualfund: 0, savings: 0, fd: 0, insurance: 0 };
  let insuranceList = [];

  investments.forEach(inv => {
    if (inv.type in totals) {
      totals[inv.type] += parseFloat(inv.amount_invested);
    }
    if (inv.type === "insurance") {
      insuranceList.push(inv.name + " (₹" + inv.amount_invested.toLocaleString() + ")");
    }
  });

  // Update UI cards
  document.getElementById("equity-balance").textContent = "₹" + totals.equity.toLocaleString();
  document.getElementById("mf-balance").textContent = "₹" + totals.mutualfund.toLocaleString();
  document.getElementById("savings-balance").textContent = "₹" + totals.savings.toLocaleString();
  document.getElementById("fd-balance").textContent = "₹" + totals.fd.toLocaleString();

  // Insurance list
  const insuranceUl = document.getElementById("insurance-list");
  insuranceUl.innerHTML = "";
  insuranceList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    insuranceUl.appendChild(li);
  });

  // Render Chart
  renderPieChart(totals);
}

// Pie Chart
function renderPieChart(totals) {
  const ctx = document.getElementById("assetChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Equity", "Mutual Funds", "Savings", "FD", "Insurance"],
      datasets: [{
        data: [
          totals.equity,
          totals.mutualfund,
          totals.savings,
          totals.fd,
          totals.insurance
        ],
        backgroundColor: [
          "#3B82F6", // blue
          "#10B981", // green
          "#8B5CF6", // purple
          "#F59E0B", // orange
          "#EF4444"  // red
        ]
      }]
    }
  });
}

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "auth.html";
});

// On page load
loadDashboard();

