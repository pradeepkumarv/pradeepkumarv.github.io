// frontend.js

// ✅ Backend base URL (Vercel deployment)
const API_BASE = "https://pradeepkumarv-github-io.vercel.app";

// Store token in memory after OTP validation
let HDFC_TOKEN = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ frontend.js loaded and DOM ready.");

  const btnRequestOtp  = document.getElementById("btnRequestOtp");
  const btnValidateOtp = document.getElementById("btnValidateOtp");
  const btnGetHoldings = document.getElementById("btnGetHoldings");

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const mobile   = document.getElementById("mobile");
  const otp      = document.getElementById("otp");
  const holdingsDiv = document.getElementById("holdings");

  // --- Request OTP ---
  if (btnRequestOtp) {
    btnRequestOtp.addEventListener("click", async () => {
      console.log("🟢 Request OTP clicked");

      if (!username.value || !password.value || !mobile.value) {
        alert("⚠️ Enter Client ID, Password and Mobile first.");
        return;
      }

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
          alert("✅ OTP sent! Enter it below.");
        } else {
          alert("❌ OTP request failed (" + res.status + ")");
        }
      } catch (err) {
        console.error("💥 Request OTP error:", err);
        alert("Error: " + err.message);
      }
    });
  }

  // --- Validate OTP ---
  if (btnValidateOtp) {
    btnValidateOtp.addEventListener("click", async () => {
      console.log("🟢 Validate OTP clicked");

      if (!username.value || !password.value || !mobile.value || !otp.value) {
        alert("⚠️ Enter all fields including OTP.");
        return;
      }

      const url = API_BASE + "/api/validate-otp";
      console.log("➡️ Fetching:", url);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: username.value,
            password: password.value,
            mobile: mobile.value,
            otp: otp.value
          })
        });

        console.log("⬅️ Response object:", res);

        const text = await res.text();
        console.log("⬅️ Response body:", text);

        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        if (res.ok && data.access_token) {
          HDFC_TOKEN = data.access_token;
          alert("🎉 OTP validated! Token saved.");
        } else {
          alert("❌ OTP validation failed (" + res.status + ")");
        }
      } catch (err) {
        console.error("💥 Validate OTP error:", err);
        alert("Error: " + err.message);
      }
    });
  }

  // --- Get Holdings ---
  if (btnGetHoldings) {
    btnGetHoldings.addEventListener("click", async () => {
      console.log("🟢 Get Holdings clicked");

      if (!HDFC_TOKEN) {
        alert("⚠️ Validate OTP first to get a token.");
        return;
      }

      const url = API_BASE + "/api/holdings";
      console.log("➡️ Fetching:", url);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: HDFC_TOKEN })
        });

        console.log("⬅️ Response object:", res);

        const text = await res.text();
        console.log("⬅️ Response body:", text);

        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        if (res.ok) {
          holdingsDiv.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
          alert("📊 Holdings fetched!");
        } else {
          alert("❌ Holdings fetch failed (" + res.status + ")");
        }
      } catch (err) {
        console.error("💥 Holdings error:", err);
        alert("Error: " + err.message);
      }
    });
  }
});
