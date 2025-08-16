// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY"; 
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch investments and render
async function fetchInvestments() {
  const { data, error } = await supabaseClient
    .from("investments")
    .select("*");

  if (error) {
    console.error("Error fetching data:", error.message);
    alert("Error loading data");
    return;
  }

  const tableBody = document.getElementById("investments-body");
  tableBody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-4 py-2">${row.id}</td>
      <td class="px-4 py-2">${row.name}</td>
      <td class="px-4 py-2">${row.type}</td>
      <td class="px-4 py-2">${row.amount}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Load data when page opens
fetchInvestments();
