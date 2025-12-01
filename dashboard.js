if (localStorage.getItem("isLoggedIn") == "FALSE") {
  window.location.href = "./index.html";
}

function toggleProfileMenu() {
  const profileMenu = document.getElementById("profile-menu");
  profileMenu.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll(".toggle-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = btn.nextElementSibling;

      document.querySelectorAll(".submenu").forEach((list) => {
        if (list !== submenu) list.classList.remove("show");
      });

      submenu.classList.toggle("show");
    });
  });
});
