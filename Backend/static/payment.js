// document.addEventListener("DOMContentLoaded", async () => {
//   const url = document.URL;
//   console.log(url);

//   const id = url.split("id=")[1];
//   console.log(id);

//   // const database =[
//   //   {
//   //     id: 987654321,
//   //     payment_id: 56768689,
//   //     email: "def@gmail.com",
//   //     amount: 2400.98,
//   //     createdAt: "Tue 12 aug, 2008"
//   //   },
//   //   {
//   //     id:1234567890,
//   //     payment_id: 56768686,
//   //     email: "abc@gmail.com",
//   //     amount: 1200.98,
//   //     createdAt: "Tue 17 aug, 2008"
//   //   }
//   // ]
//   async function fetchDataFromPaymentId(payment_id) {
//     if (!payment_id) {
//       return "Input Payment Id";
//     }
//     const response = await fetch(
//       `http://127.0.0.1:8000/api/v1/get_payment?id=${payment_id}`
//     );
//     const data = await response.json();
//     return data;
//     console.log(data.message);
//     // check db
//     // const getPayment = database.filter((payment) => payment.payment_id === payment_id)
//     // if(getPayment[0] === undefined){
//     //   return `Payment wuth the ID: ${payment_id} not found`
//     // }
//     // return getPayment[0];
//   }

//   const { email: userEmail, amount: userAmount } = await fetchDataFromPaymentId(
//     id
//   );

//   const user = JSON.parse(localStorage.getItem("user"));
//   // if (!user) {
//   //   window.location.href = "/static/index.html";
//   //   return;
//   // }
//   document.getElementById("email").value = userEmail || user.email;
//   const qp = new URLSearchParams(location.search);
//   document.getElementById("amount").value = qp.get("amount") || userAmount;

//   // ========= Tabs =========
//   let tabCard = document.querySelector("#tab-card");
//   let tabTransfer = document.querySelector("#tab-transfer");
//   let tabWallet = document.querySelector("#tab-wallet");
//   let forms = {
//     card: document.querySelector("#form-card"),
//     transfer: document.querySelector("#form-transfer"),
//     wallet: document.querySelector("#form-wallet"),
//   };
//   const tabs = {
//     card: tabCard,
//     transfer: tabTransfer,
//     wallet: tabWallet,
//   };

//   function setActive(which) {
//     Object.values(tabs).forEach((btn) => {
//       btn.classList.remove("bg-green-500", "text-white");
//       btn.classList.add("bg-gray-200", "text-gray-700");
//     });
//     tabs[which].classList.remove("bg-gray-200", "text-gray-700");
//     tabs[which].classList.add("bg-green-500", "text-white");

//     Object.values(forms).forEach((f) => f.classList.add("hidden"));
//     forms[which].classList.remove("hidden");

//     // Show card mock only on card tab
//     document
//       .getElementById("card-mock")
//       .classList.toggle("hidden", which !== "card");
//   }

//   tabCard.addEventListener("click", () => setActive("card"));
//   tabTransfer.addEventListener("click", () => setActive("transfer"));
//   tabWallet.addEventListener("click", () => setActive("wallet"));
//   setActive("card");

//   // ========= Card Inputs =========
//   let cardNumber = document.querySelector("#card-number");
//   let expiry = document.querySelector("#expiry");
//   let cvv = document.querySelector("#cvv");
//   let errCard = document.querySelector("#err-card");
//   let errExp = document.querySelector("#err-exp");
//   let errCvv = document.querySelector("#err-cvv");

//   const mockNum = document.querySelector("#mock-number");
//   const mockExp = document.querySelector("#mock-exp");
//   const mockCvv = document.querySelector("#mock-cvv");

//   function luhnValid(num) {
//     let sum = 0,
//       dbl = false;
//     for (let i = num.length - 1; i >= 0; i--) {
//       let d = parseInt(num[i], 10);
//       if (dbl) {
//         d *= 2;
//         if (d > 9) d -= 9;
//       }
//       sum += d;
//       dbl = !dbl;
//     }
//     return sum % 10 === 0;
//   }

//   cardNumber.addEventListener("input", () => {
//     let val = cardNumber.value.replace(/\D/g, "").slice(0, 16);
//     const grouped = val.match(/.{1,4}/g)?.join("-") || val;
//     cardNumber.value = grouped;
//     mockNum.textContent = grouped.padEnd(19, "•");
//     errCard.classList.add("hidden");
//     cardNumber.classList.remove("border-red-500");
//   });

//   expiry.addEventListener("input", () => {
//     let val = expiry.value.replace(/\D/g, "");
//     if (val.length === 2 && !expiry.value.includes("/")) {
//       // Add slash immediately after 2 digits entered
//       val = val + "/";
//     } else if (val.length > 2) {
//       val = val.slice(0, 2) + "/" + val.slice(2, 4);
//     }

//     expiry.value = val;
//     mockExp.textContent = val || "MM/YY";
//     errExp.classList.add("hidden");
//     expiry.classList.remove("border-red-500");
//   });

