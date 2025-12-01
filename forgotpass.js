    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");

    function showModal(message) {
      modalMessage.textContent = message;
      modal.style.display = "flex";
    }
    modalClose.addEventListener("click", () => (modal.style.display = "none"));

   
    document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      if (!email) return showModal("⚠️ Please enter your email!");

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "http://localhost:3000/resetpassword.html", // ✅ exact redirect
        });

        if (error) {
          console.error("Error:", error);
          showModal("❌ " + error.message);
        } else {
          showModal("✅ Reset link sent! Please check your inbox or spam folder.");
          document.getElementById("forgotPasswordForm").reset();
        }
      } catch (err) {
        console.error(err);
        showModal("⚠️ Something went wrong. Please try again.");
      }
    });