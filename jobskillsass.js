if (localStorage.getItem("isLoggedIn") == "FALSE") {
  window.location.href = "./index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  function byId(id) {
    return document.getElementById(id);
  }

  function toggleProfileMenu() {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("show");
  }
  window.toggleProfileMenu = toggleProfileMenu;

  const submenuMasterData = byId("submenuMasterData");
  const submenuDataAssignment = byId("submenuDataAssignment");

  if (submenuMasterData) submenuMasterData.classList.remove("show");
  if (submenuDataAssignment) submenuDataAssignment.classList.add("show");

  document.querySelectorAll(".toggle-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const mySub = btn.nextElementSibling;
      document.querySelectorAll(".submenu").forEach((list) => {
        list.classList.remove("show");
      });
      if (mySub) mySub.classList.add("show");
    });
  });

  const linkJobSkillsAss = byId("linkJobSkillsAss");
  if (linkJobSkillsAss) {
    linkJobSkillsAss.addEventListener("click", () => {
      if (submenuMasterData) submenuMasterData.classList.remove("show");
      if (submenuDataAssignment) submenuDataAssignment.classList.add("show");
    });
  }

  const STORE_KEYS = {
    jobs: "skillocal_js_jobs",
    skills: "skillocal_js_skills",
    assigns: "skillocal_js_assigns",
    idCounters: "skillocal_js_idcounters",
  };

  const defaultData = {
    jobs: [],
    skills: [],
    assigns: [],
    idCounters: { job: 0, skill: 0, assign: 0 },
  };

  function loadStore() {
    const jobsRaw = JSON.parse(localStorage.getItem(STORE_KEYS.jobs));
    const skillsRaw = JSON.parse(localStorage.getItem(STORE_KEYS.skills));
    const assignsRaw = JSON.parse(localStorage.getItem(STORE_KEYS.assigns));
    const ctrRaw = JSON.parse(localStorage.getItem(STORE_KEYS.idCounters));

    let jobs = jobsRaw || defaultData.jobs;
    let skills = skillsRaw || defaultData.skills;
    let assigns = assignsRaw || defaultData.assigns;
    let idCounters = ctrRaw || defaultData.idCounters;

    jobs = jobs.filter((j) => j && j.id != null);
    skills = skills.filter((s) => s && s.id != null);
    assigns = assigns.filter((a) => a && a.id != null);

    return { jobs, skills, assigns, idCounters };
  }

  function saveStore({ jobs, skills, assigns, idCounters }) {
    localStorage.setItem(STORE_KEYS.jobs, JSON.stringify(jobs));
    localStorage.setItem(STORE_KEYS.skills, JSON.stringify(skills));
    localStorage.setItem(STORE_KEYS.assigns, JSON.stringify(assigns));
    localStorage.setItem(STORE_KEYS.idCounters, JSON.stringify(idCounters));
  }

  let state = loadStore();

  const modalJob = window.bootstrap
    ? new bootstrap.Modal(byId("modalJob"))
    : null;
  const modalSkill = window.bootstrap
    ? new bootstrap.Modal(byId("modalSkill"))
    : null;
  const modalAssign = window.bootstrap
    ? new bootstrap.Modal(byId("modalAssign"))
    : null;

  function displayId(val) {
    return val === null || val === undefined || Number.isNaN(val) ? "" : val;
  }
  function jobTitle(id) {
    return (state.jobs.find((j) => j.id === id) || {}).title || "—";
  }
  function skillName(id) {
    return (state.skills.find((s) => s.id === id) || {}).name || "—";
  }

  function renumberFirstCol(tbody) {
    if (!tbody) return;
    Array.from(tbody.rows).forEach((tr, i) => {
      if (tr.children[0]) tr.children[0].textContent = i + 1;
    });
  }

  fetchedJobRoles = [];
  fetchedSkills = [];
  fetchedSkillAssignments = [];

  // function renderJobOptions(selectEl) {
  //   if (!selectEl) return;
  //   selectEl.innerHTML = "";
  //   state.jobs.forEach((job) => {
  //     const opt = document.createElement("option");
  //     opt.value = job.id;
  //     opt.textContent = job.title;
  //     selectEl.appendChild(opt);
  //   });
  // }

  // function renderSkillOptions(selectEl) {
  //   if (!selectEl) return;
  //   selectEl.innerHTML = "";
  //   state.skills.forEach((skill) => {
  //     const opt = document.createElement("option");
  //     opt.value = skill.id;
  //     opt.textContent = skill.name;
  //     selectEl.appendChild(opt);
  //   });
  // }

  async function renderJobsTable() {
    const tbody = byId("tblJobs")?.querySelector("tbody");
    // if (!tbody) return;
    // tbody.innerHTML = '';
    // state.jobs.forEach(job => {
    //   const tr = document.createElement('tr');
    //   tr.innerHTML = `
    //     <td>${displayId(job.id)}</td>
    //     <td>
    //       <div class="fw-semibold">${job.title}</div>
    //       <div class="text-muted small">${job.desc || ''}</div>
    //     </td>
    //     <td class="text-end">
    //       <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${job.id}">
    //         <i class="bi bi-pencil"></i>
    //       </button>
    //       <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${job.id}">
    //         <i class="bi bi-trash"></i>
    //       </button>
    //     </td>
    //   `;
    //   tbody.appendChild(tr);
    // });
    // renumberFirstCol(tbody);
    const result = await getJobRoleList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      fetchedJobRoles = result.data; //update fetched job roles local array
      tbody.innerHTML = "";
      for (i = 0; i < result.data.length; i++) {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
          <td style='width:8%'>${i + 1}</td>
          <td style='width:30%'>
            <div class="fw-semibold">${result.data[i].job_title}</div>
            <div class="text-muted small" style='font-size:10px;'>${result.data[i].description || ""
          }</div>
          </td>
       
       
          <td class="text-end" style="width:100px;">
              <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${result.data[i].job_role_id
          }">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${result.data[i].job_role_id
          }">
                <i class="bi bi-trash"></i>
              </button>
          </td>
          <td style='display:none;'>${result.data[i].job_role_id}</td>
          <td style='display:none;'>${result.data[i].industry_id}</td>
          <td style='display:none;'>${result.data[i].industry}</td>
        </tr>  
        `
        );
      }
    }
  }

  async function renderSkillsTable() {
    const tbody = byId("tblSkills")?.querySelector("tbody");
    // if (!tbody) return;
    // tbody.innerHTML = "";
    // state.skills.forEach((skill) => {
    //   const tr = document.createElement("tr");
    //   tr.innerHTML = `
    //     <td>${displayId(skill.id)}</td>
    //     <td>${skill.name}</td>
    //     <td class="text-end">
    //       <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${
    //         skill.id
    //       }">
    //         <i class="bi bi-pencil"></i>
    //       </button>
    //       <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${
    //         skill.id
    //       }">
    //         <i class="bi bi-trash"></i>
    //       </button>
    //     </td>
    //   `;
    //   tbody.appendChild(tr);
    // });
    // renumberFirstCol(tbody);

    const result = await getSkillsList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      fetchedSkills = result.data; //update fetched skills local array
      //added td for industry_id but only hidden
      tbody.innerHTML = "";
      for (i = 0; i < result.data.length; i++) {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
          <td>${i + 1}</td>
          <td>${result.data[i].name}</td>
          <td style='display:none;'>${result.data[i].related_job}</td>
          <td class="text-end" style="width:100px;">
          <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${result.data[i].skills_id
          }">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${result.data[i].skills_id
          }">
            <i class="bi bi-trash"></i>
          </button>
        </td>
          <td style='display:none;'>${result.data[i].skills_id}</td>
        </tr>
        `
        );
      }
    }
  }

  async function renderAssignmentsTable() {


    const tbody = byId("tblAssignments")?.querySelector("tbody");
    if (!tbody) return;
    const q = (byId("searchInput")?.value || "").trim().toLowerCase();
    // tbody.innerHTML = "";
    // state.assigns
    //   .filter((a) => {
    //     if (!q) return true;
    //     const iName = jobTitle(a.jobId).toLowerCase();
    //     const sName = skillName(a.skillId).toLowerCase();
    //     return iName.includes(q) || sName.includes(q);
    //   })
    //   .forEach((assign) => {
    //     const tr = document.createElement("tr");
    //     tr.innerHTML = `
    //       <td>${displayId(assign.id)}</td>
    //       <td>${jobTitle(assign.jobId)}</td>
    //       <td>${skillName(assign.skillId)}</td>
    //       <td>${assign.proficiency}</td>
    //       <td class="text-end">
    //         <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${assign.id
    //       }">
    //           <i class="bi bi-pencil"></i>
    //         </button>
    //         <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${assign.id
    //       }">
    //           <i class="bi bi-trash"></i>
    //         </button>
    //       </td>
    //     `;
    //     tbody.appendChild(tr);
    //   });
    // renumberFirstCol(tbody);

    const result = await getSkillAssignmentList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      fetchedSkillAssignments = result.data; //update fetched skill assignment local array

      console.log('this', result.data);
      tbody.innerHTML = "";
      for (i = 0; i < result.data.length; i++) {
        console.log(result.data[i].job_title);
        tbody.insertAdjacentHTML(
          "beforeend",
          `
          <td>${i}</td>
          <td>${result.data[i].job_title}</td>
          <td>${result.data[i]?.skill_name}</td>
          <td>${result.data[i]?.proficiency}</td>
          <td class="text-end" style="width:100px;">
            <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${result.data[i]?.skill_assignment_id
          }">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${result.data[i]?.skill_assignment_id
          }">
              <i class="bi bi-trash"></i>
            </button>
          </td>
          <td style='display:none'>${result.data[i]?.skill_assignment_id}</td>
        `
        );
      }
    }
  }

  byId("btnAddJob")?.addEventListener("click", () => {
    byId("jobId").value = "";
    byId("jobTitle").value = "";
    byId("jobDesc").value = "";
    byId("jobIndustryId").value = "";
    byId("jobIndustryName").value = "";
    byId("modalJob").querySelector(".modal-title").textContent = "Add Job Role";
    modalJob?.show();
  });

  byId("formJob")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = byId("jobId").value;
    const title = byId("jobTitle").value.trim();
    const desc = byId("jobDesc").value.trim();
    const industryId = byId("jobIndustryId").value.trim();
    const industryName = byId("jobIndustryName").value.trim();
    if (!title) return;

    if (id) {
      //edit job role in db
      // const idx = state.jobs.findIndex((j) => j.id === Number(id));
      // if (idx >= 0) {
      //   state.jobs[idx].title = title;
      //   state.jobs[idx].desc = desc;
      // }
      console.log("Editing job role id:", id);
      const result = await editJobRole(id, title, desc, industryId, industryName);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        modalJob?.hide();
      }

    } else {
      // state.idCounters.job += 1;
      // const newId = state.idCounters.job;
      // state.jobs.push({ id: newId, title, desc });

      //add job role to db
      empty_industry_id = "";
      no_industry = "No Industry";
      const result = await addJobRole(title, desc, empty_industry_id, no_industry);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        modalJob?.hide();
      }
    }
    saveStore(state);
    renderJobsTable();
    renderAssignmentsTable();
    modalJob?.hide();
  });

  byId("tblJobs")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");

    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "edit") {
      const job = fetchedJobRoles.find((j) => j.job_role_id === id);
      if (!job) return;
      byId("jobId").value = job.job_role_id;
      byId("jobTitle").value = job.job_title;
      byId("jobDesc").value = job.description || "";
      byId('jobIndustryId').value = job.industry_id;
      byId('jobIndustryName').value = job.industry;

      byId("modalJob").querySelector(".modal-title").textContent =
        "Edit Job Role";
      modalJob?.show();
    }
    if (action === "del") {
      if (!confirm("Delete this job role?")) return;

      const result = await deleteJobRole(id);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        renderAssignmentsTable();
      }
    }
  });

  byId("btnAddSkill")?.addEventListener("click", () => {
    byId("skillId").value = "";
    byId("skillName").value = "";
    byId("skillDesc").value = "";
    byId("modalSkill").querySelector(".modal-title").textContent = "Add Skill";
    modalSkill?.show();
  });

  byId("formSkill")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = byId("skillId").value;
    const name = byId("skillName").value.trim();
    const desc = byId("skillDesc").value.trim();
    if (!name) return;

    if (id) {
      //edit skill in db
      // const idx = state.skills.findIndex((s) => s.id === Number(id));
      // if (idx >= 0) {
      //   state.skills[idx].name = name;
      //   state.skills[idx].desc = desc;
      // }

      const result = await editSkill(id, name, desc);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderSkillsTable();
        renderAssignmentsTable();
        modalSkill?.hide();
      }


    } else {
      // state.idCounters.skill += 1;
      // const newId = state.idCounters.skill;
      // state.skills.push({ id: newId, name, desc });

      //add skill to db

      const result = await addSkill(name, desc);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderSkillsTable();
        renderAssignmentsTable();
        modalSkill?.hide();
      }
    }


  });

  byId("tblSkills")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "edit") {
      const row = e.target.closest("tr");
      // editModal.dataset.row = row.rowIndex;
      document.getElementById("skillId").value = row.children[4].innerText;
      document.getElementById("skillName").value = row.children[1].innerText;
      document.getElementById("skillDesc").value =
        row.children[2].innerText || "";

      // const skill = state.skills.find((s) => s.id === id);
      // if (!skill) return;
      // byId("skillId").value = skill.id;
      // byId("skillName").value = skill.name;
      // byId("skillDesc").value = skill.desc || "";
      byId("modalSkill").querySelector(".modal-title").textContent =
        "Edit Skill";
      modalSkill?.show();
    }
    if (action === "del") {
      const row = e.target.closest("tr");
      if (!confirm("Delete this skill?")) return;
      document.getElementById("skillId").value = row.children[4].innerText;

      const result = await deleteSkill(row.children[4].innerText);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderSkillsTable();
        renderAssignmentsTable();
      }

    }
  });

  function openAssignModal(editId = null) {
    renderJobOptions();
    renderSkillOptions();

    const skillSelect = byId('assignSkill');
    const jobRoleSelect = byId('assignJob');

    byId("assignId").value = "";
    byId("assignProficiency").value = "";
    byId("modalAssign").querySelector(".modal-title").textContent = editId
      ? "Edit Job ⇄ Skill Assignment"
      : "Add Job ⇄ Skill Assignment";


    if (editId) {
      const rec = fetchedSkillAssignments.find((a) => a.skill_assignment_id === editId);
      if (!rec) return;

      skillSelect.value = `${rec.skill_id}/${rec.skill_name}`.trim();
      jobRoleSelect.value = `${rec.job_role_id}/${rec.job_title}/${rec.job_industry_id}/${rec.job_industry_name}`;

      byId("assignJob").value = jobRoleSelect.value;
      byId("assignSkill").value = skillSelect.value;
      byId("assignProficiency").value = rec.proficiency;
      byId("assignId").value = rec.skill_assignment_id;


    }
    modalAssign?.show();
  }

  byId("btnAddAssign")?.addEventListener("click", () => openAssignModal());

  byId("formAssign")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idVal = byId("assignId").value;
    // const jobId = Number(byId("assignJob").value);
    // const skillId = Number(byId("assignSkill").value);
    const proficiency = byId("assignProficiency").value.trim();
    if (!proficiency) return;

    const [jobRoleId, jobTitle, jobIndustryId, jobIndustryName] = byId('assignJob').value.split("/");
    const [skillId, skillName] = byId('assignSkill').value.split("/");


    if (idVal) {
      // const idx = fetchedSkillAssignments.findIndex((a) => a.skill_assignment_id === Number(idVal));
      // if (idx >= 0) {
      //   state.assigns[idx].jobId = jobId;
      //   state.assigns[idx].skillId = skillId;
      //   state.assigns[idx].proficiency = proficiency;
      // }

      //check for duplicate skill assignment
      const dup = fetchedSkillAssignments.some(a => a.job_role_id == jobRoleId && a.skill_id == skillId && a.skill_assignment_id != idVal);
      if (dup) {
        alert('This Job ⇄ Skill link already exists.');
        return;
      }

      const result = await editSkillAssignment(idVal, jobRoleId, jobTitle, skillId, skillName, jobIndustryId, jobIndustryName, proficiency);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderAssignmentsTable();
        modalAssign?.hide();
      }
    } else {
      // state.idCounters.assign += 1;
      // const newId = state.idCounters.assign;
      // state.assigns.push({
      //   id: newId,
      //   jobId,
      //   skillId,
      //   proficiency,
      // });

      //check for duplicate skill assignment
      const dup = fetchedSkillAssignments.some(a => a.job_role_id == jobRoleId && a.skill_id == skillId);
      if (dup) {
        alert('This Job ⇄ Skill link already exists.');
        return;
      }

      const result = await addSkillAssignment(jobRoleId, jobTitle, skillId, skillName, jobIndustryId, jobIndustryName, proficiency);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderAssignmentsTable();
        modalAssign?.hide();
      }
    }
    // saveStore(state);


  });

  byId("tblAssignments")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "edit") openAssignModal(id);
    if (action === "del") {
      if (!confirm("Delete this assignment?")) return;

      const row = e.target.closest("tr");
      byId("assignId").value = row.children[5].innerText;
      const result = await deleteSkillAssignment(row.children[5].innerText);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderAssignmentsTable();
      }
    }
  });

  (function init() {
    renderJobsTable();
    renderSkillsTable();
    renderAssignmentsTable();
  })();

  const searchInput = byId("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();

      const jobsTbody = byId("tblJobs")?.querySelector("tbody");
      if (jobsTbody) {
        Array.from(jobsTbody.rows).forEach((row) => {
          row.style.display = row.innerText.toLowerCase().includes(q)
            ? ""
            : "none";
        });
      }

      const skillsTbody = byId("tblSkills")?.querySelector("tbody");
      if (skillsTbody) {
        Array.from(skillsTbody.rows).forEach((row) => {
          row.style.display = row.innerText.toLowerCase().includes(q)
            ? ""
            : "none";
        });
      }

      renderAssignmentsTable();
    });
  }

  ["tblJobs", "tblSkills", "tblAssignments"].forEach((id) => {
    const tbody = byId(id)?.querySelector("tbody");
    if (!tbody) return;
    const mo = new MutationObserver((muts) => {
      if (muts.some((m) => m.type === "childList")) renumberFirstCol(tbody);
    });
    mo.observe(tbody, { childList: true });
  });
});

