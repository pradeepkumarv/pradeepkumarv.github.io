import { supabase } from './script.js';

// Insert new investment
document.getElementById("investment-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);

  const { data, error } = await supabase
    .from("investments")
    .insert([{ 
      name, 
      type, 
      amount_invested: amount, 
      last_updated: new Date() 
    }]);

  if (error) {
    alert("Insert failed: " + error.message);
  } else {
    alert("Investment added!");
    loadInvestments();
  }
});

// Load all investments
async function loadInvestments() {
  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .order("last_updated", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  const list = document.getElementById("investment-list");
  list.innerHTML = "";
  data.forEach(inv => {
    list.innerHTML += `<p>${inv.name} - ${inv.type} - ₹${inv.amount_invested}</p>`;
  });
}

// Run on page load
loadInvestments();
