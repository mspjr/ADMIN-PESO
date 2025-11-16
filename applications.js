    document.addEventListener('DOMContentLoaded', () => {
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

      const tableBody        = document.querySelector('#applicationsTable tbody');
      const appModal         = document.getElementById('appModal');
      const openModalBtn     = document.getElementById('openModalBtn');
      const closeModalBtn    = document.getElementById('closeModalBtn');
      const cancelModalBtn   = document.getElementById('cancelModalBtn');
      const applicationForm  = document.getElementById('applicationForm');
      const appModalTitle    = document.getElementById('appModalTitle');
      const editIndexInput   = document.getElementById('editIndex');

      const applicantNameInp = document.getElementById('applicantName');
      const jobTitleInp      = document.getElementById('jobTitle');
      const establishmentInp = document.getElementById('establishment');
      const statusInp        = document.getElementById('status');
      const dateAppliedInp   = document.getElementById('dateApplied');

      const viewOverlay      = document.getElementById('viewOverlay');
      const viewDetails      = document.getElementById('viewDetails');
      const closeViewBtn     = document.getElementById('closeView');

      const deleteOverlay    = document.getElementById('deleteOverlay');
      const cancelDeleteBtn  = document.getElementById('cancelDeleteBtn');
      const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

      let applications = JSON.parse(localStorage.getItem('applications') || '[]');
      let deleteIndex  = null;

      function saveApplications() {
        localStorage.setItem('applications', JSON.stringify(applications));
      }

      function renderTable() {
        tableBody.innerHTML = '';
        applications.forEach((app, index) => {
          const tr = document.createElement('tr');
          tr.dataset.index = index;
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${app.applicantName}</td>
            <td>${app.jobTitle}</td>
            <td>${app.establishment}</td>
            <td>${app.status}</td>
            <td>${app.dateApplied}</td>
            <td class="action-icons">
              <i class="bi bi-eye-fill icon-view" title="View"></i>
              <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
              <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }

      renderTable();

      function openAddModal() {
        applicationForm.reset();
        editIndexInput.value = '';
        appModalTitle.innerHTML = '<i class="bi bi-file-earmark-plus"></i> Add Application';
        appModal.style.display = 'flex';
      }

      openModalBtn.addEventListener('click', openAddModal);

      function closeAppModal() {
        appModal.style.display = 'none';
      }
      closeModalBtn.addEventListener('click', closeAppModal);
      cancelModalBtn.addEventListener('click', closeAppModal);

      applicationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const appData = {
          applicantName: applicantNameInp.value.trim(),
          jobTitle:      jobTitleInp.value.trim(),
          establishment: establishmentInp.value.trim(),
          status:        statusInp.value,
          dateApplied:   dateAppliedInp.value
        };

        const editIndex = editIndexInput.value;

        if (editIndex !== '') {
          applications[parseInt(editIndex, 10)] = appData;
        } else {
          applications.push(appData);
        }

        saveApplications();
        renderTable();
        closeAppModal();
        applicationForm.reset();
        editIndexInput.value = '';
      });

      tableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;
        const index = parseInt(row.dataset.index, 10);
        const app   = applications[index];

        if (e.target.classList.contains('icon-view')) {
          viewDetails.innerHTML = `
            <p><b>Applicant Name:</b><span>${app.applicantName}</span></p>
            <p><b>Job Title:</b><span>${app.jobTitle}</span></p>
            <p><b>Establishment:</b><span>${app.establishment}</span></p>
            <p><b>Status:</b><span>${app.status}</span></p>
            <p><b>Date Applied:</b><span>${app.dateApplied}</span></p>
          `;
          viewOverlay.style.display = 'flex';
          viewOverlay.setAttribute('aria-hidden', 'false');
        }

        if (e.target.classList.contains('icon-edit')) {
          applicantNameInp.value = app.applicantName;
          jobTitleInp.value      = app.jobTitle;
          establishmentInp.value = app.establishment;
          statusInp.value        = app.status;
          dateAppliedInp.value   = app.dateApplied;

          editIndexInput.value   = index.toString();
          appModalTitle.innerHTML = '<i class="bi bi-pencil-square"></i> Edit Application';
          appModal.style.display  = 'flex';
        }

        if (e.target.classList.contains('icon-delete')) {
          deleteIndex = index;
          deleteOverlay.style.display = 'flex';
          deleteOverlay.setAttribute('aria-hidden', 'false');
        }
      });

      closeViewBtn.addEventListener('click', () => {
        viewOverlay.style.display = 'none';
        viewOverlay.setAttribute('aria-hidden', 'true');
      });

      cancelDeleteBtn.addEventListener('click', () => {
        deleteOverlay.style.display = 'none';
        deleteOverlay.setAttribute('aria-hidden', 'true');
        deleteIndex = null;
      });

      confirmDeleteBtn.addEventListener('click', () => {
        if (deleteIndex !== null) {
          applications.splice(deleteIndex, 1);
          saveApplications();
          renderTable();
        }
        deleteOverlay.style.display = 'none';
        deleteOverlay.setAttribute('aria-hidden', 'true');
        deleteIndex = null;
      });

      document.getElementById("searchInput").addEventListener("keyup", (e) => {
        const q = e.target.value.toLowerCase();
        [...tableBody.rows].forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
        });
      });

      window.addEventListener('click', (e) => {
        if (e.target === viewOverlay) {
          viewOverlay.style.display = 'none';
          viewOverlay.setAttribute('aria-hidden', 'true');
        }
        if (e.target === deleteOverlay) {
          deleteOverlay.style.display = 'none';
          deleteOverlay.setAttribute('aria-hidden', 'true');
          deleteIndex = null;
        }
        if (e.target === appModal) {
          closeAppModal();
        }
      });
    });
