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
