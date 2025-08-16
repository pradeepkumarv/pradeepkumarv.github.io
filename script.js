// supabaseClient.js
const SUPABASE_URL = "https://dobiarrtabqiozfitsoz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYmlhcnJ0YWJxaW96Zml0c296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjk0MTcsImV4cCI6MjA3MDg0NTQxN30.JTIdjABW7pceVfBWETKA9tnGFaBxQW4mf3VFHtWe3Fw";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabaseClient };
