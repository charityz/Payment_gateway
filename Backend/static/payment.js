//  <!-- <script>
//       document.addEventListener("DOMContentLoaded", async () => {
//         const BASE_URL = "https://payment-gateway-3.onrender.com";
//         let loader = document.querySelector(".loader");
//         let everything = document.querySelector(".everything");
//         let whole_form = document.querySelector("#whole_form");
//         let emailInput = document.querySelector("#email");
//         let amountInput = document.querySelector("#amount");

//         // Initially show loader, hide form
//         loader.classList.remove("hidden");
//         everything.classList.add("hidden");
//         whole_form.classList.add("items-center", "justify-center");

//         const transactionRefId = new URLSearchParams(
//           window.location.search
//         ).get("id");
//         console.log("id", transactionRefId);
//         localStorage.setItem("payment_id", transactionRefId);

//         if (!transactionRefId) {
//           console.error("Transaction reference missing in URL");
//           return;
//         }

//         async function fetchDataFromPaymentId(payment_id) {
//           if (!payment_id) {
//             throw new Error("Missing Payment ID");
//           }
//           const response = await fetch(
//             `${BASE_URL}/api/v1/get_payment?id=${payment_id}`
//           );
//           return await response.json();
//         }

//         try {
//           const {
//             email: userEmail,
//             amount: userAmount,
//             owner_email,
//           } = await fetchDataFromPaymentId(transactionRefId);

//           // Store values
//           localStorage.setItem("owner_email", owner_email);
//           localStorage.setItem("amount_to_send", userAmount);
//           // localStorage.setItem("token", login_token);

//           // Fill in form fields
//           emailInput.value = userEmail || "N/A";
//           amountInput.value = userAmount
//             ? `₦${Number(userAmount).toLocaleString()}`
//             : "0";

//           // Hide loader & show everything
//           loader.classList.add("hidden");
//           everything.classList.remove("hidden");
//           whole_form.classList.remove("items-center", "justify-center");
//         } catch (err) {
//           console.error(err);
//           Swal.fire({
//             title: "Error",
//             text: "Failed to load payment details. Please refresh the page.",
//             icon: "error",
//           });
//         }

//         let loginUrl =
//           "https://blink-pay-bank-app-backend.onrender.com/api/v1/auth/passwordless-login";
//         let blinkPayVerifyOtpUrl =
//           "https://blink-pay-bank-app-backend.onrender.com/api/v1/auth/verify-otp";
//         let profileUrl =
//           "https://blink-pay-bank-app-backend.onrender.com/api/v1/auth/profile";

//         let payvergeSignin = `${BASE_URL}/api/v1/signin`;

//         let payvergeSignInVerifyOtp = `${BASE_URL}/api/v1/verify_otp`;

//         // blink pay

//         const login = await fetch(loginUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: localStorage.getItem("owner_email"),
//           }),
//         });

//         const passwordlessResponse = await login.json();
//         const passOtp = passwordlessResponse?.otp;
//         console.log(passwordlessResponse);

//         const blinkPayverify = await fetch(blinkPayVerifyOtpUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: localStorage.getItem("owner_email"),
//             otp: passOtp,
//           }),
//         });

//         const loginResponse = await blinkPayverify.json();

//         console.log(loginResponse);

//         let login_token = loginResponse?.token;
//         // saving token to local storage
//         localStorage.setItem("token", login_token);

//         const profile = await fetch(profileUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + login_token,
//           },
//         });
//         const profileResponse = await profile.json();
//         localStorage.setItem(
//           "user_account_number",
//           profileResponse?.user?.acc_number
//         );
//         localStorage.setItem("user_id", profileResponse?.user?.userId);
//         console.log({
//           profile_acc_num: profileResponse?.user?.acc_number,
//           profileResponse,
//         });

//         // payverge

//         async function loginToPayverge(signInLink, verifyOtpLink) {
//           const the_owner_email = localStorage.getItem("owner_email");
//           const signIn = await fetch(signInLink, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               email: the_owner_email,
//             }),
//           });
//           const signInResponse = await signIn.json();
//           console.log(signInResponse);
//           const otp = signInResponse?.otp;

