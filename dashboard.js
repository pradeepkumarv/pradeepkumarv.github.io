import { supabase } from './script.js';

// Example: Insert investment
async function addInvestment(name, type, amount) {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ 
      name, 
      type, 
      amount_invested: amount, 
      last_updated: new Date() 
    }]);

  if (error) {
    console.error("Insert failed:", error.message);
  } else {
    console.log("Insert success:", data);
  }
}