//GET LIST OF JOB ROLE FUNCTION
async function getJobRoleList() {
  const { data, error } = await supabase
    .from("JobRoles")
    .select("*")
    .order("job_role_id", { ascending: true });

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

//ADD JOB ROLE FUNCTION
async function addJobRole(name, description, industry_id, industry_name) {
  const new_induster_name = industry_name === "" ? null : industry_name;
  const new_industry_id = industry_id === "" ? null : Number(industry_id_input);
  const { data, error } = await supabase.from("JobRoles").insert([
    {
      job_title: name,
      description: description,
      industry_id: new_industry_id,
      industry: new_induster_name,
      created_at: new Date().toLocaleString(),
    },
  ]);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: "Job Role Added!",
      success: true,
    };
  }
}

//EDIT JOB ROLE FUNCTION
async function editJobRole(
  job_role_id,
  name,
  description,
  industry_id,
  industry_name
) {

  const new_industry_id = industry_id === "" ? null : Number(industry_id_input);
  const { error } = await supabase
    .from("JobRoles")
    .update({
      job_title: name,
      description: description,
      industry_id: new_industry_id,
      industry: industry_name,
    })
    .eq("job_role_id", job_role_id) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Job Role Updated!`,
      success: true,
    };
  }
}

//DELETE JOB ROLE FUNCTION
async function deleteJobRole(job_role_id) {
  const { data, error } = await supabase
    .from("JobRoles")
    .delete()
    .eq("job_role_id", job_role_id)
    .select()
    .throwOnError();
  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Job Role Deleted!`,
      success: true,
    };
  }
}

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

