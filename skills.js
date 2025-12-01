document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("isLoggedIn") == "FALSE") {
    window.location.href = "./index.html";
  }
  function toggleProfileMenu() {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("show");
  }

  (function openDefault() {
    const master = document.querySelector(".nav-item > .toggle-menu");
    const submenu = master && master.nextElementSibling;
    if (submenu && !submenu.classList.contains("show"))
      submenu.classList.add("show");
  })();

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

  const skillsTableBody = document.getElementById("skillsTableBody");

  const addModal = document.getElementById("addModal");
  const editModal = document.getElementById("editModal");
  const viewOverlay = document.getElementById("viewOverlay");
  const viewDetails = document.getElementById("viewDetails");
  const deleteOverlay = document.getElementById("deleteOverlay");
  const deleteLabel = document.getElementById("deleteLabel");

  const addSkillName = document.getElementById("addSkillName");
  const addRelatedJob = document.getElementById("addRelatedJob");
  const editSkillName = document.getElementById("editSkillName");
  const editRelatedJob = document.getElementById("editRelatedJob");
  const editSkillsId = document.getElementById("editSkillsId");
  const deleteSkillsId = document.getElementById("deleteSkillsId");

  let editIndex = null;
  let deleteIndex = null;

  async function renumberSkills() {
    // if (!skillsTableBody) return;
    // Array.from(skillsTableBody.rows).forEach((r, i) => {
    //   if (r.children[0]) r.children[0].innerText = i + 1;
    // });

    const result = await getSkillsList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      //added td for industry_id but only hidden
      skillsTableBody.innerHTML = "";
      for (i = 0; i < result.data.length; i++) {
        skillsTableBody.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
          <td>${i + 1}</td>
          <td>${result.data[i].name}</td>
          <td>${result.data[i].related_job}</td>
          <td class="action-icons">
            <i class="bi bi-eye-fill icon-view" title="View"></i>
            <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
            <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
          </td>
          <td style='display:none;'>${result.data[i].skills_id}</td>
        </tr>
        `
        );
      }
    }
  }

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
    addSkillName.value = "";
    addRelatedJob.value = "";
    show(addModal);
    addSkillName.focus();
  };

  document.getElementById("cancelAddBtn").onclick = () => hide(addModal);

  document.getElementById("cancelEditBtn").onclick = () => {
    hide(editModal);
    editIndex = null;
  };

  document.getElementById("saveSkillBtn").onclick = async () => {
    const name = addSkillName.value.trim();
    const job = addRelatedJob.value.trim();
    if (!name || !job) return;

    const result = await addSkill(name, job);
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      alert(result.message); //browser alert message
      renumberSkills();
      addSkillName.value = "";
      addRelatedJob.value = "";
      hide(addModal);
    }

    //   const index = skillsTableBody.rows.length + 1;
    //   const tr = document.createElement("tr");
    //   tr.innerHTML = `
    //   <td>${index}</td>
    //   <td>${escapeHtml(name)}</td>
    //   <td>${escapeHtml(job)}</td>
    //   <td class="action-icons">
    //     <i class="bi bi-eye-fill icon-view" title="View"></i>
    //     <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
    //     <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
    //   </td>
    // `;
    //   skillsTableBody.appendChild(tr);
  };

  document.addEventListener("click", (e) => {
    const iconView = e.target.closest(".icon-view");
    const iconEdit = e.target.closest(".icon-edit");
    const iconDelete = e.target.closest(".icon-delete");

    if (iconView) {
      const row = iconView.closest("tr");
      const skill = row.children[1].innerText;
      const job = row.children[2].innerText;

      viewDetails.innerHTML = `
      <p><b>Skill Name:</b><span>${skill}</span></p>
      <p><b>Related Job:</b><span>${job}</span></p>
    `;

      show(viewOverlay);
      return;
    }

    if (iconEdit) {
      const row = iconEdit.closest("tr");
      editIndex = row.rowIndex - 1;

      editSkillName.value = row.children[1].innerText;
      editRelatedJob.value = row.children[2].innerText;
      editSkillsId.value = row.children[4].innerText;

      show(editModal);
      return;
    }

    if (iconDelete) {
      const row = iconDelete.closest("tr");
      deleteIndex = row.rowIndex - 1;

      const skill = row.children[1].innerText;
      const job = row.children[2].innerText;
      deleteSkillsId.value = row.children[4].innerText;
      deleteLabel.textContent = `Are you sure you want to delete "${skill} — ${job}"?`;

      show(deleteOverlay);
      return;
    }
  });

  document.getElementById("updateSkillBtn").onclick = async () => {
    if (editIndex === null) return;

    const name = editSkillName.value.trim();
    const job = editRelatedJob.value.trim();
    const skillsId = editSkillsId.value.trim();

    if (!name || !job) return;

    const result = await editSkill(skillsId, name, job);
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      alert(result.message); //browser alert message
      renumberSkills(); //reloads the table data
      hide(editModal);
      editIndex = null;
    }

    // const row = skillsTableBody.rows[editIndex];
    // row.children[1].innerText = name;
    // row.children[2].innerText = job;
  };

  document.getElementById("cancelDeleteBtn").onclick = () => {
    hide(deleteOverlay);
    deleteIndex = null;
  };

  document.getElementById("confirmDeleteBtn").onclick = async () => {
    // if (deleteIndex !== null) {
    //   skillsTableBody.deleteRow(deleteIndex);
    //   Array.from(skillsTableBody.rows).forEach(
    //     (r, i) => (r.children[0].innerText = i + 1)
    //   );
    // }
    const skillsId = deleteSkillsId.value.trim();
    if (skillsId !== null) {
      const result = await deleteSkill(skillsId);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renumberSkills(); //reloads the table data
        hide(deleteOverlay);
        deleteIndex = null;
      }
    }
  };

  document.getElementById("closeView").onclick = () => hide(viewOverlay);

  window.addEventListener("click", (e) => {
    if (e.target === addModal) hide(addModal);
    if (e.target === editModal) hide(editModal);
    if (e.target === viewOverlay) hide(viewOverlay);
    if (e.target === deleteOverlay) hide(deleteOverlay);
  });

  document.getElementById("searchInput").addEventListener("input", () => {
    const q = document.getElementById("searchInput").value.toLowerCase();
    Array.from(skillsTableBody.rows).forEach((row) => {
      const skill = row.children[1].innerText.toLowerCase();
      const job = row.children[2].innerText.toLowerCase();
      row.style.display = skill.includes(q) || job.includes(q) ? "" : "none";
    });
  });

  function escapeHtml(str = "") {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  renumberSkills();
});

//GET LIST OF SKILLS FUNCTION
async function getSkillsList() {
  const { data, error } = await supabase
    .from("Skills")
    .select("*")
    .order("skills_id", { ascending: true });

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

// ADD SKILL FUNCTION
async function addSkill(name, related_job) {
  const { data, error } = await supabase.from("Skills").insert([
    {
      name: name,
      related_job: related_job,
    },
  ]);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: "Skill Added!",
      success: true,
    };
  }
}

//EDIT SKILL FUNCTION
async function editSkill(skills_id, name, related_job) {
  const { error } = await supabase
    .from("Skills")
    .update({
      name: name,
      related_job: related_job,
    })
    .eq("skills_id", skills_id) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Skill Updated!`,
      success: true,
    };
  }
}

// DELETE SKILL FUNCTION
async function deleteSkill(skills_id) {
  const { data, error } = await supabase
    .from("Skills")
    .delete()
    .eq("skills_id", skills_id)
    .select() // optional: returns deleted row
    .throwOnError();

  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Skill Deleted!`,
      success: true,
    };
  }
}
