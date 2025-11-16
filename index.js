    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    togglePassword.addEventListener("click", () => {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      togglePassword.classList.toggle("fa-eye-slash");
    });

    
    const SUPABASE_URL = "https://zvqsqntqoyksranhodfh.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cXNxbnRxb3lrc3JhbmhvZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjQ3NzMsImV4cCI6MjA3Mzc0MDc3M30.8A7kdHZmMFFNZMBLEhaAegkQOu4fVJ2-RwlMVN7dYSU";

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    
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
