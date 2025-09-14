// frontend.js

// Your Vercel backend base URL
const API_BASE = "https://pradeepkumarv-github-io.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  console.log("frontend.js loaded and DOM ready.");

  // Get input fields and button
  const btnRequestOtp = document.getElementById("btnRequestOtp");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const mobileInput   = document.getElementById("mobile");

  if (!btnRequestOtp) {
    console.error("❌ Request OTP button (#btnRequestOtp) not found.");
    return;
  }

  // Add click handler
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
        alert("✅ OTP request sent successfully. Check your mobile.");
      } else {
        alert("❌ OTP request failed (" + res.status + "). See console.");
      }
    } catch (err) {
      console.error("❌ Request OTP fetch error:", err);
      alert("Error: " + err.message);
    }
  });
});
