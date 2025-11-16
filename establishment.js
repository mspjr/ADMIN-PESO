    function toggleProfileMenu() {
      const profileMenu = document.getElementById('profile-menu');
      profileMenu.classList.toggle('show'); 
    }

    const openModalBtn      = document.getElementById("openModalBtn");
    const addModal          = document.getElementById("addModal");
    const closeModalBtn     = document.getElementById("closeModalBtn");
    const cancelModalBtn    = document.getElementById("cancelModalBtn");

    openModalBtn.onclick    = () => addModal.style.display = "flex";
    closeModalBtn.onclick   = () => addModal.style.display = "none";
    cancelModalBtn.onclick  = () => addModal.style.display = "none";

    const addEstablishmentForm = document.getElementById("addEstablishmentForm");

    addEstablishmentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const establishmentName = document.getElementById("establishmentName").value;
      const ownerName         = document.getElementById("ownerName").value;
      const email             = document.getElementById("email").value;
      const contactNumber     = document.getElementById("contactNumber").value;
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
        <td>${email}</td>
        <td>${industry}</td>
        <td>Pending</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td class="action-icons">
          <i class="bi bi-eye-fill icon-view" title="View"></i>
          <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
          <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
        </td>
      `;

      row.dataset.contact = contactNumber;
      row.dataset.address = address;

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
        const name  = row.children[1].textContent;
        const owner = row.children[2].textContent;
        const email = row.children[3].textContent;
        const industry = row.children[4].textContent;
        const status   = row.children[5].textContent;
        const dateReg  = row.children[6].textContent;

        viewDetails.innerHTML = `
          <p><b>Establishment Name:</b><span>${name}</span></p>
          <p><b>Owner / Contact:</b><span>${owner}</span></p>
          <p><b>Email:</b><span>${email}</span></p>
          <p><b>Industry:</b><span>${industry}</span></p>
          <p><b>Status:</b><span>${status}</span></p>
          <p><b>Date Registered:</b><span>${dateReg}</span></p>
        `;
        viewOverlay.style.display = 'flex';
        viewOverlay.setAttribute('aria-hidden', 'false');
      }

      if (icon.closest('.icon-edit')) {
        const row = icon.closest('tr');
        rowToEdit = row;

        document.getElementById('editName').value     = row.children[1].textContent;
        document.getElementById('editOwner').value    = row.children[2].textContent;
        document.getElementById('editEmail').value    = row.children[3].textContent;
        document.getElementById('editIndustry').value = row.children[4].textContent;

        document.getElementById('editContact').value = row.dataset.contact || '';
        document.getElementById('editAddress').value = row.dataset.address || '';

        editModal.style.display = 'flex';
        editModal.setAttribute('aria-hidden', 'false');
      }

      if (icon.closest('.icon-delete')) {
        const row  = icon.closest('tr');
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
      rowToEdit.children[3].textContent = document.getElementById('editEmail').value;
      rowToEdit.children[4].textContent = document.getElementById('editIndustry').value;

      rowToEdit.dataset.contact = document.getElementById('editContact').value;
      rowToEdit.dataset.address = document.getElementById('editAddress').value;

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
      deleteOverlay.style.display = 'none';
      deleteOverlay.setAttribute('aria-hidden', 'true');
      rowToDelete = null;
    };

    window.addEventListener('click', (e) => {
      if (e.target === viewOverlay) {
        closeViewBtn.click();
      }
      if (e.target === deleteOverlay) {
        cancelDeleteBtn.click();
      }
      if (e.target === addModal) {
        addModal.style.display = 'none';
      }
      if (e.target === editModal) {
        editModal.style.display = 'none';
      }
    });
