if (localStorage.getItem("isLoggedIn") == "FALSE") {
  window.location.href = "./index.html";
}

function toggleProfileMenu() {
  const profileMenu = document.getElementById("profile-menu");
  profileMenu.classList.toggle("show");
}

const tableBody = document.getElementById("employeeTableBody");
let deleteRowIndex = null;

var addModal, editModal, viewOverlay, viewDetails, deleteOverlay;

function renumberEmployees() {
  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return;
  Array.from(tbody.rows).forEach((tr, i) => {
    if (tr.children[0]) tr.children[0].innerText = i + 1;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const submenu = btn.nextElementSibling;
      const hasSubmenu = submenu && submenu.classList.contains("submenu");

      if (hasSubmenu) {
        e.preventDefault();
        document.querySelectorAll(".submenu").forEach((list) => {
          if (list !== submenu) list.classList.remove("show");
        });
        submenu.classList.toggle("show");
      }
    });
  });

  const tableBody = document.getElementById("employeeTableBody");

  const addModalEl = document.getElementById("addModal");
  const editModalEl = document.getElementById("editModal");
  const viewOverlayEl = document.getElementById("viewOverlay");
  const viewDetailsEl = document.getElementById("viewDetails");
  const deleteOverlayEl = document.getElementById("deleteOverlay");

  addModal = addModalEl;
  editModal = editModalEl;
  viewOverlay = viewOverlayEl;
  viewDetails = viewDetailsEl;
  deleteOverlay = deleteOverlayEl;

  document.getElementById("openAddModalBtn").onclick = () => {
    addModal.style.display = "flex";
    addModal.setAttribute("aria-hidden", "false");
  };

  document.getElementById("closeView").onclick = closeViewModal;
  document.getElementById("cancelDeleteBtn").onclick = closeDeleteModal;

  const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");

  saveEmployeeBtn.onclick = () => {
    const name = document.getElementById("addEmployeeName").value.trim();
    const pos = document.getElementById("addEmployeePosition").value.trim();
    const dept = document.getElementById("addEmployeeDept").value.trim();

    if (!name) return;

    const rowCount = tableBody.rows.length + 1;
    tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${rowCount}</td>
        <td>${name}</td>
        <td>${pos}</td>
        <td>${dept}</td>
        <td class="action-icons">
          <i class="bi bi-eye-fill icon-view" title="View"></i>
          <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
          <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
        </td>
      </tr>
    `
    );

    renumberEmployees();

    document.getElementById("addEmployeeName").value = "";
    document.getElementById("addEmployeePosition").value = "";
    document.getElementById("addEmployeeDept").value = "";
    closeAddModal();
  };

  document.getElementById("updateEmployeeBtn").onclick = () => {
    const row = tableBody.rows[editModal.dataset.row - 1];
    row.children[1].innerText =
      document.getElementById("editEmployeeName").value;
    row.children[2].innerText = document.getElementById(
      "editEmployeePosition"
    ).value;
    row.children[3].innerText =
      document.getElementById("editEmployeeDept").value;
    closeEditModal();
  };

  document.getElementById("confirmDeleteBtn").onclick = () => {
    if (deleteRowIndex !== null) {
      tableBody.deleteRow(deleteRowIndex - 1);
      Array.from(tableBody.rows).forEach(
        (tr, i) => (tr.children[0].innerText = i + 1)
      );
    }

    renumberEmployees();
    closeDeleteModal();
  };

  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    const q = e.target.value.toLowerCase();
    Array.from(tableBody.rows).forEach((row) => {
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

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("icon-view")) {
    const row = e.target.closest("tr");
    const name = row.children[1].innerText;
    const pos = row.children[2].innerText;
    const dept = row.children[3].innerText;

    viewDetails.innerHTML = `
      <p><b>Employee Name:</b><span>${name}</span></p>
      <p><b>Position:</b><span>${pos}</span></p>
      <p><b>Department:</b><span>${dept}</span></p>
    `;
    viewOverlay.style.display = "flex";
    viewOverlay.setAttribute("aria-hidden", "false");
  }

  if (e.target.classList.contains("icon-edit")) {
    const row = e.target.closest("tr");
    editModal.dataset.row = row.rowIndex;
    document.getElementById("editEmployeeName").value =
      row.children[1].innerText;
    document.getElementById("editEmployeePosition").value =
      row.children[2].innerText;
    document.getElementById("editEmployeeDept").value =
      row.children[3].innerText;
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
  if (e.target === viewOverlay) closeViewModal();
  if (e.target === deleteOverlay) closeDeleteModal();
  if (e.target === addModal) closeAddModal();
  if (e.target === editModal) closeEditModal();
});

//GET LIST OF EMPLOYEE/WORKER FUNCTION
async function getEmployeeList() {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("role", "Worker")
    .order("user_id", { ascending: true });

  if (error) {
    return {
      message: error,
      success: false,
      data: {},
    };
  } else {
    return {
      message: "got it",
      success: true,
      data: data,
    };
  }
}

// ADD EMPLOYEE/WORKER FUNCTION
async function addEmployee(first, last, email, stat) {
  const { data, error } = await supabase.from("Users").insert([
    {
      email: email,
      password: "1234", // default password
      role: "Worker",
      firstName: first,
      lastName: last,
      status: stat,
      created_at: new Date().toLocaleString(),
    },
  ]);

  if (error) {
    return {
      message: error,
      success: false,
    };
  } else {
    return {
      message: "Employee Added!",
      success: true,
    };
  }
}

//EDIT EMPLOYEE/WORKER FUNCTION
async function editEmployee(userId, first, last, email, stat) {
  const { error } = await supabase
    .from("Users")
    .update({
      email: email,
      firstName: first,
      lastName: last,
      status: stat,
    })
    .eq("user_id", userId) // your condition
    .select();

  if (error) {
    return {
      message: error,
      success: false,
    };
  } else {
    return {
      message: `Employer Updated!`,
      success: true,
    };
  }
}

// DELETE EMPLOYEE/WORKER FUNCTION
async function deleteEmployer(userId) {
  const { data, error } = await supabase
    .from("Users")
    .delete()
    .eq("user_id", userId)
    .select() // optional: returns deleted row
    .throwOnError();

  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Employer Deleted!`,
      success: true,
    };
  }
}
