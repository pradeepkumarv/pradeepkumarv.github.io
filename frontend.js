// frontend.js

// Backend base URL (Vercel deployment)
const API_BASE = "https://pradeepkumarv-github-io.vercel.app";

let HDFC_TOKEN = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("frontend.js loaded.");

  const btnRequestOtp  = document.getElementById("btnRequestOtp");
  const btnValidateOtp = document.getElementById("btnValidateOtp");
  const btnGetHoldings = document.getElementById("btnGetHoldings");

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const mobile   = document.getElementById("mobile");
  const otp      = document.getElementById("otp");
  const holdingsDiv = document.getElementById("holdings");

  // --- Request OTP ---

  // --- Validate OTP ---
  if (btnValidateOtp) {
    btnValidateOtp.addEventListener("click", async () => {
      console.log("Validate OTP clicked");

      if (!username.value || !password.value || !mobile.value || !otp.value) {
        alert("⚠️ Enter all fields including OTP.");
        return;
      }

      try {
        const res = await fetch(API_BASE + "/api/validate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: username.value,
            password: password.value,
            mobile: mobile.value,
            otp: o// --- Request OTP ---
// --- Request OTP ---
if (btnRequestOtp) {
  btnRequestOtp.addEventListener("click", async () => {
    console.log("🟢 Request OTP button clicked");

    const url = API_BASE + "/api/request-otp";
    console.log("➡️ Fetching:", url);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: username.value,
          password: password.value,
          mobile: mobile.value
        })
      });

      console.log("⬅️ Response object:", res);

      const text = await res.text();
      console.log("⬅️ Response body:", text);

      if (res.ok) {
        console.log("✅ OTP request successful");
        alert("✅ OTP sent! Enter it below.");
      } else {
        console.log("❌ OTP request failed, status:", res.status);
        alert("❌ OTP request failed (" + res.status + ")");
      }
    } catch (err) {
      console.error("💥 Fetch threw an error:", err);
      alert("Error: " + err.message);
    }
  });
}

              
  // --- Get Holdings ---
  if (btnGetHoldings) {
    btnGetHoldings.addEventListener("click", async () => {
      console.log("Get Holdings clicked");

      if (!HDFC_TOKEN) {
        alert("⚠️ Validate OTP first.");
        return;
      }

      try {
        const res = await fetch(API_BASE + "/api/holdings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: HDFC_TOKEN })
        });

        const data = await res.json();
        console.log("Holdings response:", res.status, data);

        if (res.ok) {
          holdingsDiv.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
          alert("📊 Holdings fetched!");
        } else {
          alert("❌ Holdings fetch failed (" + res.status + ")");
        }
      } catch (err) {
        console.error("Holdings error", err);
        alert("Error: " + err.message);
      }
    });
  }
});
