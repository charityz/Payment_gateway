const BASE_URL = "https://payment-gateway-3.onrender.com";
let user = JSON.parse(localStorage.getItem("user"));
let makePaymentButton = document.querySelector("#makePaymentBtn");

let loginTime = JSON.parse(localStorage.getItem("dateTimeData"));
let generatePayLink = `${BASE_URL}/api/v1/generate_payment`;

async function generatePaymentIdLink(link) {
  // console.log(link)
  const { email: owner_email } = JSON.parse(localStorage.getItem("user"));
  console.log(owner_email);
  let amount = 1200;
  const email = "testUser@gmail.com";
  const access_token = localStorage.getItem("authToken");
  console.log(access_token);

  const payload = {
    email,
    amount,
    owner_email,
  };

  try {
    const generate = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(payload),
    });
    const response = await generate.json();
    console.log(response);
    //  (response?.message)
    Swal.fire({
      title: response?.message,
    }).then(() => {
      window.open(response?.payment_link, "_blank");
    });
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

makePaymentButton.addEventListener("click", () => {
  generatePaymentIdLink(generatePayLink);
});
function saveDateTime() {
  if (loginTime) {
    console.log({ loginTime });
    return null;
  } else {
    console.log(false);
    let now = new Date();
    let date = now.toLocaleDateString();
    let time = now.toLocaleTimeString();
    let timestamp = now.getTime();

    let expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "dateTimeData",
      JSON.stringify({ time, date, expiry, timestamp })
    );

    document.cookie = `time=${time}; path=/; max-age=${7 * 24 * 60 * 60}`;
  }
}

function getDateTime() {
  let data = loginTime;
  if (!data) return null;

  let now = new Date().getTime();
  let past = data.timestamp;
  let diffMs = now - past;

  let seconds = Math.floor(diffMs / 1000);
  let minute = Math.floor(seconds / 60);
  let hour = Math.floor(minute / 60);
  let day = Math.floor(hour / 24);

  let last_login_time;
  if (seconds < 60) {
    last_login_time = "few seconds ago";
  } else if (minute < 60) {
    last_login_time = `${minute} minute${minute === 1 ? "" : "s"} ago `;
  } else if (hour < 24) {
    last_login_time = `${hour} hour${hour === 1 ? "" : "s"} ago `;
  } else {
    last_login_time = `${day} day${day === 1 ? "" : "s"} ago`;
  }

  return { acutal_time: data.time, actual_date: data.date, last_login_time };
}

function convertToTime(theTimeYouWantToConvert) {
  return Number(theTimeYouWantToConvert.split(" ")[0].split(":").join("")); //"101005"
}
function getTimeDifference(time1, time2) {
  let loginTimeDifference = time1 - time2;
  // console.log(loginTimeDifference)

  if (loginTimeDifference > 0 && loginTimeDifference < 99) {
    return "few seconds ago";
  }
  if (loginTimeDifference > 99 && loginTimeDifference < 9999) {
    let minute = getLastLoggedInTime(loginTimeDifference);
    return minute;
  }
  if (loginTimeDifference > 9999 && loginTimeDifference < 999999) {
    let hour = getLastLoggedInTime(loginTimeDifference, "hour");
    return hour;
  }
}

function extractFirstDigitFromTime(timeDifference, limit) {
  return timeDifference
    .toString()
    .split("")
    .slice(0, limit)
    .toString()
    .split(",")
    .join("");
}

function getLastLoggedInTime(time, unit) {
  let unitOfTime;
  if (unit !== "hour") {
    unitOfTime = extractBasedOnLengthOfTime(time, 3);
    return unitOfTime === "1"
      ? unitOfTime + " Minute ago..."
      : unitOfTime + " Minutes ago...";
  } else {
    unitOfTime = extractBasedOnLengthOfTime(time, 5);
    return unitOfTime === "1"
      ? unitOfTime + " Hour ago..."
      : unitOfTime + " Hours ago...";
  }
  // console.log(unitOfTime);
}

function extractBasedOnLengthOfTime(time, length) {
  let extractedTime;
  if (time.toString().length === length) {
    extractedTime = extractFirstDigitFromTime(time, 1);
  } else {
    extractedTime = extractFirstDigitFromTime(time, 2);
  }

  return extractedTime;
}
async function redirectToDashboard() {
  saveDateTime();

  const { actual_date, acutal_time, last_login_time } = getDateTime() || {};

  if (actual_date && acutal_time) {
    document.querySelector("#recentLogins").textContent =
      `Date: ${actual_date} | Time: ${acutal_time} | Last Login: ${last_login_time}`;
  }

  document.querySelector("#userDetail").textContent = user?.name || "Guest";

  await fetchActivityData("transaction", currentPage, rowsPerPage);
  await loadNotificationCount();
}

document.addEventListener("DOMContentLoaded", () => {
  redirectToDashboard();
});

// saveDateTime();

// const { actual_date, acutal_time, last_login_time } = getDateTime();

// document.querySelector("#recentLogins").textContent = `Date: ${actual_date}.... 
//       Time: ${acutal_time}.... LastLogin: ${last_login_time} `;
// document.querySelector("#userDetail").textContent = user?.name || "Guest";
// document.querySelector("#notifications").textContent = "2 unread messages";

let activityData = [];
let filteredData = [];
localStorage.setItem("current_page", 1);

let currentPage = localStorage.getItem("current_page") || 1;
let rowsPerPage = 3;
document.querySelector("#prevPage").style.display = "none";

