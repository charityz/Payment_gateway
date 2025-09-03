//  REGISTRATION  LOGIC
// let otpModalLoaded;
// async function loadOtpModal() {
//   if (otpModalLoaded) return otpModalLoaded; // avoid duplicate loads
//   otpModalLoaded = new Promise(async (resolve, reject) => {
//     try {
//       const res = await fetch("/Frontend/html/otp_popup.html");
//       if (!res.ok) throw new Error("Failed to load OTP modal");
//       const html = await res.text();
//       document.body.insertAdjacentHTML("beforeend", html);
//       attachOtpHandlers();
//       resolve();
//     } catch (err) {
//       console.error("Could not load OTP modal:", err);
//       reject(err);
//     }
//   });
//   return otpModalLoaded;
// }



// async function loadOtpModal() {
//   otpModalLoaded = new Promise(async (resolve, reject) => {
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:5500/Frontend/html/otp_popup.html"
//       );
//       if (!res.ok) throw new Error("Failed to load OTP modal");
//       const html = await res.text();
//       document.body.insertAdjacentHTML("beforeend", html);
//       attachOtpHandlers();
//       resolve();
//     } catch (err) {
//       console.error("Could not load OTP modal:", err);
//       reject(err);
//     }
//   });
// }
// function attachOtpHandlers() {
//   let otpModal = document.querySelector("#otp-modal");
//   let otpInputs = otpModal.querySelectorAll(".otp-box");
//   let otpSubmit = document.querySelector("#otp-submit");
//   let otpClose = document.querySelector("#otp-close");
//   let otpMessage = document.querySelector("#otp-message");

//   function open() {
//     otpModal.style.display = "flex";
//     otpInputs.forEach((input) => (input.value = ""));
//     otpInputs[0].focus();
//   }

//   function close() {
//     otpModal.style.display = "none";
//   }

//   otpInputs.forEach((input, idx) => {
//     input.addEventListener("input", () => {
//       input.value = input.value.replace(/\D/g, "");
//       if (input.value && idx < otpInputs.length - 1) {
//         otpInputs[idx + 1].focus();
//       }
//     });
//     input.addEventListener("keydown", (e) => {
//       if (e.key === "Backspace" && !input.value && idx > 0) {
//         otpInputs[idx - 1].focus();
//       }
//     });
//   });

//   otpSubmit.addEventListener("click", async () => {
//     const otp = Array.from(otpInputs)
//       .map((i) => i.value)
//       .join("");
//     if (otp.length !== 6) {
//       otpMessage.style.color = "red";
//       otpMessage.textContent = "Please enter all 6 digits.";
//       return;
//     }

//     otpMessage.style.color = "black";
//     otpMessage.textContent = "Verifying...";

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/v1/verify_registration_otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ otp }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "OTP verification failed");
//       }

//       otpMessage.style.color = "green";
//       otpMessage.textContent = "OTP Verified successfully!";
//       setTimeout(() => {
//         close();
//       }, 3000);
//     } catch (error) {
//       otpMessage.style.color = "red";
//       otpMessage.textContent = error.message;
//     }
//   });

//   otpClose.addEventListener("click", close);
//   otpModal.addEventListener("click", (e) => {
//     if (e.target === otpModal) close();
//   });

//   window._internalOpenOtpModal = open;
//   window.loadOtpModal = close;
// }

// window.openOtpModal = async function () {
//   if (otpModalLoaded) {
//     await otpModalLoaded;
//     window._internalOpenOtpModal();
//   } else {
//     console.error("OTP modal is not loaded yet.");
//   }
// };

// // REG PAGE LOGIC
// document.addEventListener("DOMContentLoaded", async () => {
//   await loadOtpModal();

//   const registerButton = document.querySelector("#register-btn");
//   const registerSpinner = document.querySelector("#register-spinner");
//   const registerText = document.querySelector("#register-text");

//   registerButton.addEventListener("click", async (e) => {
//     e.preventDefault();

