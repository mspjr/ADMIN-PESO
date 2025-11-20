if (localStorage.getItem('isLoggedIn')=='FALSE'){
  window.location.href="./index.html";
}

function toggleProfileMenu() {
  const profileMenu = document.getElementById('profile-menu');
  profileMenu.classList.toggle('show');
}

const tableBody = document.getElementById("barangayTableBody");
let deleteRowIndex = null;

var addModal, editModal, viewOverlay, viewDetails, deleteOverlay; 

function renumberBarangays() {
  const tbody = document.getElementById("barangayTableBody");
  if (!tbody) return;
  Array.from(tbody.rows).forEach((tr, i) => {
    if (tr.children[0]) tr.children[0].innerText = i + 1;
  });
}

document.addEventListener('DOMContentLoaded', () => {
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

  const tableBody = document.getElementById("barangayTableBody"); 

  const addModalEl      = document.getElementById("addModal");
  const editModalEl     = document.getElementById("editModal");
  const viewOverlayEl   = document.getElementById("viewOverlay");
  const viewDetailsEl   = document.getElementById("viewDetails");
  const deleteOverlayEl = document.getElementById("deleteOverlay");

  addModal      = addModalEl;       
  editModal     = editModalEl;       
  viewOverlay   = viewOverlayEl;   
  viewDetails   = viewDetailsEl;  
  deleteOverlay = deleteOverlayEl; 

  document.getElementById("openAddModalBtn").onclick = () => {
    addModal.style.display = "flex";
    addModal.setAttribute("aria-hidden", "false");
  };
  
  document.getElementById("closeView").onclick       = closeViewModal;
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

    renumberBarangays();

    document.getElementById("addBarangayInput").value = "";
    closeAddModal();
  };

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

    renumberBarangays();
    closeDeleteModal();
  };

  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    const q = e.target.value.toLowerCase();
    Array.from(tableBody.rows).forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  });
});

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

window.addEventListener("click", (e) => {
  if (e.target === viewOverlay)  closeViewModal();
  if (e.target === deleteOverlay) closeDeleteModal();
  if (e.target === addModal)     closeAddModal();
  if (e.target === editModal)    closeEditModal();
});
