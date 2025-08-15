// script.js

const supabaseUrl = 'https://dobiarrtabqiozfitsoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYmlhcnJ0YWJxaW96Zml0c296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjk0MTcsImV4cCI6MjA3MDg0NTQxN30.JTIdjABW7pceVfBWETKA9tnGFaBxQW4mf3VFHtWe3Fw';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

async function loadInvestments() {
  const { data, error } = await supabase
    .from('investments')
    .select('*');
  
  if (error) {
    console.error(error);
    document.getElementById('status').innerText = "Error loading data.";
    return;
  }
  
  let table = "<tr><th>Name</th><th>Amount Invested</th><th>Current Value</th><th>Last Updated</th></tr>";
  data.forEach(row => {
    table += `<tr>
      <td>${row.name}</td>
      <td>${row.amount_invested}</td>
      <td>${row.current_value}</td>
      <td>${new Date(row.last_updated).toLocaleString()}</td>
    </tr>`;
  });

  document.getElementById('investmentTable').innerHTML = table;
}

loadInvestments();
