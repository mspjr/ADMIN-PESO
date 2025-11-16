import { supabase } from './supabaseClient.js';
   
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");

    function showModal(message) {
      modalMessage.textContent = message;
      modal.style.display = "flex";
    }
    modalClose.addEventListener("click", () => (modal.style.display = "none"));

    
    function toggleVisibility(inputId, iconId) {
      const input = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      icon.addEventListener("click", () => {
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        icon.classList.toggle("fa-eye-slash");
      });
    }
    toggleVisibility("newPassword", "toggleNewPassword");
    toggleVisibility("confirmPassword", "toggleConfirmPassword");

    
    window.addEventListener("DOMContentLoaded", async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        const { data: hashData, error: hashError } = await supabase.auth.exchangeCodeForSession(window.location.hash);
        if (hashError) console.error("Exchange error:", hashError);
      }
    });

    
    document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const submitBtn = document.getElementById("submitBtn");

      if (!newPassword || !confirmPassword)
        return showModal("⚠️ Please fill in all fields!");
      if (newPassword !== confirmPassword)
        return showModal("⚠️ Passwords do not match!");

      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";

      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        showModal("❌ " + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Save";
      } else {
        showModal("✅ Password updated successfully!");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      }
    });