//           //verify otp
//           const verifyOtp = await fetch(verifyOtpLink, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               email: the_owner_email,
//               otp,
//             }),
//           });
//           const verifyOtpResponse = await verifyOtp.json();
//           console.log(verifyOtpResponse);
//           localStorage.setItem("access_token", verifyOtpResponse?.access_token);
//         }

//         function getMinutesBetweenTimestamps(startTimeIso, endTimeIso) {
//           const startDate = new Date(startTimeIso);
//           const endDate = new Date(endTimeIso);

//           const diffInMilliseconds = Math.abs(
//             endDate.getTime() - startDate.getTime()
//           );

//           // There are 60,000 milliseconds in a minute (1000 * 60)
//           return Math.round(diffInMilliseconds / 60000);
//         }

//         const socket = new WebSocket(
//           "https://blink-pay-bank-app-backend.onrender.com"
//         );

//         socket.onopen = () => {
//           console.log("Connected to Blinkpay server", transactionRefId);
//         };

//         function clearDefaults() {
//           localStorage.removeItem("v_account");
//           localStorage.removeItem("seconds");
//           localStorage.removeItem("minute");
//         }
//         loginToPayverge(payvergeSignin, payvergeSignInVerifyOtp);
//         async function postTransactionsToPayvergeDb(
//           status,
//           tran_type = "card"
//         ) {
//           let transaction_type = tran_type;
//           let amount = Number(localStorage.getItem("amount_to_send"));
//           const postLink = `${BASE_URL}/api/v1/transactions`;

//           try {
//             status = !status ? "failed to include status" : status;

//             const payload = {
//               transaction_type,
//               amount,
//               status,
//             };
//             const postToDb = await fetch(postLink, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//               },
//               body: JSON.stringify(payload),
//             });
//             const response = await postToDb.json();
//             console.log(response);
//           } catch (error) {
//             console.error(error);
//             alert(error.message);
//           }
//           // const
//         }

//         socket.onmessage = (event) => {
//           try {
//             const { event: evt, data } = JSON.parse(event.data);
//             let txnRef = data?.transaction?.ref_id;

//             console.log("WS Event:", evt, data);

//             if (
//               localStorage.getItem("user_id") ===
//                 data?.transaction?.receiver_id &&
//               localStorage.getItem("payment_id") ===
//                 data?.transaction?.payment_id
//             ) {
//               if (evt === "transfer_initialized") {
//                 clearDefaults();
//                 // console.log(data);
//                 // console.log("initializing....")
//                 Swal.fire({
//                   title: "Please wait...",
//                   html: `
//                   <p class="animate-pulse">Hold while we confirm the transfer.. </p>
//                   <span> Do not refresh this page </span>
//                   `,
//                   icon: "info",
//                 });
//                 Swal.showLoading();
//               }
//               if (evt === "money_received") {
//                 clearDefaults();
//                 postTransactionsToPayvergeDb("successful", "transfer");
//                 // console.log(data);
//                 // console.log("money don enter oooo....")
//                 const timeout = 8000;
//                 setTimeout(() => {
//                   Swal.close();
//                 }, timeout);
//                 setTimeout(() => {
//                   Swal.fire({
//                     title: "Payment Successful 🎉",
//                     html: `
                    
//                     `,
//                     icon: "success",
//                     // confirmButtonText: "Continue",
//                   }).then(() => {
//                     window.close();
//                     window.history.back();
//                   });
//                 }, timeout);
//               }

//               if (evt === "transfer_failed") {
//                 const timeout = 8000;
//                 postTransactionsToPayvergeDb("failed", "transfer");
//                 setTimeout(() => {
//                   Swal.close();
//                 }, timeout);

//                 setTimeout(() => {
//                   Swal.fire({
//                     title: "Transfer Failed ❌",
//                     text: "Please try again later",
//                     icon: "error",
//                   }).then(() => {
//                     clearDefaults();
//                     window.close();
//                     window.history.back();
//                   });
//                 }, timeout);
//               }

//               if (evt === "card_payment_successful") {
//                 postTransactionsToPayvergeDb("successful");
//                 Swal.fire({
//                   title: "Payment Successful 🎉",
//                   html: `
//                   <p><b>Amount:</b> ${Number(
//                     data?.transaction?.amount || 0
//                   ).toLocaleString()}</p>
//                   <p><b>Reference:</b> ${localStorage.getItem("payment_id")}</p>
//                   `,
//                   icon: "success",
//                 }).then(() => {
//                   window.close();
//                   window.history.back();
//                 });
//               }

