if (localStorage.getItem('isLoggedIn') == 'FALSE') {
  window.location.href = "./index.html";
}

document.addEventListener('DOMContentLoaded', () => {
  const byId = (id) => document.getElementById(id);

  function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('show');
  }
  window.toggleProfileMenu = toggleProfileMenu;

  function enforceDataAssignmentOpen() {
    const master = byId('submenuMasterData');
    const data = byId('submenuDataAssignment');
    if (master) master.classList.remove('show');
    if (data) data.classList.add('show');
  }
  enforceDataAssignmentOpen();

  document.querySelectorAll('.toggle-menu').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const mySubmenu = btn.nextElementSibling;

      document.querySelectorAll('.submenu').forEach(list => list.classList.remove('show'));
      if (mySubmenu) mySubmenu.classList.add('show');
    });
  });

  const linkIndustryAss = document.getElementById('linkIndustryAss');
  if (linkIndustryAss) {
    linkIndustryAss.addEventListener('click', () => {
      enforceDataAssignmentOpen();
    });
  }

  const STORE_KEYS = {
    industries: 'skillocal_industries',
    jobs: 'skillocal_jobs',
    assigns: 'skillocal_assigns',
    idCounters: 'skillocal_idcounters'
  };

  const defaultData = {
    industries: [],
    jobs: [],
    assigns: [],
    idCounters: { industry: 0, job: 0, assign: 0 }
  };

  //all fetched data arrays
  fetchedIndustries = [];
  fetchedJobRoles = [];

  window.load = renderIndustryOptions();
  window.load = renderJobOptions();

  function loadStore() {
    const industries = JSON.parse(localStorage.getItem(STORE_KEYS.industries)) || defaultData.industries;
    const jobs = JSON.parse(localStorage.getItem(STORE_KEYS.jobs)) || defaultData.jobs;
    const assigns = JSON.parse(localStorage.getItem(STORE_KEYS.assigns)) || defaultData.assigns;
    const idCounters = JSON.parse(localStorage.getItem(STORE_KEYS.idCounters)) || defaultData.idCounters;
    return { industries, jobs, assigns, idCounters };
  }

  function saveStore({ industries, jobs, assigns, idCounters }) {
    localStorage.setItem(STORE_KEYS.industries, JSON.stringify(industries));
    localStorage.setItem(STORE_KEYS.jobs, JSON.stringify(jobs));
    localStorage.setItem(STORE_KEYS.assigns, JSON.stringify(assigns));
    localStorage.setItem(STORE_KEYS.idCounters, JSON.stringify(idCounters));
  }

  let state = loadStore();
  let assignIndustryChangeHandler = null;

  const modalIndustry = window.bootstrap ? new bootstrap.Modal(byId('modalIndustry')) : null;
  const modalJob = window.bootstrap ? new bootstrap.Modal(byId('modalJob')) : null;
  const modalAssign = window.bootstrap ? new bootstrap.Modal(byId('modalAssign')) : null;

  function industryName(id) {
    return (state.industries.find(i => i.id === id) || {}).name || '—';
  }
  function jobTitle(id) {
    return (state.jobs.find(j => j.id === id) || {}).title || '—';
  }

  function renumberFirstCol(tbody) {
    if (!tbody) return;
    Array.from(tbody.rows).forEach((tr, i) => {
      if (tr.children[0]) tr.children[0].textContent = i + 1;
    });
  }

  async function renderIndustryOptions(
    // selectEl, withEmpty = true
  ) {
    // if (!selectEl) return;
    // selectEl.innerHTML = '';
    // if (withEmpty) {
    //   const opt = document.createElement('option');
    //   opt.value = '';
    //   opt.textContent = '— None —';
    //   selectEl.appendChild(opt);
    // }
    // state.industries.forEach(ind => {
    //   const opt = document.createElement('option');
    //   opt.value = ind.id;
    //   opt.textContent = `${ind.name}`;
    //   selectEl.appendChild(opt);
    // });
    //fill up industry drop down with list from Industry table (db)

    const result = await getIndustryList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {

      const jobIndustry = document.getElementById("jobIndustry");
      const assignIndustry = document.getElementById("assignIndustry");

      jobIndustry.innerHTML = '';
      assignIndustry.innerHTML = '';
      // Create blank option
      const option = document.createElement("option");
      const option2 = document.createElement("option");

      // Add additional option for job indudstry select
      option.text = "No Industry";
      option.value = "";
      // Append the option to the select element
      jobIndustry.appendChild(option);

      for (i = 0; i < result.data.length; i++) {
        // Get the select element

        // Create a new option element
        const option = document.createElement("option");
        const option2 = document.createElement("option");

        // Set the text and value for the option
        option.text = result.data[i].industry_name;
        option.value = result.data[i].industry_id;
        // Append the option to the select element
        jobIndustry.appendChild(option);

        // Set the text and value for the option
        option2.text = result.data[i].industry_name;
        option2.value = result.data[i].industry_id;
        // Append the option to the select element
        assignIndustry.appendChild(option2);
      }

    }

  }

  async function renderJobOptions(
    // selectEl, filterIndustryId = null

  ) {
    // if (!selectEl) return;
    // selectEl.innerHTML = '';

    // if (!state.jobs.length) {
    //   const opt = document.createElement('option');
    //   opt.value = '';
    //   opt.textContent = 'No jobs available';
    //   selectEl.appendChild(opt);
    //   return;
    // }

    // const preferred = [];
    // const others = [];

    // state.jobs.forEach(job => {
    //   if (filterIndustryId && job.industryId === Number(filterIndustryId)) preferred.push(job);
    //   else others.push(job);
    // });

    // const ordered = [...preferred, ...others];

    // ordered.forEach(job => {
    //   const opt = document.createElement('option');
    //   opt.value = job.id;
    //   const indName = job.industryId ? industryName(job.industryId) : 'No industry';
    //   opt.textContent = `${job.title} (${indName})`;
    //   selectEl.appendChild(opt);
    // });


    const assignJob = document.getElementById("assignJob");
    assignJob.innerHTML = '';
    for (i = 0; i < fetchedJobRoles.length; i++) {
      // Get the select element

      // Create a new option element
      const option = document.createElement("option");

      // Set the text and value for the option
      option.text = `${fetchedJobRoles[i].job_title + " (" + (fetchedJobRoles[i].industry ? fetchedJobRoles[i].industry : "No industry") + ")"}`;
      option.value = fetchedJobRoles[i].job_role_id;
      // Append the option to the select element
      assignJob.appendChild(option);

    }

  }

  async function renderIndustriesTable() {
    const tbody = byId('tblIndustries')?.querySelector('tbody');
    // if (!tbody) return;
    // tbody.innerHTML = '';
    // state.industries.forEach(ind => {
    //   const tr = document.createElement('tr');
    //   tr.innerHTML = `
    //     <td>${ind.id}</td>
    //     <td>
    //       <div class="fw-semibold">${ind.name}</div>
    //       <div class="text-muted small">${ind.desc || ''}</div>
    //     </td>
    //     <td class="text-end">
    //       <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${ind.id}"><i class="bi bi-pencil"></i></button>
    //       <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${ind.id}"><i class="bi bi-trash"></i></button>
    //     </td>
    //   `;
    //   tbody.appendChild(tr);
    // });
    // renumberFirstCol(tbody);
    const result = await getIndustryList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      //added td for industry_id but only hidden
      tbody.innerHTML = "";
      fetchedIndustries = result.data; //update fetched industries
      for (i = 0; i < result.data.length; i++) {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
          <td>${i + 1}</td>
          <td>${result.data[i].industry_name}</td>
          <td class="text-end" style="width:100px;">
            <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${result.data[i].industry_id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${result.data[i].industry_id}"><i class="bi bi-trash"></i></button>
          </td>
          <td style='display:none;'>${result.data[i].description}</td>
          <td style='display:none;'>${result.data[i].industry_id}</td>
        </tr>  
        `
        );
      }
    }
  }

  async function renderJobsTable() {
    const tbody = byId('tblJobs')?.querySelector('tbody');
    // if (!tbody) return;
    // tbody.innerHTML = '';
    // state.jobs.forEach(job => {
    //   const tr = document.createElement('tr');
    //   tr.innerHTML = `
    //     <td>${job.id}</td>
    //     <td>
    //       <div class="fw-semibold">${job.title}</div>
    //       <div class="text-muted small">${job.desc || ''}</div>
    //     </td>
    //     <td class="d-none d-lg-table-cell">
    //       ${job.industryId ? industryName(job.industryId) : '<span class="text-muted">—</span>'}
    //     </td>
    //     <td class="text-end">
    //       <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${job.id}"><i class="bi bi-pencil"></i></button>
    //       <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${job.id}"><i class="bi bi-trash"></i></button>
    //     </td>
    //   `;
    //   tbody.appendChild(tr);
    // });
    // renumberFirstCol(tbody);
    const result = await getJobRoleList();
    if (result.success === false) {
      alert(result.message); //browser alert message
    } else {
      //added td for industry_id but only hidden
      fetchedJobRoles = result.data; //update fetched job roles
      tbody.innerHTML = "";
      for (i = 0; i < result.data.length; i++) {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
        <tr>
          <td style='width:8%'>${i + 1}</td>
          <td style='width:30%'>
            <div class="fw-semibold">${result.data[i].job_title}</div>
            <div class="text-muted small" style='font-size:10px;'>${result.data[i].description || ''}</div>
          </td>
          <td style='width:20%' class="d-none d-lg-table-cell">
            ${result.data[i].industry ? result.data[i].industry : '<span class="text-muted">—</span>'}
          </td>
          <td class="text-end" style="width:100px;">
            <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${result.data[i].job_role_id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${result.data[i].job_role_id}"><i class="bi bi-trash"></i></button>
          </td>
          <td style='display:none;'>${result.data[i].job_role_id}</td>
        </tr>  
        `
        );


      }
    }
  }

  function renderAssignmentsTable() {
    const tbody = byId('tblAssignments')?.querySelector('tbody');
    const q = byId('searchInput')?.value.trim().toLowerCase() || '';
    if (!tbody) return;
    tbody.innerHTML = '';
    state.assigns
      .filter(a => {
        if (!q) return true;
        const iName = industryName(a.industryId).toLowerCase();
        const jTitle = jobTitle(a.jobId).toLowerCase();
        return iName.includes(q) || jTitle.includes(q);
      })
      .forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${industryName(a.industryId)}</td>
          <td>${jobTitle(a.jobId)}</td>
          <td>
            <span class="badge ${a.active ? 'bg-success' : 'bg-secondary'}">${a.active ? 'Active' : 'Inactive'}</span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${a.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${a.id}"><i class="bi bi-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    renumberFirstCol(tbody);
  }

  byId('btnAddIndustry')?.addEventListener('click', () => {
    byId('industryId').value = '';
    byId('industryName').value = '';
    byId('industryDesc').value = '';
    byId('modalIndustry').querySelector('.modal-title').textContent = 'Add Industry';
    modalIndustry?.show();
  });

  byId('formIndustry')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = byId('industryId').value;
    const name = byId('industryName').value.trim();
    if (!name) return;
    const desc = byId('industryDesc').value.trim();

    //save edits to supabase
    if (id) {
      // const idx = state.industries.findIndex(i => i.id === Number(id));
      // if (idx >= 0) {
      //   state.industries[idx].name = name;
      //   state.industries[idx].desc = desc;
      // }
      const result = await editIndustry(id, name, desc);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderIndustriesTable();
        modalIndustry?.hide();
      }
    } else {
      //add new industry to supabase
      // state.idCounters.industry += 1;
      // state.industries.push({ id: state.idCounters.industry, name, desc });
      const result = await addIndustry(name, desc);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderIndustriesTable();
        modalIndustry?.hide();
      }
    }
    // saveStore(state);
    // renderIndustryOptions(byId('jobIndustry'));
    // renderIndustryOptions(byId('assignIndustry'), false);
    // renderIndustriesTable();
    renderAssignmentsTable();
    renderIndustryOptions();
  });

  byId('tblIndustries')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {
      // const ind = state.industries.find(i => i.id === id);
      const ind = fetchedIndustries.find(i => i.industry_id === id);

      if (!ind) return;
      byId('industryId').value = ind.industry_id;
      byId('industryName').value = ind.industry_name;
      byId('industryDesc').value = ind.description || '';
      byId('modalIndustry').querySelector('.modal-title').textContent = 'Edit Industry';
      modalIndustry?.show();
    }
    if (action === 'del') {
      if (!confirm('Delete this industry? Related jobs/assignments will remain but may be orphaned.')) return;
      // state.industries = state.industries.filter(i => i.id !== id);
      // saveStore(state);
      // renderIndustryOptions(byId('jobIndustry'));
      // renderIndustryOptions(byId('assignIndustry'), false);
      // renderIndustriesTable();
      // renderJobsTable();
      // renderAssignmentsTable();
      // renderIndustryOptions();

      const result = await deleteIndustry(id);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderIndustriesTable();
        renderJobsTable();
        renderAssignmentsTable();
        renderIndustryOptions();
      }
    }
  });

  byId('btnAddJob')?.addEventListener('click', () => {
    byId('jobId').value = '';
    byId('jobTitle').value = '';
    byId('jobDesc').value = '';
    byId('modalJob').querySelector('.modal-title').textContent = 'Add Job Role';
    modalJob?.show();
  });

  byId('formJob')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = byId('jobId').value;
    const title = byId('jobTitle').value.trim();
    if (!title) return;
    const desc = byId('jobDesc').value.trim();
    const indVal = byId('jobIndustry').value;
    const industryId = indVal ? Number(indVal) : null;

    const industrySelect = document.getElementById("jobIndustry");
    // const industryId = industrySelect.value;  
    const industryName = industrySelect.options[industrySelect.selectedIndex].text;

    if (id) {
      // const idx = state.jobs.findIndex(j => j.id === Number(id));
      // if (idx >= 0) {
      //   state.jobs[idx].title = title;
      //   state.jobs[idx].desc = desc;
      //   state.jobs[idx].industryId = industryId;
      // }
      const result = await editJobRole(id, title, desc, industryId, industryName);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        modalJob?.hide();
      }

      renderJobsTable();
      modalJob?.hide();
    } else {
      //ADD JOB ROLE TO SUPABASE
      // state.idCounters.job += 1;
      // state.jobs.push({ id: state.idCounters.job, title, desc, industryId });
      const result = await addJobRole(title, desc, industryId, industryName);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        modalJob?.hide();
      }
    }
    // saveStore(state);
    renderAssignmentsTable();

  });

  byId('tblJobs')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {

      const job = fetchedJobRoles.find(j => j.job_role_id === id);
      if (!job) return;
      byId('jobId').value = job.job_role_id;
      byId('jobTitle').value = job.job_title;
      byId('jobDesc').value = job.description || '';
      byId('jobIndustry').value = job.industry_id;

      byId('modalJob').querySelector('.modal-title').textContent = 'Edit Job Role';
      modalJob?.show();

    }
    if (action === 'del') {
      if (!confirm('Delete this job role? Related assignments will remain but may be orphaned.')) return;
      // state.jobs = state.jobs.filter(j => j.id !== id);
      // saveStore(state);
      // renderJobsTable();
      // renderAssignmentsTable();

      const job = fetchedJobRoles.find(j => j.job_role_id === id);
      const result = await deleteJobRole(job.job_role_id);
      if (result.success === false) {
        alert(result.message); //browser alert message
      } else {
        alert(result.message); //browser alert message
        renderJobsTable();
        renderAssignmentsTable();
      }
    }
  });


  dsfsdfs
  functiosadn openAssignModal(editId = null) {
    // renderIndustryOptions(byId('assignIndustry'), false);
    renderIndustryOptions();
    const industrySelect = byId('assignIndustry');
    const jobSelect = byId('assignJob');

    if (assignIndustryChangeHandler && industrySelect) {
      industrySelect.removeEventListener('change', assignIndustryChangeHandler);
    }

    assignIndustryChangeHandler = () => {
      const filter = industrySelect.value ? Number(industrySelect.value) : null;
      renderJobOptions(jobSelect, filter);
    };

    industrySelect?.addEventListener('change', assignIndustryChangeHandler);

    byId('assignId').value = '';
    byId('assignActive').checked = true;

    if (editId) {
      const rec = state.assigns.find(a => a.id === editId);
      if (!rec) return;
      industrySelect.value = rec.industryId;
      assignIndustryChangeHandler();
      jobSelect.value = rec.jobId;
      byId('assignId').value = rec.id;
      byId('assignActive').checked = rec.active;
      byId('modalAssign').querySelector('.modal-title').textContent = 'Edit Assignment';
    } else {
      if (state.industries.length) {
        industrySelect.value = state.industries[0].id;
        assignIndustryChangeHandler();
      } else {
        renderJobOptions(jobSelect, null);
      }
      byId('modalAssign').querySelector('.modal-title').textContent = 'Add Industry ⇄ Job Assignment';
    }

    modalAssign?.show();
  }

  byId('openAssignModalBtn')?.addEventListener('click', () => openAssignModal());

  byId('formAssign')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = byId('assignId').value;
    const industryId = Number(byId('assignIndustry').value);
    const jobId = Number(byId('assignJob').value);
    const active = byId('assignActive').checked;

    const dup = state.assigns.find(a => a.industryId === industryId && a.jobId === jobId && a.id !== Number(idVal || 0));
    if (dup) {
      alert('This Industry ⇄ Job link already exists.');
      return;
    }

    if (idVal) {
      const idx = state.assigns.findIndex(a => a.id === Number(idVal));
      state.assigns[idx].industryId = industryId;
      state.assigns[idx].jobId = jobId;
      state.assigns[idx].active = active;
    } else {
      state.idCounters.assign += 1;
      state.assigns.push({
        id: state.idCounters.assign,
        industryId,
        jobId,
        active,
        date: new Date().toISOString()
      });
    }

    saveStore(state);
    renderAssignmentsTable();
    modalAssign?.hide();
  });

  byId('tblAssignments')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') openAssignModal(id);
    if (action === 'del') {
      if (!confirm('Delete this assignment?')) return;
      state.assigns = state.assigns.filter(a => a.id !== id);
      saveStore(state);
      renderAssignmentsTable();
    }
  });

  byId('searchInput')?.addEventListener('input', renderAssignmentsTable);

  (function init() {
    renderIndustriesTable();
    renderJobsTable();
    // renderIndustryOptions(byId('jobIndustry'), true);
    // renderIndustryOptions(byId('assignIndustry'), false);
    // renderIndustryOptions();
    renderAssignmentsTable();
  })();

  ['tblIndustries', 'tblJobs', 'tblAssignments'].forEach(id => {
    const tbody = byId(id)?.querySelector('tbody');
    if (!tbody) return;
    const mo = new MutationObserver(muts => {
      if (muts.some(m => m.type === 'childList')) renumberFirstCol(tbody);
    });
    mo.observe(tbody, { childList: true });
  });
});




//GET LIST OF INDUSTRY FUNCTION
async function getIndustryList() {
  const { data, error } = await supabase
    .from("Industry")
    .select("*")
    .order("industry_id", { ascending: true });

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

//ADD INDUSTRY FUNCTION
async function addIndustry(industryName, industryDescription) {
  const { data, error } = await supabase.from("Industry").insert([
    {
      industry_name: industryName,
      description: industryDescription,
      createdAt: new Date().toLocaleString(),
    },
  ]);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: "Industry Added!",
      success: true,
    };
  }
}

//EDIT INDUSTRY FUNCTION
async function editIndustry(industryId, industryName, industryDescription) {
  const { error } = await supabase
    .from("Industry")
    .update({
      industry_name: industryName,
      description: industryDescription,
      modifiedAt: new Date().toLocaleString(),
    })
    .eq("industry_id", industryId) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Industry Updated!`,
      success: true,
    };
  }
}

//DELETE INDUSTRY FUNCTION
async function deleteIndustry(industryId) {
  const { data, error } = await supabase
    .from("Industry")
    .delete()
    .eq("industry_id", industryId)
    .select()
    .throwOnError();
  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Industry Deleted!`,
      success: true,
    };
  }
}




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
  const { data, error } = await supabase.from("JobRoles").insert([
    {
      job_title: name,
      description: description,
      industry_id: industry_id,
      industry: industry_name,
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
async function editJobRole(job_role_id, name, description, industry_id, industry_name) {
  const { error } = await supabase
    .from("JobRoles")
    .update({
      job_title: name,
      description: description,
      industry_id: industry_id,
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





//GET LIST OF JOB ASSIGNMENT FUNCTION
async function getJobAssignmentList() {
  const { data, error } = await supabase
    .from("JobAssignment")
    .select("*")
    .order("job_assignment_id", { ascending: true });

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

//ADD JOB ASSIGNMENT FUNCTION
async function addJobAssignment(industry_id, industry_name, job_role_id, job_title, job_industry_id, job_industry_name, isActive) {
  const { data, error } = await supabase.from("JobAssignment").insert([
    {
      industry_id: industry_id,
      industry_name: industry_name,
      job_role_id: job_role_id,
      job_title: job_title,
      job_industry_id: job_industry_id,
      job_industry_name: job_industry_name,
      isActive: isActive,
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
      message: "Job Assignment Added!",
      success: true,
    };
  }
}

//EDIT JOB ASSIGNMENT FUNCTION
async function editJobAssignment(job_assignment_id, industry_id, industry_name, job_role_id, job_title, job_industry_id, job_industry_name, isActive) {
  const { error } = await supabase
    .from("JobAssignment")
    .update({
      industry_id: industry_id,
      industry_name: industry_name,
      job_role_id: job_role_id,
      job_title: job_title,
      job_industry_id: job_industry_id,
      job_industry_name: job_industry_name,
      isActive: isActive,
    })
    .eq("job_assignment_id", job_assignment_id) // your condition
    .select();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  } else {
    return {
      message: `Job Assignment Updated!`,
      success: true,
    };
  }
}

//DELETE JOB ASSIGNMENT FUNCTION
async function deleteJobAssignment(job_assignment_id) {
  const { data, error } = await supabase
    .from("JobAssignment")
    .delete()
    .eq("job_assignment_id", job_assignment_id)
    .select()
    .throwOnError();
  if (error || data.length === 0) {
    return {
      message: error?.message || "Foreign key prevents deletion.",
      success: false,
    };
  } else {
    return {
      message: `Job Assignment Deleted!`,
      success: true,
    };
  }
}