//   cvv.addEventListener("input", () => {
//     cvv.value = cvv.value.replace(/\D/g, "").slice(0, 3);
//     mockCvv.textContent = cvv.value.replace(/./g, "*") || "***";
//     errCvv.classList.add("hidden");
//     cvv.classList.remove("border-red-500");
//   });

//   function isExpired(mmYY) {
//     const [mmS, yyS] = (mmYY || "").split("/");
//     const mm = parseInt(mmS, 10),
//       yy = parseInt(yyS, 10);
//     if (!mm || !yy || mm < 1 || mm > 12) return true;
//     const now = new Date();
//     const curM = now.getMonth() + 1;
//     const curY = now.getFullYear() % 100;
//     return yy < curY || (yy === curY && mm < curM);
//   }

//   // ========= Payment Helper =========
//   async function makePayment(payload, btn, btnText = "Pay Now") {
//     const spinner = document.getElementById("btn-spinner");
//     const text = btn.querySelector(".btn-text") || btn;
//     btn.disabled = true;
//     if (spinner) spinner.classList.remove("hidden");
//     if (text) text.textContent = "Processing…";

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/v1/make_payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Request failed");
//       alert(data.message || "Payment processed successfully!");
//     } catch (e) {
//       alert("Error: " + e.message);
//     } finally {
//       btn.disabled = false;
//       if (spinner) spinner.classList.add("hidden");
//       if (text) text.textContent = btnText;
//     }
//   }

//   // ========= Card Submit =========
//   document.getElementById("pay-now").addEventListener("click", () => {
//     const raw = cardNumber.value.replace(/-/g, "");
//     let valid = true;

//     if (raw.length !== 16 || !luhnValid(raw)) {
//       errCard.classList.remove("hidden");
//       cardNumber.classList.add("border-red-500");
//       valid = false;
//     }
//     if (isExpired(expiry.value)) {
//       errExp.classList.remove("hidden");
//       expiry.classList.add("border-red-500");
//       valid = false;
//     }
//     if (cvv.value.length !== 3) {
//       errCvv.classList.remove("hidden");
//       cvv.classList.add("border-red-500");
//       valid = false;
//     }
//     if (!valid) return;

//     makePayment(
//       {
//         method: "card",
//         amount: Number(document.querySelector("#amount").value),
//         currency: "NGN",
//         card_number: raw,
//         expiry: expiry.value,
//         cvv: cvv.value,
//       },
//       document.getElementById("pay-now")
//     );
//   });

//   // ========= Transfer Submit with Validation =========
//   document
//     .querySelector("#tab-transfer")
//     .addEventListener("click", async () => {
//       console.log("clicked");

//       try {
//         const amount = Number(document.querySelector("#amount").value);
//         const token = localStorage.getItem("authToken");

//         if (!token) {
//           alert("You must login first!");
//           return;
//         }

//         const payload = { amount };
//         // console.log("amount", payload);

//         const res = await fetch(
//           "https://blink-pay-bank-app-backend.onrender.com/api/v1/account/create-virtual-account",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(payload),
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           // console.log(data);
//           throw new Error(data.msg || "Request failed");
//         }
//         let {
//           acc_number,
//           bank_name,
//           amount: generatedAmount,
//         } = data.virtual_account;
//         let accNumber = document.querySelector("#account-number");
//         let bankName = document.querySelector("#bank-name");
//         let amountPassed = document.querySelector("#amount");
//         accNumber.textContent = acc_number;
//         bankName.textContent = bank_name;
//         amountPassed.textContent = generatedAmount;

//         // alert(
//         //   `Transfer NGN${generatedAmount} to:\n\nAccount Number: ${acc_number}\nBank: ${bank_name}`
//         // );

//         // alert(`${data.msg || "Check response"}`);
//         console.log("Response:", data);
//       } catch (err) {
//         console.error(err);
//         alert(err.message);
//       }
//       document
//         .querySelector("#confirm-transfer")
//         .addEventListener("click", () => {
//           console.log("clicked");
//         });
//     });

//   // ========= Wallet Submit with Validation =========
//   document.querySelector("#wallet-btn").addEventListener("click", () => {
//     const walletId = document.querySelector("#wallet-id");
//     let valid = true;

//     walletId.classList.remove("border-red-500");
//     if (!walletId.value.trim()) {
//       walletId.classList.add("border-red-500");
//       valid = false;
//     }

//     if (!valid) return;

//     makePayment(
//       {
//         method: "wallet",
//         amount: parseFloat(document.querySelector("#amount").value),
//         currency: "NGN",
//         wallet_id: walletId.value,
//       },
//       document.getElementById("wallet-btn"),
//       "Pay from Wallet"
//     );
//   });
// });
// document.getElementById("back-btn").addEventListener("click", () => {
//   window.location.href =
//     "http://127.0.0.1:5500/Frontend/html/userdashboard.html";
// });
