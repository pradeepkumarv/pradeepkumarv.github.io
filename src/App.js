import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if already logged in
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={setUser} />
      )}
    </>
  );
}

export default App;
