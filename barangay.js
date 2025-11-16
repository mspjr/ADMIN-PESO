import { supabase } from './supabaseClient.js';
    function toggleProfileMenu() {
      const profileMenu = document.getElementById('profile-menu');
      profileMenu.classList.toggle('show');
    }

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

    const addModal      = document.getElementById("addModal");
    const editModal     = document.getElementById("editModal");
    const viewOverlay   = document.getElementById("viewOverlay");
    const viewDetails   = document.getElementById("viewDetails");
    const deleteOverlay = document.getElementById("deleteOverlay");

    const tableBody = document.getElementById("barangayTableBody");
    let deleteRowIndex = null;

    document.getElementById("openAddModalBtn").onclick = () => {
      addModal.style.display = "flex";
      addModal.setAttribute("aria-hidden", "false");
    };

    function closeAddModal() {
      addModal.style.display = "none";
      addModal.setAttribute("aria-hidden", "true");
    }

    function closeEditModal() {
      editModal.style.display = "none";
      editModal.setAttribute("aria-hidden", "true");
    }

    function closeViewModal() {
      viewOverlay.style.display = "none";
      viewOverlay.setAttribute("aria-hidden", "true");
    }

    function closeDeleteModal() {
      deleteOverlay.style.display = "none";
      deleteOverlay.setAttribute("aria-hidden", "true");
      deleteRowIndex = null;
    }

    document.getElementById("closeView").onclick      = closeViewModal;
    document.getElementById("cancelDeleteBtn").onclick = closeDeleteModal;

    const saveBarangayBtn = document.getElementById("saveBarangayBtn");

    saveBarangayBtn.onclick = () => {
      const name = document.getElementById("addBarangayInput").value;
      if (name.trim() === "") return;

      const rowCount = tableBody.rows.length + 1;
      tableBody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${rowCount}</td>
          <td>${name}</td>
          <td class="action-icons">
            <i class="bi bi-eye-fill icon-view" title="View"></i>
            <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
            <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
          </td>
        </tr>
      `);
      document.getElementById("addBarangayInput").value = "";
      closeAddModal();
    };

    document.addEventListener("click", e => {
      if (e.target.classList.contains("icon-view")) {
        const row = e.target.closest("tr");
        const name = row.children[1].innerText;

        viewDetails.innerHTML = `
          <p><b>Barangay Name:</b><span>${name}</span></p>
        `;
        viewOverlay.style.display = "flex";
        viewOverlay.setAttribute("aria-hidden", "false");
      }

      if (e.target.classList.contains("icon-edit")) {
        const row = e.target.closest("tr");
        editModal.dataset.row = row.rowIndex;
        document.getElementById("editBarangayInput").value = row.children[1].innerText;
        editModal.style.display = "flex";
        editModal.setAttribute("aria-hidden", "false");
      }

      if (e.target.classList.contains("icon-delete")) {
        const row = e.target.closest("tr");
        deleteRowIndex = row.rowIndex;
        deleteOverlay.style.display = "flex";
        deleteOverlay.setAttribute("aria-hidden", "false");
      }
    });

    document.getElementById("updateBarangayBtn").onclick = () => {
      const row = tableBody.rows[editModal.dataset.row - 1];
      row.children[1].innerText = document.getElementById("editBarangayInput").value;
      closeEditModal();
    };

    document.getElementById("confirmDeleteBtn").onclick = () => {
      if (deleteRowIndex !== null) {
        tableBody.deleteRow(deleteRowIndex - 1);
        Array.from(tableBody.rows).forEach((tr, i) => tr.children[0].innerText = i + 1);
      }
      closeDeleteModal();
    };

    window.addEventListener("click", (e) => {
      if (e.target === viewOverlay)  closeViewModal();
      if (e.target === deleteOverlay) closeDeleteModal();
      if (e.target === addModal)     closeAddModal();
      if (e.target === editModal)    closeEditModal();
    });

    document.getElementById("searchInput").addEventListener("keyup", (e) => {
      const q = e.target.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });
