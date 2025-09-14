let HDFC_TOKEN = null;

document.addEventListener("DOMContentLoaded", () => {
  const btnRequestOtp = document.getElementById("btnRequestOtp");
  const btnValidateOtp = document.getElementById("btnValidateOtp");
  const btnGetHoldings = document.getElementById("btnGetHoldings");

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const mobile   = document.getElementById("mobile");
  const otp      = document.getElementById("otp");
  const holdingsDiv = document.getElementById("holdings");

  // Request OTP
  btnRequestOtp.addEventListener("click", async () => {
    const res = await fetch(API_BASE + "/api/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: username.value, password: password.value, mobile: mobile.value })
    });
    console.log("Request OTP:", res.status, await res.text());
  });

  // Validate OTP
  btnValidateOtp.addEventListener("click", async () => {
    const res = await fetch(API_BASE + "/api/validate-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: username.value, password: password.value, mobile: mobile.value, otp: otp.value })
    });
    const data = await res.json();
    console.log("Validate OTP:", data);
    if (res.ok && data.access_token) {
      HDFC_TOKEN = data.access_token;
      alert("OTP validated! Token stored.");
    } else {
      alert("OTP validation failed.");
    }
  });

  // Get Holdings
  btnGetHoldings.addEventListener("click", async () => {
    if (!HDFC_TOKEN) return alert("Please validate OTP first.");
    const res = await fetch(API_BASE + "/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: HDFC_TOKEN })
    });
    const data = await res.json();
    console.log("Holdings:", data);
    holdingsDiv.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
  });
});
