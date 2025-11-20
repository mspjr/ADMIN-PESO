document.addEventListener('DOMContentLoaded', function() {

  if (localStorage.getItem('isLoggedIn')=='FALSE'){
    window.location.href="./index.html";
  }

  function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('show'); 
  }
  window.toggleProfileMenu = toggleProfileMenu;

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

  const openModalBtn      = document.getElementById("openModalBtn");
  const addModal          = document.getElementById("addModal");
  const closeModalBtn     = document.getElementById("closeModalBtn");
  const cancelModalBtn    = document.getElementById("cancelModalBtn");

  openModalBtn.onclick    = () => addModal.style.display = "flex";
  closeModalBtn.onclick   = () => addModal.style.display = "none";
  cancelModalBtn.onclick  = () => addModal.style.display = "none";

  const addEstablishmentForm = document.getElementById("addEstablishmentForm");

  function renumberEstablishments() {
    const tbody = document
      .getElementById("establishmentTable")
      .getElementsByTagName("tbody")[0];
    Array.from(tbody.rows).forEach((tr, i) => {
      tr.children[0].textContent = i + 1;
    });
  }

  addEstablishmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const establishmentName = document.getElementById("establishmentName").value;
    const ownerName         = document.getElementById("ownerName").value;
    const industry          = document.getElementById("industry").value;
    const address           = document.getElementById("address").value;

    const tableBody = document
      .getElementById("establishmentTable")
      .getElementsByTagName('tbody')[0];

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${tableBody.rows.length + 1}</td>
      <td>${establishmentName}</td>
      <td>${ownerName}</td>
      <td>${industry}</td>
      <td>Pending</td>
      <td>${new Date().toLocaleDateString()}</td>
      <td class="action-icons">
        <i class="bi bi-eye-fill icon-view" title="View"></i>
        <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
        <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
      </td>
    `;

    row.dataset.address = address;

    renumberEstablishments();

    addModal.style.display = "none";
    addEstablishmentForm.reset();
  });

  const viewOverlay   = document.getElementById('viewOverlay');
  const viewDetails   = document.getElementById('viewDetails');
  const closeViewBtn  = document.getElementById('closeView');

  const editModal     = document.getElementById('editModal');
  const closeEditBtn  = document.getElementById('closeEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  const deleteOverlay    = document.getElementById('deleteOverlay');
  const deleteBody       = document.getElementById('deleteBody');
  const cancelDeleteBtn  = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  let rowToDelete = null;
  let rowToEdit   = null;

  document.addEventListener('click', (e) => {
    const icon = e.target;

    if (icon.closest('.icon-view')) {
      const row   = icon.closest('tr');
      if (!row || !row.closest('#establishmentTable')) return;

      const name     = row.children[1].textContent;
      const owner    = row.children[2].textContent;
      const industry = row.children[3].textContent;
      const status   = row.children[4].textContent;
      const dateReg  = row.children[5].textContent;

      viewDetails.innerHTML = `
        <p><b>Establishment Name:</b><span>${name}</span></p>
        <p><b>Owner / Contact:</b><span>${owner}</span></p>
        <p><b>Industry:</b><span>${industry}</span></p>
        <p><b>Status:</b><span>${status}</span></p>
        <p><b>Date Registered:</b><span>${dateReg}</span></p>
      `;
      viewOverlay.style.display = 'flex';
      viewOverlay.setAttribute('aria-hidden', 'false');
    }

    if (icon.closest('.icon-edit')) {
      const row = icon.closest('tr');
      if (!row || !row.closest('#establishmentTable')) return;

      rowToEdit = row;

      document.getElementById('editName').value     = row.children[1].textContent;
      document.getElementById('editOwner').value    = row.children[2].textContent;
      document.getElementById('editIndustry').value = row.children[3].textContent;
      document.getElementById('editAddress').value  = row.dataset.address || '';

      editModal.style.display = 'flex';
      editModal.setAttribute('aria-hidden', 'false');
    }

    if (icon.closest('.icon-delete')) {
      const row  = icon.closest('tr');
      if (!row || !row.closest('#establishmentTable')) return;

      rowToDelete = row;
      const name = row.children[1].textContent;

      deleteBody.textContent = `Are you sure you want to delete "${name}"?`;
      deleteOverlay.style.display = 'flex';
      deleteOverlay.setAttribute('aria-hidden', 'false');
    }
  });

  closeViewBtn.onclick = () => {
    viewOverlay.style.display = 'none';
    viewOverlay.setAttribute('aria-hidden', 'true');
  };

  closeEditBtn.onclick = cancelEditBtn.onclick = () => {
    editModal.style.display = 'none';
    editModal.setAttribute('aria-hidden', 'true');
  };

  document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!rowToEdit) return;

    rowToEdit.children[1].textContent = document.getElementById('editName').value;
    rowToEdit.children[2].textContent = document.getElementById('editOwner').value;
    rowToEdit.children[3].textContent = document.getElementById('editIndustry').value;
    rowToEdit.dataset.address         = document.getElementById('editAddress').value;

    editModal.style.display = 'none';
    editModal.setAttribute('aria-hidden', 'true');
  });

  cancelDeleteBtn.onclick = () => {
    deleteOverlay.style.display = 'none';
    deleteOverlay.setAttribute('aria-hidden', 'true');
    rowToDelete = null;
  };

  confirmDeleteBtn.onclick = () => {
    if (rowToDelete) {
      const tbody = rowToDelete.parentElement;
      tbody.removeChild(rowToDelete);
      Array.from(tbody.rows).forEach((tr, i) => tr.children[0].textContent = i + 1);
    }
    renumberEstablishments();

    deleteOverlay.style.display = 'none';
    deleteOverlay.setAttribute('aria-hidden', 'true');
    rowToDelete = null;
  };

  window.addEventListener('click', (e) => {
    if (e.target === viewOverlay) { closeViewBtn.click(); }
    if (e.target === deleteOverlay) { cancelDeleteBtn.click(); }
    if (e.target === addModal) { addModal.style.display = 'none'; }
    if (e.target === editModal) { editModal.style.display = 'none'; }
  });

  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const tbody = document
      .getElementById("establishmentTable")
      .getElementsByTagName('tbody')[0];
    Array.from(tbody.rows).forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  });

  const employerTable = document.getElementById("employersTable");
  const employerTbody = employerTable.tBodies[0];
  const employerSearchInput = document.getElementById("employerSearchInput");

  const openEmpModalBtn   = document.getElementById("openEmpModalBtn");
  const addEmpModal       = document.getElementById("addEmpModal");
  const closeEmpModalBtn  = document.getElementById("closeEmpModalBtn");
  const cancelEmpModalBtn = document.getElementById("cancelEmpModalBtn");
  const addEmployerForm   = document.getElementById("addEmployerForm");

  const empViewOverlay  = document.getElementById('empViewOverlay');
  const empViewDetails  = document.getElementById('empViewDetails');
  const closeEmpViewBtn = document.getElementById('closeEmpView');

  const editEmpModal     = document.getElementById('editEmpModal');
  const closeEmpEditBtn  = document.getElementById('closeEmpEditBtn');
  const cancelEmpEditBtn = document.getElementById('cancelEmpEditBtn');
  const editEmpForm      = document.getElementById('editEmpForm');

  const deleteEmpOverlay    = document.getElementById('deleteEmpOverlay');
  const deleteEmpBody       = document.getElementById('deleteEmpBody');
  const cancelDeleteEmpBtn  = document.getElementById('cancelDeleteEmpBtn');
  const confirmDeleteEmpBtn = document.getElementById('confirmDeleteEmpBtn');

  let empRowToEdit = null;
  let empRowToDelete = null;

  function renumberEmployers() {
    Array.from(employerTbody.rows).forEach((tr, i) => {
      if (tr.children[0]) tr.children[0].textContent = i + 1;
    });
  }

  function statusBadge(text) {
    const t = (text || '').toLowerCase();
    if (t === 'active') return '<span class="badge active">Active</span>';
    if (t === 'pending') return '<span class="badge pending">Pending</span>';
    return '<span class="badge inactive">Inactive</span>';
  }

  openEmpModalBtn.onclick  = () => addEmpModal.style.display = "flex";
  closeEmpModalBtn.onclick = () => addEmpModal.style.display = "none";
  cancelEmpModalBtn.onclick = () => addEmpModal.style.display = "none";

  addEmployerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const first = document.getElementById('empFirstName').value.trim();
    const last  = document.getElementById('empLastName').value.trim();
    const email = document.getElementById('empEmail').value.trim();
    const stat  = document.getElementById('empStatus').value;

    const fullName = [first, last].filter(Boolean).join(' ') || email;
    const date = new Date().toLocaleDateString();

    const tr = employerTbody.insertRow();
    tr.innerHTML = `
      <td>${employerTbody.rows.length}</td>
      <td>${fullName}</td>
      <td>${email}</td>
      <td>${statusBadge(stat)}</td>
      <td>${date}</td>
      <td class="action-icons">
        <i class="bi bi-eye-fill icon-view-emp" title="View"></i>
        <i class="bi bi-pencil-square icon-edit-emp" title="Edit"></i>
        <i class="bi bi-trash3-fill icon-delete-emp" title="Delete"></i>
      </td>
    `;

    tr.dataset.first  = first;
    tr.dataset.last   = last;
    tr.dataset.email  = email;
    tr.dataset.status = stat;
    tr.dataset.date   = date;

    renumberEmployers();
    addEmpModal.style.display = "none";
    addEmployerForm.reset();
  });

  document.addEventListener('click', (e) => {
    const icon = e.target;

    if (icon.closest('.icon-view-emp')) {
      const row = icon.closest('tr');
      if (!row || !row.closest('#employersTable')) return;

      const fullName = row.children[1].textContent;
      const email    = row.children[2].textContent;
      const status   = row.dataset.status || row.children[3].textContent;
      const date     = row.dataset.date || row.children[4].textContent;

      empViewDetails.innerHTML = `
        <p><b>Employer Name:</b><span>${fullName}</span></p>
        <p><b>Email:</b><span>${email}</span></p>
        <p><b>Status:</b><span>${typeof status === 'string' ? status : row.children[3].innerText}</span></p>
        <p><b>Date Registered:</b><span>${date}</span></p>
      `;
      empViewOverlay.style.display = 'flex';
      empViewOverlay.setAttribute('aria-hidden', 'false');
    }

    if (icon.closest('.icon-edit-emp')) {
      const row = icon.closest('tr');
      if (!row || !row.closest('#employersTable')) return;

      empRowToEdit = row;

      document.getElementById('editEmpFirst').value  = row.dataset.first || '';
      document.getElementById('editEmpLast').value   = row.dataset.last || '';
      document.getElementById('editEmpEmail').value  = row.dataset.email || row.children[2].textContent;
      document.getElementById('editEmpStatus').value = (row.dataset.status || 'Active');

      editEmpModal.style.display = 'flex';
      editEmpModal.setAttribute('aria-hidden', 'false');
    }

    if (icon.closest('.icon-delete-emp')) {
      const row = icon.closest('tr');
      if (!row || !row.closest('#employersTable')) return;

      empRowToDelete = row;
      const name = row.children[1].textContent;

      deleteEmpBody.textContent = `Are you sure you want to delete "${name}"?`;
      deleteEmpOverlay.style.display = 'flex';
      deleteEmpOverlay.setAttribute('aria-hidden', 'false');
    }
  });

  closeEmpViewBtn.onclick = () => {
    empViewOverlay.style.display = 'none';
    empViewOverlay.setAttribute('aria-hidden', 'true');
  };

  closeEmpEditBtn.onclick = cancelEmpEditBtn.onclick = () => {
    editEmpModal.style.display = 'none';
    editEmpModal.setAttribute('aria-hidden', 'true');
  };

  cancelDeleteEmpBtn.onclick = () => {
    deleteEmpOverlay.style.display = 'none';
    deleteEmpOverlay.setAttribute('aria-hidden', 'true');
    empRowToDelete = null;
  };

  editEmpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!empRowToEdit) return;

    const first = document.getElementById('editEmpFirst').value.trim();
    const last  = document.getElementById('editEmpLast').value.trim();
    const email = document.getElementById('editEmpEmail').value.trim();
    const stat  = document.getElementById('editEmpStatus').value;

    const fullName = [first, last].filter(Boolean).join(' ') || email;

    empRowToEdit.children[1].textContent = fullName;
    empRowToEdit.children[2].textContent = email;
    empRowToEdit.children[3].innerHTML   = statusBadge(stat);

    empRowToEdit.dataset.first  = first;
    empRowToEdit.dataset.last   = last;
    empRowToEdit.dataset.email  = email;
    empRowToEdit.dataset.status = stat;

    editEmpModal.style.display = 'none';
    editEmpModal.setAttribute('aria-hidden', 'true');
  });

  confirmDeleteEmpBtn.onclick = () => {
    if (empRowToDelete) {
      const tbody = empRowToDelete.parentElement;
      tbody.removeChild(empRowToDelete);
      Array.from(tbody.rows).forEach((tr, i) => tr.children[0].textContent = i + 1);
    }
    deleteEmpOverlay.style.display = 'none';
    deleteEmpOverlay.setAttribute('aria-hidden', 'true');
    empRowToDelete = null;
  };

  window.addEventListener('click', (e) => {
    if (e.target === empViewOverlay)  { closeEmpViewBtn.click(); }
    if (e.target === addEmpModal)     { addEmpModal.style.display = 'none'; }
    if (e.target === editEmpModal)    { editEmpModal.style.display = 'none'; }
    if (e.target === deleteEmpOverlay){ cancelDeleteEmpBtn.click(); }
  });

  function filterEmployerRows(q) {
    const query = (q || "").toLowerCase().trim();
    Array.from(employerTbody.rows).forEach((row) => {
      const name  = row.cells[1]?.textContent?.toLowerCase() || "";
      const email = row.cells[2]?.textContent?.toLowerCase() || "";
      row.style.display = (!query || name.includes(query) || email.includes(query)) ? "" : "none";
    });
  }
  if (employerSearchInput) {
    let t = null;
    employerSearchInput.addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => filterEmployerRows(e.target.value), 120);
    });
  }

});