//               if (evt === "card_payment_failed") {
//                 postTransactionsToPayvergeDb("failed");
//                 Swal.fire({
//                   title: "Payment Failed ❌",
//                   text: "Please try again or use another card.",
//                   icon: "error",
//                 }).then(() => {
//                   window.close();
//                   window.history.back();
//                 });
//               }
//             }
//           } catch (e) {
//             console.error("Bad WS data", e, event.data);
//           }
//         };

//         socket.onclose = () => {
//           // console.log("Disconnected from Blinkpay server");
//           console.warn("WS closed. reconecting in 5s...");
//           setTimeout(() => location.reload(), 5000);
//         };

//         socket.onerror = (error) => {
//           console.error("WebSocket error:", error);
//         };

//         let copyAccountNumBtn = document.querySelector("#copy-account-number");
//         let copyAmountBtn = document.querySelector("#copy-amount");
//         let amountValue = document.querySelector("#amount");
//         let accNumber = document.querySelector("#account-number");
//         let amountTransfered = document.querySelector("#amount-transfered");
//         let transferTimer = document.querySelector("#timer");
//         console.log(loader, whole_form);
//         function c_timer(minute, seconds) {
//           const timer = setInterval(() => {
//             minute = Number(minute);
//             seconds = Number(seconds);
//             seconds -= 1;
//             let time_up = false;

//             if (minute === 0 && seconds === 0) {
//               time_up = true;
//               clearInterval(timer);
//               transferTimer.textContent = "This Transfer has expired";
//               localStorage.removeItem("v_account");
//               localStorage.setItem("minute", minute);
//               localStorage.setItem("seconds", seconds);
//               localStorage.setItem("start_time", false);
//               localStorage.removeItem("minute");
//               localStorage.removeItem("seconds");
//             }
//             if (seconds === 0) {
//               seconds = 59;
//               minute -= 1;
//             }
//             let fullTime = `${String(minute).padStart(2, "0")}:${String(
//               seconds
//             ).padStart(2, "0")}`;
//             if (!time_up) {
//               // console.log(fullTime);
//               transferTimer.textContent = fullTime;
//               localStorage.setItem("minute", minute);
//               localStorage.setItem("seconds", seconds);
//             }
//           }, 1000);
//         }

//         function countDownTimer(minutes, seconds = 60) {
//           let minute = minutes;
//           let minutesStorage = localStorage.getItem("minute");
//           console.log(minutesStorage);
//           let secondsStorage = localStorage.getItem("seconds");
//           if (!secondsStorage && !minutesStorage) {
//             localStorage.setItem("minute", minute);
//             localStorage.setItem("seconds", seconds);
//             c_timer(minute, seconds);
//           } else {
//             c_timer(minutesStorage, secondsStorage);
//           }
//         }

//         function copyToClipboard(button, whereToCopyFrom, defaultText) {
//           // console.log("copied")
//           navigator.clipboard.writeText(whereToCopyFrom.textContent);
//           button.textContent = "Copied!";
//           button.disabled = true;
//           button.classList.add("cursor-not-allowed");
//           button.classList.add("animate-pulse");
//           setTimeout(() => {
//             button.disabled = false;
//             button.classList.remove("animate-pulse");
//             button.classList.remove("cursor-not-allowed");
//             button.textContent = defaultText;
//           }, 3000);
//         }

//         copyAccountNumBtn.addEventListener("click", () => {
//           copyToClipboard(copyAccountNumBtn, accNumber, "Copy Account Number");
//         });

//         copyAmountBtn.addEventListener("click", () => {
//           copyToClipboard(copyAmountBtn, amountTransfered, "Copy Amount");
//         });

//         async function fetchDataFromPaymentId(payment_id) {
//           if (!payment_id) {
//             return "Input Payment Id";
//           }
//           const response = await fetch(
//             `https://payment-gateway-3.onrender.com/api/v1/get_payment?id=${payment_id}`
//           );
//           const data = await response.json();
//           localStorage.setItem("owner_email", data?.owner_email);
//           return data;
//           console.log(data);
//           console.log(data.message);
//         }

