   function toggleProfileMenu() {
      const profileMenu = document.getElementById('profile-menu');
      profileMenu.classList.toggle('show');
    }

    (function openDefault(){
      const master = document.querySelector('.nav-item > .toggle-menu');
      const submenu = master && master.nextElementSibling;
      if (submenu && !submenu.classList.contains('show')) submenu.classList.add('show');
    })();

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

    const skillsTableBody = document.getElementById("skillsTableBody");

    const addModal      = document.getElementById("addModal");
    const editModal     = document.getElementById("editModal");
    const viewOverlay   = document.getElementById("viewOverlay");
    const viewDetails   = document.getElementById("viewDetails");
    const deleteOverlay = document.getElementById("deleteOverlay");
    const deleteLabel   = document.getElementById("deleteLabel");

    const addSkillName  = document.getElementById("addSkillName");
    const addRelatedJob = document.getElementById("addRelatedJob");
    const editSkillName = document.getElementById("editSkillName");
    const editRelatedJob= document.getElementById("editRelatedJob");

    let editIndex   = null;
    let deleteIndex = null;

    function show(el) {
      el.style.display = "flex";
      el.setAttribute("aria-hidden", "false");
    }
    function hide(el) {
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    }

    document.getElementById("openAddModalBtn").onclick = () => {
      editIndex = null;
      addSkillName.value  = "";
      addRelatedJob.value = "";
      show(addModal);
      addSkillName.focus();
    };

    document.getElementById("cancelAddBtn").onclick = () => hide(addModal);

    document.getElementById("cancelEditBtn").onclick = () => {
      hide(editModal);
      editIndex = null;
    };

    document.getElementById("saveSkillBtn").onclick = () => {
      const name = addSkillName.value.trim();
      const job  = addRelatedJob.value.trim();
      if (!name || !job) return;

      const index = skillsTableBody.rows.length + 1;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index}</td>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(job)}</td>
        <td class="action-icons">
          <i class="bi bi-eye-fill icon-view" title="View"></i>
          <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
          <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
        </td>
      `;
      skillsTableBody.appendChild(tr);

      addSkillName.value = "";
      addRelatedJob.value = "";
      hide(addModal);
    };

    document.addEventListener("click", (e) => {
      const iconView   = e.target.closest(".icon-view");
      const iconEdit   = e.target.closest(".icon-edit");
      const iconDelete = e.target.closest(".icon-delete");

      if (iconView) {
        const row = iconView.closest("tr");
        const skill = row.children[1].innerText;
        const job   = row.children[2].innerText;

        viewDetails.innerHTML = `
          <p><b>Skill Name:</b><span>${skill}</span></p>
          <p><b>Related Job:</b><span>${job}</span></p>
        `;

        show(viewOverlay);
        return;
      }

      if (iconEdit) {
        const row = iconEdit.closest("tr");
        editIndex = row.rowIndex - 1; // tbody index

        editSkillName.value  = row.children[1].innerText;
        editRelatedJob.value = row.children[2].innerText;

        show(editModal);
        return;
      }

      if (iconDelete) {
        const row = iconDelete.closest("tr");
        deleteIndex = row.rowIndex - 1;

        const skill = row.children[1].innerText;
        const job   = row.children[2].innerText;
        deleteLabel.textContent = `Are you sure you want to delete "${skill} — ${job}"?`;

        show(deleteOverlay);
        return;
      }
    });

    document.getElementById("updateSkillBtn").onclick = () => {
      if (editIndex === null) return;

      const name = editSkillName.value.trim();
      const job  = editRelatedJob.value.trim();
      if (!name || !job) return;

      const row = skillsTableBody.rows[editIndex];
      row.children[1].innerText = name;
      row.children[2].innerText = job;

      hide(editModal);
      editIndex = null;
    };

    document.getElementById("cancelDeleteBtn").onclick = () => {
      hide(deleteOverlay);
      deleteIndex = null;
    };

    document.getElementById("confirmDeleteBtn").onclick = () => {
      if (deleteIndex !== null) {
        skillsTableBody.deleteRow(deleteIndex);
        Array.from(skillsTableBody.rows).forEach((r, i) => r.children[0].innerText = i + 1);
      }
      hide(deleteOverlay);
      deleteIndex = null;
    };

    document.getElementById("closeView").onclick = () => hide(viewOverlay);

    window.addEventListener("click", (e) => {
      if (e.target === addModal)      hide(addModal);
      if (e.target === editModal)     hide(editModal);
      if (e.target === viewOverlay)   hide(viewOverlay);
      if (e.target === deleteOverlay) hide(deleteOverlay);
    });

    document.getElementById("searchInput").addEventListener("input", () => {
      const q = document.getElementById("searchInput").value.toLowerCase();
      Array.from(skillsTableBody.rows).forEach(row => {
        const skill = row.children[1].innerText.toLowerCase();
        const job   = row.children[2].innerText.toLowerCase();
        row.style.display = (skill.includes(q) || job.includes(q)) ? "" : "none";
      });
    });

    function escapeHtml(str="") {
      return str
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }
