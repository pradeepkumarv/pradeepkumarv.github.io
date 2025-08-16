// Fetch investments data
async function fetchInvestments() {
  const { data, error } = await supabase
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

// Run on page load
fetchInvestments();
