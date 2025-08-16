import { supabase } from "./supabaseClient.js";

// 🔹 1. Redirect if not logged in
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
  }
})();

// 🔹 2. Mock data (replace with Supabase query later if needed)
let data = [
  { name: "Alice", email: "alice@example.com", role: "Admin" },
  { name: "Bob", email: "bob@example.com", role: "User" },
  { name: "Charlie", email: "charlie@example.com", role: "Manager" }
];

let filteredData = [...data];
let sortColumn = null;
let sortOrder = "asc";

// 🔹 3. Render table
function renderTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  filteredData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.email}</td>
      <td>${row.role}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 🔹 4. Search
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  filteredData = data.filter(row =>
    row.name.toLowerCase().includes(term) ||
    row.email.toLowerCase().includes(term) ||
    row.role.toLowerCase().includes(term)
  );
  renderTable();
});

// 🔹 5. Sorting
document.querySelectorAll("th").forEach(th => {
  th.addEventListener("click", () => {
    const column = th.getAttribute("data-column");
    let order = th.getAttribute("data-order");

    filteredData.sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    th.setAttribute("data-order", order === "asc" ? "desc" : "asc");
    renderTable();
  });
});

// 🔹 6. Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
});

// Initial render
renderTable();
