if (localStorage.getItem("isLoggedIn") == "FALSE") {
  window.location.href = "./index.html";
}

function toggleProfileMenu() {
  const profileMenu = document.getElementById("profile-menu");
  profileMenu.classList.toggle("show");
}

const tableBody = document.getElementById("barangayTableBody");
let deleteRowIndex = null;

var addModal, editModal, viewOverlay, viewDetails, deleteOverlay;

//ON WINDOW LOAD, GET BARANGAY LIST FROM DB
window.onload = renumberBarangays();

async function renumberBarangays() {
  const getBrgyResult = await getBarangayList();
  if (getBrgyResult.success === false) {
    alert(getBrgyResult.message); //browser alert message
  } else {
    //added td for barangay_id but only hidden
    const tbody = document.getElementById("barangayTableBody");
    tbody.innerHTML = "";
    for (i = 0; i < getBrgyResult.data.length; i++) {
      tbody.insertAdjacentHTML(
        "beforeend",
        `
          <tr>
              <td>${i + 1}</td>
              <td>${getBrgyResult.data[i].name}</td>
              <td class="action-icons">
                <i class="bi bi-eye-fill icon-view" title="View"></i>
                <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
                <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
              </td>
              <td style='display:none;'>${getBrgyResult.data[i].barangay_id
        }</td> 
            </tr>
            `
      );
    }
  }

  // const tbody = document.getElementById("barangayTableBody");
  // if (!tbody) return;
  // Array.from(tbody.rows).forEach((tr, i) => {
  //   if (tr.children[0]) tr.children[0].innerText = i + 1;
  // });
}

document.addEventListener("DOMContentLoaded", () => {
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

  const tableBody = document.getElementById("barangayTableBody");

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

  const saveBarangayBtn = document.getElementById("saveBarangayBtn");

  saveBarangayBtn.onclick = async () => {
    const name = document.getElementById("addBarangayInput").value;
    if (name.trim() === "") {
      return;
    } else {
      const addBrgyResult = await addBarangay(name);
      if (addBrgyResult.success === false) {
        alert(addBrgyResult.message); //browser alert message
      } else {
        alert(addBrgyResult.message); //browser alert message
        renumberBarangays();
        document.getElementById("addBarangayInput").value = "";
        closeAddModal();
      }
    }

    // const rowCount = tableBody.rows.length + 1;
    // tableBody.insertAdjacentHTML("beforeend", `
    //   <tr>
    //     <td>${rowCount}</td>
    //     <td>${name}</td>
    //     <td class="action-icons">
    //       <i class="bi bi-eye-fill icon-view" title="View"></i>
    //       <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
    //       <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
    //     </td>
    //   </tr>
    // `);
  };

  document.getElementById("updateBarangayBtn").onclick = async () => {
    // const row = tableBody.rows[editModal.dataset.row - 1];
    // row.children[1].innerText = document.getElementById("editBarangayInput").value;
    // closeEditModal();

    const newBarangayName = document.getElementById("editBarangayInput").value;
    const selectedBarangayId = document.getElementById("editBarangayId").value;

    const editBrgyResult = await editBarangay(
      selectedBarangayId,
      newBarangayName
    );
    if (editBrgyResult.success === false) {
      alert(editBrgyResult.message); //browser alert message
    } else {
      alert(editBrgyResult.message); //browser alert message
      document.getElementById("editBarangayInput").value = "";
      renumberBarangays();
      closeEditModal();
    }
  };

  document.getElementById("confirmDeleteBtn").onclick = async () => {
    // if (deleteRowIndex !== null) {
    //   tableBody.deleteRow(deleteRowIndex - 1);
    //   Array.from(tableBody.rows).forEach((tr, i) => tr.children[0].innerText = i + 1);
    // }

    // renumberBarangays();
    // closeDeleteModal();

    const selectedBarangayId =
      document.getElementById("deleteBarangayId").value;
    const deleteBrgyResult = await deleteBarangay(selectedBarangayId);
    if (deleteBrgyResult.success === false) {
      alert(deleteBrgyResult.message); //browser alert message
    } else {
      alert(deleteBrgyResult.message); //browser alert message
      document.getElementById("deleteBarangayId").value = "";
      renumberBarangays();
      closeDeleteModal();
    }
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

    viewDetails.innerHTML = `
      <p><b>Barangay Name:</b><span>${name}</span></p>
    `;
    viewOverlay.style.display = "flex";
    viewOverlay.setAttribute("aria-hidden", "false");
  }

  if (e.target.classList.contains("icon-edit")) {
    const row = e.target.closest("tr");
    editModal.dataset.row = row.rowIndex;
    document.getElementById("editBarangayInput").value =
      row.children[1].innerText;
    document.getElementById("editBarangayId").value = row.children[3].innerText; // also get barangay_id as reference for db update
    editModal.style.display = "flex";
    editModal.setAttribute("aria-hidden", "false");
  }

  if (e.target.classList.contains("icon-delete")) {
    const row = e.target.closest("tr");
    deleteRowIndex = row.rowIndex;
    document.getElementById("deleteBarangayId").value =
      row.children[3].innerText; // also get barangay_id as reference for db delete
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

//GET LIST OF BRGY FUNCTION
async function getBarangayList() {
  const { data, error } = await supabase
    .from("Barangay")
    .select("*")
    .order("barangay_id", { ascending: true });

  if (error) {
    return {
      message: error.message,
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

//ADD BRGY FUNCTION
async function addBarangay(barangayName) {
  const { data, error } = await supabase
    .from("Barangay")
    .insert([{ name: barangayName, createdAt: new Date().toLocaleString() }]);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: "Barangay Added!",
      success: true,
    };
  }
}

//EDIT BRGY FUNCTION
async function editBarangay(barangayId, barangayName) {
  const { error } = await supabase
    .from("Barangay")
    .update({ name: barangayName, modifiedAt: new Date().toLocaleString() })
    .eq("barangay_id", barangayId) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Barangay Updated!`,
      success: true,
    };
  }
}

//DELETE BRGY FUNCTION
async function deleteBarangay(barangayId) {
  const { data, error } = await supabase
    .from("Barangay")
    .delete()
    .eq("barangay_id", barangayId)
    .select() // optional: returns deleted row
    .throwOnError();

  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Barangay Deleted!`,
      success: true,
    };
  }
}