//         const {
//           email: userEmail,
//           amount: userAmount,
//           owner_email,
//         } = await fetchDataFromPaymentId(transactionRefId);

//         const user = JSON.parse(localStorage.getItem("user"));

//         JSON.stringify(localStorage.setItem("amount_to_send", userAmount));

//         // ========= Tabs =========
//         let tabCard = document.querySelector("#tab-card");
//         let tabTransfer = document.querySelector("#tab-transfer");
//         let tabWallet = document.querySelector("#tab-wallet");
//         let generated_virtual_account_amount = 0;
//         let forms = {
//           card: document.querySelector("#form-card"),
//           transfer: document.querySelector("#form-transfer"),
//           wallet: document.querySelector("#form-wallet"),
//         };
//         const tabs = {
//           card: tabCard,
//           transfer: tabTransfer,
//           wallet: tabWallet,
//         };

//         // ========= Card Inputs =========
//         let cardNumber = document.querySelector("#card-number");
//         let expiry = document.querySelector("#expiry");
//         let cvv = document.querySelector("#cvv");
//         let errCard = document.querySelector("#err-card");
//         let errExp = document.querySelector("#err-exp");
//         let errCvv = document.querySelector("#err-cvv");

//         const mockNum = document.querySelector("#mock-number");
//         const mockExp = document.querySelector("#mock-exp");
//         const mockCvv = document.querySelector("#mock-cvv");

//         // loader.classList.remove("hidden");
//         // everything.classList.add("hidden");
//         // whole_form.classList.add("items-center");
//         // whole_form.classList.add("justify-center");

//         function luhnValid(num) {
//           let sum = 0,
//             dbl = false;
//           for (let i = num.length - 1; i >= 0; i--) {
//             let d = parseInt(num[i], 10);
//             if (dbl) {
//               d *= 2;
//               if (d > 9) d -= 9;
//             }
//             sum += d;
//             dbl = !dbl;
//           }
//           return sum % 10 === 0;
//         }

//         cardNumber.addEventListener("input", () => {
//           let val = cardNumber.value.replace(/\D/g, "").slice(0, 16);
//           const grouped = val.match(/.{1,4}/g)?.join("-") || val;
//           cardNumber.value = grouped;
//           mockNum.textContent = grouped.padEnd(19, "•");
//           errCard.classList.add("hidden");
//           cardNumber.classList.remove("border-red-500");
//         });

//         expiry.addEventListener("input", () => {
//           let val = expiry.value.replace(/\D/g, "");
//           if (val.length === 2 && !expiry.value.includes("/")) {
//             // Add slash immediately after 2 digits entered
//             val = val + "/";
//           } else if (val.length > 2) {
//             val = val.slice(0, 2) + "/" + val.slice(2, 4);
//           }

//           expiry.value = val;
//           mockExp.textContent = val || "MM/YY";
//           errExp.classList.add("hidden");
//           expiry.classList.remove("border-red-500");
//         });

//         cvv.addEventListener("input", () => {
//           cvv.value = cvv.value.replace(/\D/g, "").slice(0, 3);
//           mockCvv.textContent = cvv.value.replace(/./g, "*") || "***";
//           errCvv.classList.add("hidden");
//           cvv.classList.remove("border-red-500");
//         });

//         function isExpired(mmYY) {
//           const [mmS, yyS] = (mmYY || "").split("/");
//           const mm = parseInt(mmS, 10),
//             yy = parseInt(yyS, 10);
//           if (!mm || !yy || mm < 1 || mm > 12) return true;
//           const now = new Date();
//           const curM = now.getMonth() + 1;
//           const curY = now.getFullYear() % 100;
//           return yy < curY || (yy === curY && mm < curM);
//         }

//         // ========= Payment Helper =========
//         async function makePayment(payload, btn, btnText = "Pay Now") {
//           const spinner = document.getElementById("btn-spinner");
//           const text = btn.querySelector(".btn-text") || btn;
//           btn.disabled = true;
//           if (spinner) spinner.classList.remove("hidden");
//           if (text) text.textContent = "Processing…";

