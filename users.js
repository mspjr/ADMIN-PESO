    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    profileIcon.addEventListener('click', () => {
      profileDropdown.classList.toggle('show');
    });

    window.addEventListener('click', (e) => {
      if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });

    document.querySelectorAll('.toggle-menu').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const submenu = btn.nextElementSibling;
        document.querySelectorAll('.submenu').forEach(list => {
          if (list !== submenu) list.classList.remove('show');
        });
        submenu.classList.toggle('show');
      });
    });

    const usersTableBody   = document.getElementById("usersTableBody");
    const userModal        = document.getElementById("userModal");
    const viewOverlay      = document.getElementById("viewOverlay");
    const viewDetails      = document.getElementById("viewDetails");
    const deleteOverlay    = document.getElementById("deleteOverlay");
    const deleteUserText   = document.getElementById("deleteUserText");

    const openAddUserBtn   = document.getElementById("openAddUserBtn");
    const closeUserModal   = document.getElementById("closeUserModal");
    const closeViewBtn     = document.getElementById("closeView");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn  = document.getElementById("cancelDeleteBtn");
    const modalTitle       = document.getElementById("modalTitle");
    const searchInput      = document.getElementById("searchInput");

    const lastnameInput  = document.getElementById("lastname");
    const firstnameInput = document.getElementById("firstname");
    const miInput        = document.getElementById("mi");
    const emailInput     = document.getElementById("email");
    const roleInput      = document.getElementById("role");
    const statusInput    = document.getElementById("status");

    let editingRow  = null;   
    let rowToDelete = null;  

    function showLayer(el){
      el.style.display = "flex";
      el.setAttribute("aria-hidden","false");
    }
    function hideLayer(el){
      el.style.display = "none";
      el.setAttribute("aria-hidden","true");
    }

    openAddUserBtn.onclick = () => {
      editingRow = null;
      modalTitle.textContent = "Add New User";
      lastnameInput.value  = "";
      firstnameInput.value = "";
      miInput.value        = "";
      emailInput.value     = "";
      roleInput.value      = "Worker";
      statusInput.value    = "Active";
      showLayer(userModal);
    };

    closeUserModal.onclick = () => hideLayer(userModal);
    closeViewBtn.onclick   = () => hideLayer(viewOverlay);
    cancelDeleteBtn.onclick = () => {
      hideLayer(deleteOverlay);
      rowToDelete = null;
    };

    window.addEventListener("click", (e) => {
      if (e.target === userModal)   hideLayer(userModal);
      if (e.target === viewOverlay) hideLayer(viewOverlay);
      if (e.target === deleteOverlay) {
        hideLayer(deleteOverlay);
        rowToDelete = null;
      }
    });

    document.getElementById("userForm").onsubmit = function(e) {
      e.preventDefault();

      const lastname  = lastnameInput.value.trim();
      const firstname = firstnameInput.value.trim();
      const mi        = miInput.value.trim();
      const email     = emailInput.value.trim();
      const role      = roleInput.value;
      const status    = statusInput.value;

      if (!lastname || !firstname || !email || !role || !status) {
        alert("Please fill in Lastname, Firstname, Email, Role, and Status.");
        return;
      }

      if (!editingRow) {
        const rowIndex = usersTableBody.rows.length + 1;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${rowIndex}</td>
          <td>${lastname}</td>
          <td>${firstname}</td>
          <td>${mi}</td>
          <td>${email}</td>
          <td>${role}</td>
          <td><span class="badge ${status.toLowerCase()}">${status}</span></td>
          <td class="action-icons text-center">
            <i class="bi bi-eye-fill icon-view" title="View"></i>
            <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
            <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
          </td>
        `;
        usersTableBody.appendChild(tr);
      } else {
        editingRow.children[1].textContent = lastname;
        editingRow.children[2].textContent = firstname;
        editingRow.children[3].textContent = mi;
        editingRow.children[4].textContent = email;
        editingRow.children[5].textContent = role;
        editingRow.children[6].innerHTML   = `<span class="badge ${status.toLowerCase()}">${status}</span>`;
      }

      hideLayer(userModal);
      editingRow = null;
    };

    document.addEventListener("click", (e) => {
      const iconView   = e.target.closest(".icon-view");
      const iconEdit   = e.target.closest(".icon-edit");
      const iconDelete = e.target.closest(".icon-delete");

      if (!iconView && !iconEdit && !iconDelete) return;

      const row = e.target.closest("tr");
      if (!row) return;

      if (iconView) {
        const lastname  = row.children[1].textContent;
        const firstname = row.children[2].textContent;
        const mi        = row.children[3].textContent || "—";
        const email     = row.children[4].textContent;
        const role      = row.children[5].textContent;
        const status    = row.children[6].innerText;

        viewDetails.innerHTML = `
          <p><b>Lastname:</b><span>${lastname}</span></p>
          <p><b>Firstname:</b><span>${firstname}</span></p>
          <p><b>Middle Initial:</b><span>${mi || "—"}</span></p>
          <p><b>Email:</b><span>${email}</span></p>
          <p><b>Role:</b><span>${role}</span></p>
          <p><b>Status:</b><span>${status}</span></p>
        `;
        showLayer(viewOverlay);
        return;
      }

      if (iconEdit) {
        editingRow = row;
        modalTitle.textContent = "Edit User";
        lastnameInput.value  = row.children[1].textContent;
        firstnameInput.value = row.children[2].textContent;
        miInput.value        = row.children[3].textContent;
        emailInput.value     = row.children[4].textContent;
        roleInput.value      = row.children[5].textContent;
        statusInput.value    = row.children[6].innerText.trim();
        showLayer(userModal);
        return;
      }

      if (iconDelete) {
        rowToDelete = row;
        const lname = row.children[1].textContent;
        const fname = row.children[2].textContent;
        deleteUserText.textContent = `Are you sure you want to delete "${lname}, ${fname}"?`;
        showLayer(deleteOverlay);
        return;
      }
    });

    confirmDeleteBtn.onclick = () => {
      if (rowToDelete) {
        const tbody = rowToDelete.parentElement;
        tbody.removeChild(rowToDelete);
        Array.from(tbody.rows).forEach((tr, i) => {
          tr.children[0].textContent = i + 1;
        });
      }
      hideLayer(deleteOverlay);
      rowToDelete = null;
    };

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      Array.from(usersTableBody.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });
