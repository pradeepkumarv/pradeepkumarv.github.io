// frontend.js

// Set your backend base URL (Vercel deployment)
const API_BASE = "https://pradeepkumarv-github-io.vercel.app";

// Run only after the page is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("frontend.js loaded, wiring up buttons...");

  // Grab elements
  const btnRequestOtp = document.getElementById("btnRequestOtp");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const mobileInput   = document.getElementById("mobile");

  if (!btnRequestOtp) {
    console.error("Request OTP button (#btnRequestOtp) not found in HTML.");
    return;
  }

  // Attach click handler
  btnRequestOtp.addEventListener("click", async () => {
    console.log("Request OTP clicked");

    // Collect values from input fields
    const clientId = usernameInput?.value?.trim();
    const password = passwordInput?.value?.trim();
    const mobile   = mobileInput?.value?.trim();

    if (!clientId || !password || !mobile) {
      alert("Please fill in Username, Password, and Mobile before requesting OTP.");
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, password, mobile }),
        credentials: "include"
      });

      const text = await res.text();
      console.log("Request OTP response:", res.status, text);

      if (res.ok) {
        alert("OTP request successful. Please check your mobile.");
      } else {
        alert("OTP request failed (" + res.status + "). See console for details.");
      }
    } catch (err) {
      console.error("Request OTP fetch error:", err);
      alert("Error sending OTP request: " + err.message);
    }
  });
});