//     // Gather form values
//     let country = document.querySelector("#country").value.trim();
//     let business_name = document.querySelector("#business").value.trim();
//     let first_name = document.querySelector("#first-name").value.trim();
//     let last_name = document.querySelector("#last-name").value.trim();
//     let email = document.querySelector("#email").value.trim();
//     let phone_number = document.querySelector("#phone").value.trim();
//     let password = document.querySelector("#password").value.trim();

//     // Validate required fields
//     if (
//       !country ||
//       !first_name ||
//       !last_name ||
//       !email ||
//       !phone_number ||
//       !password
//     ) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const formData = {
//       first_name,
//       last_name,
//       email,
//       phone_number,
//       password,
//       country,
//       business_name,
//       defaultPassword: "",
//     };

//     try {
//       // Show loading state
//       registerSpinner.classList.remove("hidden");
//       registerText.textContent = "Registering...";
//       registerButton.disabled = true;

//       // Short delay to show spinner before request
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       const response = await fetch(
//         "http://127.0.0.1:8000/api/v1/register_user",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(formData),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.detail || "Registration failed");
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       document.querySelector("#my_modal_1").close();

//       openOtpModal();
//     } catch (error) {
//       console.error("Registration error:", error);
//       alert(error.message);
//     } finally {
//       // Reset button state
//       registerSpinner.classList.add("hidden");
//       registerText.textContent = "Register";
//       registerButton.disabled = false;
//     }
//   });
// });



// // LOGIN LOGIC

// async function loadOtpModal() {
//   otpModalLoaded = new Promise(async (resolve, reject) => {
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:5500/Frontend/html/otp_popup.html"
//       );
//       if (!res.ok) throw new Error("Failed to load OTP modal");
//       const html = await res.text();
//       document.body.insertAdjacentHTML("beforeend", html);
//       attachOtpHandlers();
//       resolve();
//     } catch (err) {
//       console.error("Could not load OTP modal:", err);
//       reject(err);
//     }
//   });
// }
// function attachOtpHandlers() {
//   let otpModal = document.querySelector("#otp-modal");
//   let otpInputs = otpModal.querySelectorAll(".otp-box");
//   let otpSubmit = document.querySelector("#otp-submit");
//   let otpClose = document.querySelector("#otp-close");
//   let otpMessage = document.querySelector("#otp-message");

//   // open()
//   function open() {
//     otpModal.style.display = "flex";
//     otpInputs.forEach((input) => (input.value = ""));
//     otpInputs[0].focus();
//   }

//   // close()
//   function close() {
//     otpModal.style.display = "none";
//   }

//   otpInputs.forEach((input, idx) => {
//     input.addEventListener("input", () => {
//       input.value = input.value.replace(/\D/g, "");
//       if (input.value && idx < otpInputs.length - 1) {
//         otpInputs[idx + 1].focus();
//       }
//     });
//     input.addEventListener("keydown", (e) => {
//       if (e.key === "Backspace" && !input.value && idx > 0) {
//         otpInputs[idx - 1].focus();
//       }
//     });
//   });

//   otpSubmit.addEventListener("click", async () => {
//     const otp = Array.from(otpInputs)
//       .map((i) => i.value)
//       .join("");
//     if (otp.length !== 6) {
//       otpMessage.style.color = "red";
//       otpMessage.textContent = "Please enter all 6 digits.";
//       return;
//     }

//     otpMessage.style.color = "black";
//     otpMessage.textContent = "Verifying...";

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/v1/verify_otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email: window.currentLoginEmail, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "OTP verification failed");
//       }
//       localStorage.setItem("authToken", data.access_token);

//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           id: data.id,
//           name: data.name,
//           email: data.email,
//           created_at: data.created_at
//         })
//       );

//       otpMessage.style.color = "green";
//       otpMessage.textContent = "Login successful!";

