document.addEventListener("DOMContentLoaded", () => {
  let signInBtn = document.querySelector("#signInBtn");
  let createAccBtn = document.querySelector("#createAccBtn");
  let userAvatar = document.querySelector("#userAvatar");

  let savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser && savedUser.name) {
    signInBtn.classList.add("hidden");
    createAccBtn.classList.add("hidden");

    const initials = `${savedUser.name[0]}`.toUpperCase();
    userAvatar.textContent = initials;
    userAvatar.classList.remove("hidden");

    userAvatar.addEventListener("click", () => {
      window.location.href = "http://127.0.0.1:5500/Frontend/html/userdashboard.html";
    });
  } else {
    userAvatar.classList.add("hidden");
    signInBtn.classList.remove("hidden");
    createAccBtn.classList.remove("hidden");
  }
});

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await loginUser(email, password); 
  });
  // auth.js (or inside make_payment.js)

async function loginUser(email, password) {
  try {
    const res = await fetch("https://blink-pay-bank-app-backend.onrender.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Login failed");
    }

    // Save token for later use
    localStorage.setItem("authToken", data.token);

    alert("Login successful!");
    return data.token;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