async function renderJobOptions() {
  const assignJob = document.getElementById("assignJob");
  assignJob.innerHTML = "";
  for (i = 0; i < fetchedJobRoles.length; i++) {
    // Get the select element

    // Create a new option element
    const option = document.createElement("option");

    // Set the text and value for the option
    option.text = `${fetchedJobRoles[i].job_title +
      " (" +
      (fetchedJobRoles[i].industry
        ? fetchedJobRoles[i].industry
        : "No industry") +
      ")"
      }`;
    //value is divided by / to easily extract job role id, job title, industry id, industry name during add and delete of job assignment
    option.value = `${fetchedJobRoles[i].job_role_id}/${fetchedJobRoles[i].job_title}/${fetchedJobRoles[i].industry_id}/${fetchedJobRoles[i].industry}`;
    // Append the option to the select element
    assignJob.appendChild(option);
  }
}




async function renderSkillOptions() {
  const assignSkill = document.getElementById("assignSkill");
  assignSkill.innerHTML = "";
  for (i = 0; i < fetchedSkills.length; i++) {
    // Get the select element

    // Create a new option element
    const option = document.createElement("option");
    console.log(`${fetchedSkills[i].skills_id}/${fetchedSkills[i].name}`);
    // Set the text and value for the option
    option.text = `${fetchedSkills[i].name}`;
    //value is divided by / to easily extract job role id, job title, industry id, industry name during add and delete of job assignment
    option.value = `${fetchedSkills[i].skills_id}/${fetchedSkills[i].name}`;
    // Append the option to the select element
    assignSkill.appendChild(option);
  }
}