//       // Insert success alert here
//       document.body.insertAdjacentHTML(
//         "beforeend",
//         `
//   <div role="alert" class="alert alert-success" style="position:fixed; top:10px; right:10px; z-index:9999;">
//     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
//         d="M9 12l2 2 4-4m6 2a9 9 0
//         11-18 0 9 9 0 0118 0z" />
//     </svg>
//     <span>Login successful!</span>
//   </div>
// `
//       );
// localStorage.setItem("logins", "true")
//       setTimeout(() => {
//         document.querySelector(".alert.alert-success")?.remove();
//       }, 2000);

//       setTimeout(() => {
//         close();
//         window.location.href =
//           "http://127.0.0.1:5500/Frontend/html/userdashboard.html";
//       }, 1500);
//     } catch (error) {
//       otpMessage.style.color = "red";
//       otpMessage.textContent = error.message;
//     }
//   });

//   otpClose.addEventListener("click", close);
//   otpModal.addEventListener("click", (e) => {
//     if (e.target === otpModal) close();
//   });

//   document.querySelector("#login_modal").close();
// }

// window.openOtpModal = async function () {
//   await loadOtpModal();
//   window._internalOpenOtpModal();
// };


// // window.openOtpModal = async function () {
// //   if (otpModalLoaded) {
// //     await otpModalLoaded;
// //     window._internalOpenOtpModal();
// //   } else {
// //     console.error("OTP modal is not loaded yet.");
// //   }
// // };

// // SIGN IN PAGE LOGIC
// document.addEventListener("DOMContentLoaded", async () => {
//   await loadOtpModal();

//   let loginForm = document.querySelector("#login-form");
//   let loginEmail = document.querySelector("#login-email");
//   let loginSpinner = document.querySelector("#login-spinner");
//   let loginBtn = document.querySelector("#loginbtn");
//   let loginText = document.querySelector("#login-text");

//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = loginEmail.value.trim();
//     if (!email) {
//       alert("Please enter your email");
//       return;
//     }

//     loginSpinner.classList.remove("hidden");
//     loginText.textContent = "Sending OTP...";
//     loginBtn.disabled = true;

//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     try {
//       let otpResponse = await fetch("http://127.0.0.1:8000/api/v1/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       const otpData = await otpResponse.json();

//       if (!otpResponse.ok) {
//         alert(otpData.detail || "Failed to send OTP");
//         return;
//       }

//       window.currentLoginEmail = email;

//       // Open the OTP modal
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//   document.querySelector("#login_modal").close();
//       openOtpModal();
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       alert("An error occurred, please try again");
//     } finally {
//       loginSpinner.classList.add("hidden");
//       loginText.textContent = "Login";
//       loginBtn.disabled = false;
//     }
//   });
// });


// =======================
// ✅ OTP MODAL HANDLER
// =======================
let otpModalLoaded = null;
let otpContext = null; // {type: "register"|"login", email}

async function loadOtpModal() {
  if (otpModalLoaded) return otpModalLoaded;

  otpModalLoaded = new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("otp_popup.html");
      if (!res.ok) throw new Error("Failed to load OTP modal");
      const html = await res.text();
      document.body.insertAdjacentHTML("beforeend", html);

      attachOtpHandlers();
      resolve();
    } catch (err) {
      console.error("Could not load OTP modal:", err);
      reject(err);
    }
  });

  return otpModalLoaded;
}

