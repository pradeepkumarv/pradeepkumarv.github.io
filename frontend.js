// frontend.js

// Your Vercel backend base URL
const API_BASE = "https://pradeepkumarv-github-io.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  console.log("frontend.js loaded and DOM ready.");

  // Grab input fields & buttons
  const btnRequestOtp = document.getElementById("btnRequestOtp");
  const btnValidateOtp = document.getElementById("btnValidateOtp");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const mobileInput   = document.getElementById("mobile");
  const otpInput      = document.getElementById("otp");

  // --- Request OTP ---
  if (btnRequestOtp) {
    btnRequestOtp.addEventListener("click", async () => {
      console.log("Request OTP button clicked");

      const clientId = usernameInput?.value?.trim();
      const password = passwordInput?.value?.trim();
      const mobile   = mobileInput?.value?.trim();

      if (!clientId || !password || !mobile) {
        alert("⚠️ Please fill Username, Password, and Mobile.");
        return;
      }

      try {
        const res = await fetch(API_BASE + "/api/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, password, mobile })
        });

        const text = await res.text();
        console.log("✅ Request OTP response:", res.status, text);

        if (res.ok) {
          alert("✅ OTP sent successfully. Please enter the OTP below.");
        } else {
          alert("❌ OTP request failed (" + res.status + "). See console.");
        }
      } catch (err) {
        console.error("❌ Request OTP fetch error:", err);
        alert("Error: " + err.message);
      }
    });
  }

  // --- Validate OTP ---
  if (btnValidateOtp) {
    btnValidateOtp.addEventListener("click", async () => {
      console.log("Validate OTP button clicked");

      const clientId = usernameInput?.value?.trim();
      const password = passwordInput?.value?.trim();
      const mobile   = mobileInput?.value?.trim();
      const otp      = otpInput?.value?.trim();

      if (!clientId || !password || !mobile || !otp) {
        alert("⚠️ Please fill Username, Password, Mobile, and OTP.");
        return;
      }

      try {
        const res = await fetch(API_BASE + "/api/validate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, password, mobile, otp })
        });

        const text = await res.text();
        console.log("✅ Validate OTP response:", res.status, text);

        if (res.ok) {
          alert("🎉 OTP validated successfully. You are logged in!");
        } else {
          alert("❌ OTP validation failed (" + res.status + "). See console.");
        }
      } catch (err) {
        console.error("❌ Validate OTP fetch error:", err);
        alert("Error: " + err.message);
      }
    });
  }
});