//GET LIST OF SKILL ASSIGNMENT FUNCTION
async function getSkillAssignmentList() {
  const { data, error } = await supabase
    .from("SkillAssignment")
    .select("*")
    .order("skill_assignment_id", { ascending: true });

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




// ADD SKILL ASSIGNMENT FUNCTION
async function addSkillAssignment(job_role_id, job_title, skill_id, skill_name, job_industry_id, job_industry_name, proficiency) {
  const { data, error } = await supabase.from("SkillAssignment").insert([
    {
      job_role_id: job_role_id,
      job_title: job_title,
      skill_id: skill_id,
      skill_name: skill_name,
      job_industry_id: job_industry_id,
      job_industry_name: job_industry_name,
      proficiency: proficiency,
    },
  ]);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: "Skill Assignment Added!",
      success: true,
    };
  }
}

//EDIT SKILL ASSIGNMENT FUNCTION
async function editSkillAssignment(skill_assignment_id, job_role_id, job_title, skill_id, skill_name, job_industry_id, job_industry_name, proficiency) {
  const { error } = await supabase
    .from("SkillAssignment")
    .update({
      job_role_id: job_role_id,
      job_title: job_title,
      skill_id: skill_id,
      skill_name: skill_name,
      job_industry_id: job_industry_id,
      job_industry_name: job_industry_name,
      proficiency: proficiency,
    })
    .eq("skill_assignment_id", skill_assignment_id) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Skill Assignment Updated!`,
      success: true,
    };
  }
}

// DELETE SKILL ASSIGNMENT FUNCTION
async function deleteSkillAssignment(skill_assignment_id) {
  const { data, error } = await supabase
    .from("SkillAssignment")
    .delete()
    .eq("skill_assignment_id", skill_assignment_id)
    .select() // optional: returns deleted row
    .throwOnError();

  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Skill Assignment Deleted!`,
      success: true,
    };
  }
}