function attachOtpHandlers() {
  let otpModal = document.querySelector("#otp-modal");
  let otpInputs = otpModal.querySelectorAll(".otp-box");
  let otpSubmit = document.querySelector("#otp-submit");
  let otpClose = document.querySelector("#otp-close");
  let otpMessage = document.querySelector("#otp-message");

  function open() {
    otpModal.style.display = "flex";
    otpInputs.forEach((input) => (input.value = ""));
    otpInputs[0].focus();
  }

  function close() {
    otpModal.style.display = "none";
  }

  // OTP input navigation
  otpInputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      if (input.value && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });
  });

  otpSubmit.addEventListener("click", async () => {
    const otp = Array.from(otpInputs).map((i) => i.value).join("");
    if (otp.length !== 6) {
      otpMessage.style.color = "red";
      otpMessage.textContent = "Please enter all 6 digits.";
      return;
    }

    otpMessage.style.color = "black";
    otpMessage.textContent = "Verifying...";

    try {
      let endpoint = "";
      let payload = {};

      if (otpContext?.type === "register") {
        endpoint = "http://127.0.0.1:8000/api/v1/verify_registration_otp";
        payload = { otp };
      } else if (otpContext?.type === "login") {
        endpoint = "http://127.0.0.1:8000/api/v1/verify_otp";
        payload = { email: otpContext.email, otp };
      } else {
        throw new Error("Invalid OTP context");
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "OTP verification failed");

      if (otpContext.type === "login") {
        // Save login state
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          created_at: data.created_at
        }));
        otpMessage.style.color = "green";
        otpMessage.textContent = "Login successful!";
        setTimeout(() => {
          close();
          window.location.href = "userdashboard.html";
        }, 1500);
      } else {
        otpMessage.style.color = "green";
        otpMessage.textContent = "OTP Verified successfully!";
        setTimeout(() => close(), 1500);
      }

    } catch (err) {
      otpMessage.style.color = "red";
      otpMessage.textContent = err.message;
    }
  });

  otpClose.addEventListener("click", close);
  otpModal.addEventListener("click", (e) => {
    if (e.target === otpModal) close();
  });

  window._internalOpenOtpModal = open;
}

// ✅ Public API
window.openOtpModal = async function (context) {
  otpContext = context; // save type/email
  await loadOtpModal();
  window._internalOpenOtpModal();
};

// =======================
// ✅ REGISTER LOGIC
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  await loadOtpModal();

  const registerButton = document.querySelector("#register-btn");
  const registerSpinner = document.querySelector("#register-spinner");
  const registerText = document.querySelector("#register-text");

  registerButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let country = document.querySelector("#country").value.trim();
    let business_name = document.querySelector("#business").value.trim();
    let first_name = document.querySelector("#first-name").value.trim();
    let last_name = document.querySelector("#last-name").value.trim();
    let email = document.querySelector("#email").value.trim();
    let phone_number = document.querySelector("#phone").value.trim();
    let password = document.querySelector("#password").value.trim();

    if (!country || !first_name || !last_name || !email || !phone_number || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = { first_name, last_name, email, phone_number, password, country, business_name };

    try {
      registerSpinner.classList.remove("hidden");
      registerText.textContent = "Registering...";
      registerButton.disabled = true;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("http://127.0.0.1:8000/api/v1/register_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Registration failed");

      document.querySelector("#my_modal_1").close();

      // ✅ Open OTP modal in register mode
      openOtpModal({ type: "register", email });

    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      registerSpinner.classList.add("hidden");
      registerText.textContent = "Register";
      registerButton.disabled = false;
    }
  });
});

// =======================
// ✅ LOGIN LOGIC
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  let loginForm = document.querySelector("#login-form");
  let loginEmail = document.querySelector("#login-email");
  let loginSpinner = document.querySelector("#login-spinner");
  let loginBtn = document.querySelector("#loginbtn");
  let loginText = document.querySelector("#login-text");
  let errors = {
    login: "Error- Invalid Email, Kindly register"
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    loginSpinner.classList.remove("hidden");
    loginText.textContent = "Sending OTP...";
    loginBtn.disabled = true;

    try {
      console.log("email", email)
      let otpResponse = await fetch("http://127.0.0.1:8000/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) throw new Error(otpData.detail || "Failed to send OTP");

      document.querySelector("#login_modal").close();

      // ✅ Open OTP modal in login mode
      openOtpModal({ type: "login", email });

    } catch (err) {
      console.log(err.message)
      console.log("Error sending OTP:", err);
      alert(err.message || errors.login);
    } finally {
      loginSpinner.classList.add("hidden");
      loginText.textContent = "Login";
      loginBtn.disabled = false;
    }
  });
});
