document.addEventListener("DOMContentLoaded", async () => {
  console.log("hi")
  const url = document.URL;
  // console.log(url);
  // let URL = https;
  // console.log("url", URL)

  let id = JSON.parse(localStorage.getItem("id"));
  // console.log("id", id);
  // const id = url.split("id=")[1];
  // console.log(id);

  let loginToken = localStorage.getItem("token") || localStorage.getItem("authToken")
  console.log(loginToken)
  async function fetchDataFromPaymentId(payment_id) {
    
    if (!payment_id) {
      return "Input Payment Id";
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/get_payment?id=${payment_id}`,
    );
    const data = await response.json();
    return data;
  }

  const {email: userEmail, amount: userAmount } = await fetchDataFromPaymentId(
    id
  );

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("email").value = userEmail || user.email;
  const qp = new URLSearchParams(location.search);
  document.querySelector("#amount").value || 10000;

  // ========= Tabs =========
  let tabCard = document.querySelector("#tab-card");
  let tabTransfer = document.querySelector("#tab-transfer");
  let tabWallet = document.querySelector("#tab-wallet");
  let forms = {
    card: document.querySelector("#form-card"),
    transfer: document.querySelector("#form-transfer"),
    wallet: document.querySelector("#form-wallet"),
  };
  const tabs = {
    card: tabCard,
    transfer: tabTransfer,
    wallet: tabWallet,
  };

  function setActive(which) {
    Object.values(tabs).forEach((btn) => {
      btn.classList.remove("bg-green-500", "text-white");
      btn.classList.add("bg-gray-200", "text-gray-700");
    });
    tabs[which].classList.remove("bg-gray-200", "text-gray-700");
    tabs[which].classList.add("bg-green-500", "text-white");

    Object.values(forms).forEach((f) => f.classList.add("hidden"));
    forms[which].classList.remove("hidden");

  
    document
      .getElementById("card-mock")
      .classList.toggle("hidden", which !== "card");
  }

  tabCard.addEventListener("click", () => setActive("card"));
  tabTransfer.addEventListener("click", () => setActive("transfer"));
  tabWallet.addEventListener("click", () => setActive("wallet"));
  setActive("card");

  // ========= Card Inputs =========
  let cardNumber = document.querySelector("#card-number");
  let expiry = document.querySelector("#expiry");
  let cvv = document.querySelector("#cvv");
  let errCard = document.querySelector("#err-card");
  let errExp = document.querySelector("#err-exp");
  let errCvv = document.querySelector("#err-cvv");

  const mockNum = document.querySelector("#mock-number");
  const mockExp = document.querySelector("#mock-exp");
  const mockCvv = document.querySelector("#mock-cvv");

  function luhnValid(num) {
    let sum = 0,
      dbl = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let d = parseInt(num[i], 10);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  }

  cardNumber.addEventListener("input", () => {
    let val = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    const grouped = val.match(/.{1,4}/g)?.join("-") || val;
    cardNumber.value = grouped;
    mockNum.textContent = grouped.padEnd(19, "•");
    errCard.classList.add("hidden");
    cardNumber.classList.remove("border-red-500");

    const type = getCardType(val);
    if (type) {
      document.getElementById("mockCardType").textContent = type;
    } else {
      document.getElementById("mockCardType").textContent = "";
    }
  });

  function getCardType(num) {
    if (/^4/.test(num)) {
      return "Visa";
    }
    if (/^5[1-5]/.test(num)) {
      return "MasterCard";
    }
    if (/^3[47]/.test(num)) {
      return "American Express";
    }
    if (/^6(?:011|5)/.test(num)) {
      return "Discover";
    }
    return null;
  }

  function isExpired(mmYY) {
    const [mmS, yyS] = (mmYY || "").split("/");
    const mm = parseInt(mmS, 10),
      yy = parseInt(yyS, 10);
    if (!mm || !yy || mm < 1 || mm > 12) return true;
    const now = new Date();
    const curM = now.getMonth() + 1;
    const curY = now.getFullYear() % 100;
    return yy < curY || (yy === curY && mm < curM);
  }

  // ========= Payment Helper =========
  async function makePayment(payload, btn, btnText = "Pay Now") {
    const spinner = document.getElementById("btn-spinner");
    const text = btn.querySelector(".btn-text") || btn;
    btn.disabled = true;
    if (spinner) spinner.classList.remove("hidden");
    if (text) text.textContent = "Processing…";

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/make_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      alert(data.message || "Payment processed successfully!");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      btn.disabled = false;
      if (spinner) spinner.classList.add("hidden");
      if (text) text.textContent = btnText;
    }
  }

  // ========= Card Submit =========
  document.getElementById("pay-now").addEventListener("click", () => {
    const raw = cardNumber.value.replace(/-/g, "");
    let valid = true;

    if (raw.length !== 16 || !luhnValid(raw)) {
      errCard.classList.remove("hidden");
      cardNumber.classList.add("border-red-500");
      valid = false;
    }
    if (isExpired(expiry.value)) {
      errExp.classList.remove("hidden");
      expiry.classList.add("border-red-500");
      valid = false;
    }
    if (cvv.value.length !== 3) {
      errCvv.classList.remove("hidden");
      cvv.classList.add("border-red-500");
      valid = false;
    }
    if (!valid) return;

    makePayment(
      {
        method: "card",
        amount: Number(document.querySelector("#amount")),
        currency: "NGN",
        card_number: raw,
        expiry: expiry.value,
        cvv: cvv.value,
      },
      document.getElementById("pay-now")
    );
  });



  "********************"

document.querySelector("#tab-transfer")
  .addEventListener("click", async () => {
    // console.log("clicked");
   
    try {
      const amount = Number(document.querySelector("#amount").value);
      const token = localStorage.getItem("authToken");

      
      if (!token) {
        alert("You must login first!");
        return;
      }

      const payload = {amount};
      // console.log("amount", payload)

      const res = await fetch(
        "https://blink-pay-bank-app-backend.onrender.com/api/v1/account/create-virtual-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // console.log(data)
        throw new Error(data.msg || "Request failed");
      }
      let {acc_number, bank_name, amount: generatedAmount } = data.virtual_account;
      let accNumber = document.querySelector("#account-number");
      let bankName = document.querySelector("#bank-name");
      let amountPassed = document.querySelector("#amount");
      accNumber.textContent = acc_number;
      bankName.textContent = bank_name;
      amountPassed.textContent = generatedAmount;
    

      // alert(
      //   `Transfer NGN${generatedAmount} to:\n\nAccount Number: ${acc_number}\nBank: ${bank_name}`
      // );

      // alert(`${data.msg || "Check response"}`);
      // console.log("Response:", data);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    document.querySelector("#confirm-transfer").addEventListener("click", ()=>{
      // console.log("clicked")
    })
  });


  // ========= Wallet Submit with Validation =========
  document.getElementById("wallet-btn").addEventListener("click", () => {
    const walletId = document.getElementById("wallet-id");
    let valid = true;

    walletId.classList.remove("border-red-500");
    if (!walletId.value.trim()) {
      walletId.classList.add("border-red-500");
      valid = false;
    }

    if (!valid) return;

    makePayment(
      {
        method: "wallet",
        amount: parseFloat(document.getElementById("amount").value),
        currency: "NGN",
        wallet_id: walletId.value,
      },
      document.getElementById("wallet-btn"),
      "Pay from Wallet"
    );
  });
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href =
    "http://127.0.0.1:5500/Frontend/html/userdashboard.html";
});
