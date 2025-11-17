if (localStorage.getItem('isLoggedIn')=='FALSE'){
  window.location.href="./index.html";
}
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

    const vacancyBody = document.getElementById("vacancyBody");
    let vacancies = JSON.parse(localStorage.getItem("vacancies")) || [];

    function renderTable() {
      vacancyBody.innerHTML = "";
      vacancies.forEach((v, i) => {
        const row = `
          <tr>
            <td>${i+1}</td>
            <td>${v.jobTitle}</td>
            <td>${v.industry}</td>
            <td>${v.establishment}</td>
            <td>${v.location}</td>
            <td>${v.employmentType}</td>
            <td><span class="badge ${v.status === "Active" ? "active" : "pending"}">${v.status}</span></td>
            <td>${v.datePosted}</td>
            <td class="action-icons">
              <i class="bi bi-eye-fill icon-view" title="View" data-index="${i}"></i>
              <i class="bi bi-pencil-square icon-edit" title="Edit" data-index="${i}"></i>
              <i class="bi bi-trash3-fill icon-delete" title="Delete" data-index="${i}"></i>
            </td>
          </tr>`;
        vacancyBody.insertAdjacentHTML("beforeend", row);
      });
      localStorage.setItem("vacancies", JSON.stringify(vacancies));
    }
    renderTable();

    const jobModal = document.getElementById("jobModal");
    const addBtn = document.getElementById("addBtn");
    const cancelModal = document.getElementById("cancelModal");
    const jobForm = document.getElementById("jobForm");

    addBtn.onclick = () => {
      document.getElementById("modalTitle").textContent = "Add Job Vacancy";
      jobForm.reset();
      document.getElementById("editIndex").value = "";
      jobModal.style.display = "flex";
    };
    cancelModal.onclick = () => jobModal.style.display = "none";

    jobForm.onsubmit = (e) => {
      e.preventDefault();
      const vacancyData = {
        jobTitle: jobForm.jobTitle.value,
        industry: jobForm.industry.value,
        establishment: jobForm.establishment.value,
        location: jobForm.location.value,
        employmentType: jobForm.employmentType.value,
        status: jobForm.status.value,
        datePosted: new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
      };
      const editIndex = document.getElementById("editIndex").value;
      if (editIndex) vacancies[editIndex] = vacancyData;
      else vacancies.push(vacancyData);
      jobModal.style.display = "none";
      renderTable();
    };

    const viewOverlay = document.getElementById("viewOverlay");
    const viewDetails = document.getElementById("viewDetails");
    const closeView = document.getElementById("closeView");
    const deleteOverlay = document.getElementById("deleteOverlay");

    closeView.onclick = () => {
      viewOverlay.style.display = "none";
      viewOverlay.setAttribute("aria-hidden", "true");
    };

    vacancyBody.addEventListener("click", (e) => {
      const index = e.target.dataset.index;

      if (e.target.classList.contains("icon-view")) {
        const v = vacancies[index];
        viewDetails.innerHTML = `
          <p><b>Job Title:</b><span>${v.jobTitle}</span></p>
          <p><b>Industry:</b><span>${v.industry}</span></p>
          <p><b>Establishment:</b><span>${v.establishment}</span></p>
          <p><b>Location:</b><span>${v.location}</span></p>
          <p><b>Employment Type:</b><span>${v.employmentType}</span></p>
          <p><b>Status:</b><span>${v.status}</span></p>
          <p><b>Date Posted:</b><span>${v.datePosted}</span></p>`;
        viewOverlay.style.display = "flex";
        viewOverlay.setAttribute("aria-hidden", "false");
      }

      if (e.target.classList.contains("icon-edit")) {
        const v = vacancies[index];
        document.getElementById("modalTitle").textContent = "Edit Job Vacancy";
        jobForm.jobTitle.value = v.jobTitle;
        jobForm.industry.value = v.industry;
        jobForm.establishment.value = v.establishment;
        jobForm.location.value = v.location;
        jobForm.employmentType.value = v.employmentType;
        jobForm.status.value = v.status;
        document.getElementById("editIndex").value = index;
        jobModal.style.display = "flex";
      }

      if (e.target.classList.contains("icon-delete")) {
        deleteOverlay.style.display = "flex";
        deleteOverlay.setAttribute("aria-hidden", "false");

        document.getElementById("confirmDelete").onclick = () => {
          vacancies.splice(index, 1);
          renderTable();
          deleteOverlay.style.display = "none";
          deleteOverlay.setAttribute("aria-hidden", "true");
        };
      }
    });

    document.getElementById("cancelDelete").onclick = () => {
      deleteOverlay.style.display = "none";
      deleteOverlay.setAttribute("aria-hidden", "true");
    };

    document.getElementById("searchInput").addEventListener("keyup", (e) => {
      const filter = e.target.value.toLowerCase();
      Array.from(vacancyBody.children).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });

    window.onclick = (e) => {
      if (e.target.classList.contains("modal")) e.target.style.display = "none";
      if (e.target === viewOverlay) {
        viewOverlay.style.display = "none";
        viewOverlay.setAttribute("aria-hidden", "true");
      }
      if (e.target === deleteOverlay || e.target.classList.contains("skl-overlay")) {
        deleteOverlay.style.display = "none";
        deleteOverlay.setAttribute("aria-hidden", "true");
      }
    };