//           try {
//             const res = await fetch(
//               `https://payment-gateway-3.onrender.com/api/v1/make_payment`,
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//               }
//             );
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.detail || "Request failed");
//             alert(data.message || "Payment processed successfully!");
//           } catch (e) {
//             alert("Error: " + e.message);
//           } finally {
//             btn.disabled = false;
//             if (spinner) spinner.classList.add("hidden");
//             if (text) text.textContent = btnText;
//           }
//         }

//         // ========= Card Submit =========

//         document
//           .getElementById("pay-now")
//           .addEventListener("click", async () => {
//             const raw = cardNumber.value.replace(/-/g, "");
//             let valid = true;

//             // if (raw.length !== 16 || !luhnValid(raw)) {
//             //   errCard.classList.remove("hidden");
//             //   cardNumber.classList.add("border-red-500");
//             //   valid = false;
//             // }
//             if (isExpired(expiry.value)) {
//               errExp.classList.remove("hidden");
//               expiry.classList.add("border-red-500");
//               valid = false;
//             }
//             if (cvv.value.length !== 3) {
//               errCvv.classList.remove("hidden");
//               cvv.classList.add("border-red-500");
//               valid = false;
//             }
//             if (!valid) return;

//             const btn = document.getElementById("pay-now");
//             const spinner = document.getElementById("btn-spinner");
//             const text = btn.querySelector(".btn-text") || btn;
//             btn.disabled = true;
//             spinner.classList.remove("hidden");
//             text.textContent = "Processing…";

//             try {
//               const payload = {
//                 amount: Number(document.getElementById("amount").value),
//                 // currency: "NGN",
//                 pan_number: raw,
//                 expiry_date: expiry.value,
//                 cvv: cvv.value,
//                 payment_id: localStorage.getItem("payment_id"),
//               };

//               const res = await fetch(
//                 "https://blink-pay-bank-app-backend.onrender.com/api/v1/account/pay-with-card",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                   },
//                   body: JSON.stringify(payload),
//                 }
//               );

//               const data = await res.json();
//               console.log("data", data);
//             } catch (err) {
//               console.error(err);
//               // alert("Payment error: " + err.message);
//             } finally {
//               btn.disabled = false;
//               spinner.classList.add("hidden");
//               text.textContent = "Pay NGN";
//             }
//           });

//         // ========= Transfer Submit with Validation =========
//         document
//           .querySelector("#tab-transfer")
//           .addEventListener("click", async () => {
//             console.log("clicked");
//             loader.classList.remove("hidden");
//             everything.classList.add("hidden");
//             whole_form.classList.add("items-center");
//             whole_form.classList.add("justify-center");

//             const virtualAccountData = JSON.parse(
//               localStorage.getItem("v_account")
//             );

//             try {
//               let data = "";
//               let amount = Number(
//                 JSON.parse(localStorage.getItem("amount_to_send"))
//               );
//               console.log(amount);
            //   if (!virtualAccountData) {
            //     const payload = {
            //       amount,
            //       payment_id: localStorage.getItem("payment_id"),
            //     };
            //     console.log("amount", payload);

            //     const res = await fetch(
            //       "https://blink-pay-bank-app-backend.onrender.com/api/v1/account/create-virtual-account",
            //       {
            //         method: "POST",
            //         headers: {
            //           "Content-Type": "application/json",
            //           Authorization: `Bearer ${localStorage.getItem("token")}`,
            //         },
            //         body: JSON.stringify(payload),
            //       }
            //     );
//                 console.log("Payload:", payload);

//                 const generated = await res.json();
//                 console.log({ generated });
//                 console.log(amountValue);
//                 let v_account = JSON.stringify(generated);
//                 localStorage.setItem("v_account", v_account);
//                 data = generated;
            //   }

//               if (!data) {
//                 showGeneratedPaymentDetails(virtualAccountData);
//                 setActive(
//                   "transfer",
//                   virtualAccountData.virtual_account?.amount
//                 );
//               } else {
//                 showGeneratedPaymentDetails(data);
//                 setActive("transfer", generated_virtual_account_amount);
//               }

//               function showGeneratedPaymentDetails(dataToBeUsed) {
//                 let start_time = localStorage.getItem("start_time");

