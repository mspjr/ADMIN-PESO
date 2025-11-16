const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    togglePassword.addEventListener("click", () => {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      togglePassword.classList.toggle("fa-eye-slash");
    });

    
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");

    function showModal(message) {
      modalMessage.textContent = message;
      modal.style.display = "flex";
    }

    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });

  
    document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const passwordValue = document.getElementById("password").value.trim();

      if (!username || !passwordValue) {
        showModal("⚠️ Please fill in all fields!");
        return;
      }

      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", username)
        .eq("password", passwordValue)
        .single();

      if (error || !data) {
        showModal("❌ Invalid username or password!");
      } else {
        showModal("✅ Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      }
    });
