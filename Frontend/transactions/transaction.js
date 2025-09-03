// transactions.js

// async function fetchTransactions() {
//   try {
//     const token = localStorage.getItem("authToken");
//     console.log("token", token)

//     const res = await fetch("http://127.0.0.1:8000/api/v1/transaction/all", {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`, 
//             "Content-Type": "application/json",
//         },
//     });
//     // const response = await res.json();
//     console.log("res", res)

//     renderTransactionsTable(data);
//     renderTransactionsChart(data);
//   } catch (error) {
//     console.error("Error fetching transactions:", error);

//   }
// }
// // Render table
// function renderTransactionsTable(transactions) {
//   const tableBody = document.getElementById("transactionsTable");
//   tableBody.innerHTML = "";

//   transactions.forEach((txn) => {
//     const row = `
//       <tr>
//         <td class="border p-2">${txn.transaction_id}</td>
//         <td class="border p-2">${txn.type || "-"}</td>
//         <td class="border p-2 text-green-600 font-semibold">NGN ${
//           txn.amount || 0
//         }</td>
//         <td class="border p-2">${
//           txn.date || new Date(txn.created_at).toLocaleDateString()
//         }</td>
//         <td class="border p-2">${txn.status || "pending"}</td>
//       </tr>
//     `;
//     tableBody.insertAdjacentHTML("beforeend", row);
//   });
// }

// // Render chart
// function renderTransactionsChart(transactions) {
//   const ctx = document.getElementById("transactionsChart").getContext("2d");

//   const labels = transactions.map(
//     (txn) => txn.date || new Date(txn.created_at).toLocaleDateString()
//   );
//   const amounts = transactions.map((txn) => txn.amount || 0);

//   new Chart(ctx, {
//     type: "line",
//     data: {
//       labels,
//       datasets: [
//         {
//           label: "Transaction Amounts",
//           data: amounts,
//           borderColor: "blue",
//           fill: false,
//         },
//       ],
//     },
//   });
// }

// // Run fetch
// fetchTransactions();
// let transactionBtn = document.querySelector("#transaction");
// transactionBtn.document.addEventListener("click", ()=>{
//   console.log("clicked")
// })

// async function fetchTransactions() {
//   try {
//     const token = localStorage.getItem("authToken");
//     console.log("token", token);

//     const res = await fetch("http://127.0.0.1:8000/api/v1/transactions", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }

//     const data = await res.json(); 
//     console.log("transactions:", data);

//     renderTransactionsTable(data.transactions);
//     renderTransactionsChart(data.transactions);
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//   }
// }



let currentPage = 1;
const pageSize = 10;

async function loadTransactions() {
  const search = document.getElementById("searchBox").value;
  const status = document.getElementById("statusFilter").value;

  const res = await fetch(`http://127.0.0.1:8000/api/v1/transactions/history?page=${currentPage}&page_size=${pageSize}&status=${status}&search=${search}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  const table = document.getElementById("transactionTable");
  table.innerHTML = "";

  data.transactions.forEach(tx => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${tx.transaction_id}</td>
      <td class="p-2">₦${tx.amount}</td>
      <td class="p-2">
        <span class="px-2 py-1 rounded text-white ${tx.status === "success" ? "bg-green-500" : tx.status === "pending" ? "bg-yellow-500" : "bg-red-500"}">
          ${tx.status}
        </span>
      </td>
      <td class="p-2">${tx.created_at}</td>
    `;
    table.appendChild(row);
  });
}

// Event listeners
document.getElementById("searchBox").addEventListener("input", () => { currentPage = 1; loadTransactions(); });
document.getElementById("statusFilter").addEventListener("change", () => { currentPage = 1; loadTransactions(); });
document.getElementById("prevPage").addEventListener("click", () => { if (currentPage > 1) { currentPage--; loadTransactions(); } });
document.getElementById("nextPage").addEventListener("click", () => { currentPage++; loadTransactions(); });

loadTransactions();