//                 if (dataToBeUsed?.virtual_account?.acc_number) {
//                   let { createdAt, expiresAt } = dataToBeUsed?.virtual_account;
//                   let minute = getMinutesBetweenTimestamps(
//                     createdAt,
//                     expiresAt
//                   );
//                   localStorage.setItem("start_time", true);
//                   countDownTimer(minute);

//                   if (start_time === "false") {
//                     localStorage.removeItem("minute");
//                     localStorage.removeItem("seconds");
//                   }

//                   console.log("from show generated paymenr value", amountValue);
//                   amountTransfered.textContent = `${dataToBeUsed.virtual_account.amount}`;
//                   loader.classList.add("hidden");
//                   everything.classList.remove("hidden");
//                   whole_form.classList.remove("items-center");
//                   whole_form.classList.remove("justify-center");

//                   let {
//                     acc_number,
//                     bank_name,
//                     name,
//                     amount: generatedAmount,
//                   } = dataToBeUsed.virtual_account;

//                   let bankName = document.querySelector("#bank-name");
//                   let accName = document.querySelector("#account-name");

//                   accNumber.textContent = acc_number;
//                   bankName.textContent = bank_name;
//                   accName.textContent = name;
//                   amountValue.textContent = generatedAmount;
//                   generated_virtual_account_amount = generatedAmount;
//                   console.log({ generated_virtual_account_amount });

//                   console.log("Response:", dataToBeUsed);
//                 } else {
//                   loader.classList.add("hidden");
//                   everything.classList.add("hidden");
//                   whole_form.classList.remove("items-center");
//                   whole_form.classList.remove("justify-center");
//                   whole_form.textContent =
//                     "Cannot generated account at this time";
//                 }
//               }
//             } catch (err) {
//               loader.classList.add("hidden");
//               everything.classList.add("hidden");
//               whole_form.classList.remove("items-center");
//               whole_form.classList.remove("justify-center");
//               console.error(err);
//               whole_form.textContent = "Try again later";
//             }
//           });

//         // ========= Wallet Submit with Validation =========
//         document.getElementById("wallet-btn").addEventListener("click", () => {
//           const walletId = document.getElementById("wallet-id");
//           let valid = true;

//           walletId.classList.remove("border-red-500");
//           if (!walletId.value.trim()) {
//             walletId.classList.add("border-red-500");
//             valid = false;
//           }

//           if (!valid) return;

//           makePayment(
//             {
//               method: "wallet",
//               amount: parseFloat(document.querySelector("amount").value),
//               currency: "NGN",
//               wallet_id: walletId.value,
//             },
//             document.getElementById("wallet-btn"),
//             "Pay from Wallet"
//           );
//         });
//         function setActive(which, amount, email) {
//           Object.values(tabs).forEach((btn) => {
//             btn.classList.remove("bg-green-500", "text-white");
//             btn.classList.add("bg-gray-200", "text-gray-700");
//           });
//           tabs[which].classList.remove("bg-gray-200", "text-gray-700");
//           tabs[which].classList.add("bg-green-500", "text-white");

//           Object.values(forms).forEach((f) => f.classList.add("hidden"));
//           forms[which].classList.remove("hidden");

//           // Show card mock only on card tab
//           document
//             .getElementById("card-mock")
//             .classList.toggle("hidden", which !== "card");

//           console.log(
//             "supposed amount here oo",
//             generated_virtual_account_amount
//           );
//           //Show email and amount
//           document.getElementById("email").value =
//             email || userEmail || user?.email || "abc@gmail.com";
//           amountValue.value = amount || userAmount || 90000;
//         }

//         if (JSON.parse(localStorage.getItem("v_account"))?.code === 400) {
//           console.log("djadjhadkjad");
//           localStorage.removeItem("v_account");
//         }

//         tabCard.addEventListener("click", () => setActive("card"));
//         // tabTransfer.addEventListener("click", () => setActive("transfer", v_amount));
//         tabWallet.addEventListener("click", () => setActive("wallet"));
//         setActive("card");
//       });

//       document.getElementById("back-btn").addEventListener("click", () => {
//         window.location.href =
//           "https://payverge.netlify.app/userdashboard.html";
//       });
//     </script> -->
//   </body>
// </html>