async function fetchActivityData(
  type = "transaction",
  page = currentPage,
  limit = rowsPerPage
) {
  let url = "";
  // if (type === "all")
  url = `${BASE_URL}/api/v1/activities?page=${page}&limit=${limit}`;
  if (type === "transaction")
    url = `${BASE_URL}/api/v1/all_transactions?page=${page}&limit=${limit}`;

  try {
    let response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    let data = await response.json();
    console.log(data);

    const { prev_page, next_page } = data;
    localStorage.setItem("total", data.total);

    let items = data.activities || data.transactions || [];

    if (type === "transaction") {
      activityData = items.map((tx) => ({
        date: tx.date,
        action: `${tx.transaction_type.toUpperCase()} - ₦${tx.amount}`,
        status: tx.status,
      }));
      console.log(activityData);
    } else {
      activityData = items.map((act) => ({
        date: act.date,
        action: act.name || act.action,
        status: act.status || "Success",
      }));
    }

    filteredData = activityData;
    // console.log(data);

    renderTable();
    checkPageButtons();

    //update page info from backend response
    if (data.total) {
      document.querySelector("#pageInfo").textContent =
        "Page " + currentPage + " of " + Math.ceil(data.total / data.limit);
    }
  } catch (err) {
    console.error("Error fetching activities:", err);
  }
}


// Apply filters (search only, dropdown triggers fetch)
function applyFilters() {
  const searchQuery = document
    .querySelector("#searchInput")
    .value.toLowerCase();

  filteredData = activityData.filter(
    (row) =>
      row.action.toLowerCase().includes(searchQuery) ||
      row.status.toLowerCase().includes(searchQuery)
  );

  currentPage = 1;
  renderTable();
  // checkPageButtons();
}

// Dropdown change triggers fetch
document.querySelector(".activityFilter").addEventListener("change", (e) => {
  fetchActivityData(e.target.value, currentPage, rowsPerPage);
  // console.log("sope: purr")
});
console.log(document.querySelector(".activityFilter"));

// Search filter
document.querySelector("#searchInput").addEventListener("input", applyFilters);
console.log(document.querySelector("#activityTable"));
// Render table with pagination
function renderTable() {
  let tableBody = document.querySelector("#activityTable");
  tableBody.innerHTML = "";
  let pageData = filteredData.slice(0, rowsPerPage);

  if (pageData.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="3" class="text-center p-4 text-gray-500">No results found</td></tr>';
  } else {
    pageData.forEach((row) => {
      const statusColor =
        row.status === "successful"
          ? "bg-green-100 text-green-700"
          : row.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700";
      tableBody.innerHTML += `
              <tr>
                <td class="border p-2">${row.date}</td>
                <td class="border p-2">${row.action}</td>
                <td class="border p-2">
                  <span class="px-2 py-1 rounded ${statusColor}">${row.status}</span>
                </td>
              </tr>
            `;
    });
  }

  document.querySelector("#pageInfo").textContent =
    "Page " +
    currentPage +
    " of " +
    Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
}

currentPage = JSON.parse(localStorage.getItem("current_page")) || 1;
document.querySelector("#prevPage").onclick = async () => {
  if (currentPage > 1) {
    currentPage--;
    await fetchActivityData(
      document.querySelector("#activityFilter").value,
      currentPage,
      rowsPerPage
    );
  }
  console.log("prev");
  console.log({ currentPage });
};

document.querySelector("#logoutBtn").addEventListener("click", () => {
  (window.location.href = "https://payverge.netlify.app"), localStorage.clear();
  console.log("click");
});

function checkPageButtons() {
  let total_pages = Math.ceil(
    Number(localStorage.getItem("total")) / rowsPerPage
  );
  // console.log({ total_pages });
  if (currentPage >= total_pages) {
    document.querySelector("#nextPage").style.display = "none";
    currentPage = total_pages;
  } else {
    document.querySelector("#nextPage").style.display = "block";
  }
  if (currentPage <= 1) {
    console.log("prev false");
    document.querySelector("#prevPage").style.display = "none";
  } else {
    console.log("prev true");
    document.querySelector("#prevPage").style.display = "block";
  }
}

console.log(document.querySelector("#prevPage"));

document.querySelector("#nextPage").onclick = () => {
  currentPage++;
  fetchActivityData(
    document.querySelector("#activityFilter").value,
    currentPage,
    rowsPerPage
  );
  console.log("next");
  console.log({ currentPage });
};

new Chart(document.querySelector("#activityFilter"), {
  type: "line",
  data: {
    labels: ["Aug 03", "Aug 05", "Aug 07", "Aug 09", "Aug 11"],
    datasets: [
      {
        label: "Transactions",
        data: [5, 9, 4, 7, 10],
        borderColor: "blue",
        fill: false,
      },
    ],
  },
});

// NOTIFICATIONS
async function loadNotificationCount() {
  try {
    let token = localStorage.getItem("authToken");
    console.log("token", token);

    if (!token) {
      document.querySelector("#notifications").textContent =
        "No user logged in";
      return;
    }

    // Fetch all notifications
    let response = await fetch(`${BASE_URL}/api/v1/notifications`, {
      method: "GET",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch notifications");

    let notes = await response.json();
    console.log("response", notes);

    // Count unread locally
    const unread = notes.filter((n) => !n.read).length;

    document.querySelector("#notifications").textContent =
      unread > 0 ? `${unread} unread messages` : "No new alerts";
  } catch (err) {
    console.error("Error fetching notification count:", err);
    document.querySelector("#notifications").textContent =
      "Error loading notifications";
  }
}

loadNotificationCount();
setInterval(loadNotificationCount, 30000);
