if (localStorage.getItem('isLoggedIn')=='FALSE'){
  window.location.href="./index.html";
}

document.addEventListener('DOMContentLoaded', () => {
  function byId(id){ return document.getElementById(id); }

  function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('show');
  }
  window.toggleProfileMenu = toggleProfileMenu;

  const submenuMasterData     = byId('submenuMasterData');
  const submenuDataAssignment = byId('submenuDataAssignment');

  if (submenuMasterData)     submenuMasterData.classList.remove('show');
  if (submenuDataAssignment) submenuDataAssignment.classList.add('show');

  document.querySelectorAll('.toggle-menu').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const mySub = btn.nextElementSibling;
      document.querySelectorAll('.submenu').forEach(list => {
        list.classList.remove('show');
      });
      if (mySub) mySub.classList.add('show');
    });
  });

  const linkJobSkillsAss = byId('linkJobSkillsAss');
  if (linkJobSkillsAss) {
    linkJobSkillsAss.addEventListener('click', () => {
      if (submenuMasterData)     submenuMasterData.classList.remove('show');
      if (submenuDataAssignment) submenuDataAssignment.classList.add('show');
    });
  }

  const STORE_KEYS = {
    jobs:       'skillocal_js_jobs',
    skills:     'skillocal_js_skills',
    assigns:    'skillocal_js_assigns',
    idCounters: 'skillocal_js_idcounters'
  };

  const defaultData = {
    jobs: [],
    skills: [],
    assigns: [],
    idCounters: { job: 0, skill: 0, assign: 0 }
  };

  function loadStore() {
    const jobsRaw     = JSON.parse(localStorage.getItem(STORE_KEYS.jobs));
    const skillsRaw   = JSON.parse(localStorage.getItem(STORE_KEYS.skills));
    const assignsRaw  = JSON.parse(localStorage.getItem(STORE_KEYS.assigns));
    const ctrRaw      = JSON.parse(localStorage.getItem(STORE_KEYS.idCounters));

    let jobs       = jobsRaw     || defaultData.jobs;
    let skills     = skillsRaw   || defaultData.skills;
    let assigns    = assignsRaw  || defaultData.assigns;
    let idCounters = ctrRaw      || defaultData.idCounters;

    jobs    = jobs.filter(j   => j && j.id   != null);
    skills  = skills.filter(s => s && s.id   != null);
    assigns = assigns.filter(a => a && a.id != null);

    return { jobs, skills, assigns, idCounters };
  }

  function saveStore({ jobs, skills, assigns, idCounters }) {
    localStorage.setItem(STORE_KEYS.jobs,       JSON.stringify(jobs));
    localStorage.setItem(STORE_KEYS.skills,     JSON.stringify(skills));
    localStorage.setItem(STORE_KEYS.assigns,    JSON.stringify(assigns));
    localStorage.setItem(STORE_KEYS.idCounters, JSON.stringify(idCounters));
  }

  let state = loadStore();

  const modalJob    = window.bootstrap ? new bootstrap.Modal(byId('modalJob'))    : null;
  const modalSkill  = window.bootstrap ? new bootstrap.Modal(byId('modalSkill'))  : null;
  const modalAssign = window.bootstrap ? new bootstrap.Modal(byId('modalAssign')) : null;

  function displayId(val) {
    return (val === null || val === undefined || Number.isNaN(val)) ? '' : val;
  }
  function jobTitle(id) {
    return (state.jobs.find(j => j.id === id) || {}).title || '—';
  }
  function skillName(id) {
    return (state.skills.find(s => s.id === id) || {}).name || '—';
  }

  function renumberFirstCol(tbody) {
    if (!tbody) return;
    Array.from(tbody.rows).forEach((tr, i) => {
      if (tr.children[0]) tr.children[0].textContent = i + 1;
    });
  }

  function renderJobOptions(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    state.jobs.forEach(job => {
      const opt = document.createElement('option');
      opt.value = job.id;
      opt.textContent = job.title;
      selectEl.appendChild(opt);
    });
  }

  function renderSkillOptions(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    state.skills.forEach(skill => {
      const opt = document.createElement('option');
      opt.value = skill.id;
      opt.textContent = skill.name;
      selectEl.appendChild(opt);
    });
  }

  function renderJobsTable() {
    const tbody = byId('tblJobs')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.jobs.forEach(job => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${displayId(job.id)}</td>
        <td>
          <div class="fw-semibold">${job.title}</div>
          <div class="text-muted small">${job.desc || ''}</div>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${job.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${job.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    renumberFirstCol(tbody);
  }

  function renderSkillsTable() {
    const tbody = byId('tblSkills')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.skills.forEach(skill => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${displayId(skill.id)}</td>
        <td>${skill.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${skill.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${skill.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    renumberFirstCol(tbody);
  }

  function renderAssignmentsTable() {
    const tbody = byId('tblAssignments')?.querySelector('tbody');
    if (!tbody) return;
    const q = (byId('searchInput')?.value || '').trim().toLowerCase();
    tbody.innerHTML = '';
    state.assigns
      .filter(a => {
        if (!q) return true;
        const iName = jobTitle(a.jobId).toLowerCase();
        const sName = skillName(a.skillId).toLowerCase();
        return iName.includes(q) || sName.includes(q);
      })
      .forEach(assign => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${displayId(assign.id)}</td>
          <td>${jobTitle(assign.jobId)}</td>
          <td>${skillName(assign.skillId)}</td>
          <td>${assign.proficiency}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${assign.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${assign.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    renumberFirstCol(tbody);
  }

  byId('btnAddJob')?.addEventListener('click', () => {
    byId('jobId').value = '';
    byId('jobTitle').value = '';
    byId('jobDesc').value = '';
    byId('modalJob').querySelector('.modal-title').textContent = 'Add Job Role';
    modalJob?.show();
  });

  byId('formJob')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id    = byId('jobId').value;
    const title = byId('jobTitle').value.trim();
    const desc  = byId('jobDesc').value.trim();
    if (!title) return;

    if (id) {
      const idx = state.jobs.findIndex(j => j.id === Number(id));
      if (idx >= 0) {
        state.jobs[idx].title = title;
        state.jobs[idx].desc  = desc;
      }
    } else {
      state.idCounters.job += 1;
      const newId = state.idCounters.job;
      state.jobs.push({ id: newId, title, desc });
    }
    saveStore(state);
    renderJobsTable();
    renderAssignmentsTable();
    modalJob?.hide();
  });

  byId('tblJobs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {
      const job = state.jobs.find(j => j.id === id);
      if (!job) return;
      byId('jobId').value    = job.id;
      byId('jobTitle').value = job.title;
      byId('jobDesc').value  = job.desc || '';
      byId('modalJob').querySelector('.modal-title').textContent = 'Edit Job Role';
      modalJob?.show();
    }
    if (action === 'del') {
      if (!confirm('Delete this job role?')) return;
      state.jobs = state.jobs.filter(j => j.id !== id);
      saveStore(state);
      renderJobsTable();
      renderAssignmentsTable();
    }
  });

  byId('btnAddSkill')?.addEventListener('click', () => {
    byId('skillId').value = '';
    byId('skillName').value = '';
    byId('skillDesc').value = '';
    byId('modalSkill').querySelector('.modal-title').textContent = 'Add Skill';
    modalSkill?.show();
  });

  byId('formSkill')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id   = byId('skillId').value;
    const name = byId('skillName').value.trim();
    const desc = byId('skillDesc').value.trim();
    if (!name) return;

    if (id) {
      const idx = state.skills.findIndex(s => s.id === Number(id));
      if (idx >= 0) {
        state.skills[idx].name = name;
        state.skills[idx].desc = desc;
      }
    } else {
      state.idCounters.skill += 1;
      const newId = state.idCounters.skill;
      state.skills.push({ id: newId, name, desc });
    }
    saveStore(state);
    renderSkillsTable();
    renderAssignmentsTable();
    modalSkill?.hide();
  });

  byId('tblSkills')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {
      const skill = state.skills.find(s => s.id === id);
      if (!skill) return;
      byId('skillId').value   = skill.id;
      byId('skillName').value = skill.name;
      byId('skillDesc').value = skill.desc || '';
      byId('modalSkill').querySelector('.modal-title').textContent = 'Edit Skill';
      modalSkill?.show();
    }
    if (action === 'del') {
      if (!confirm('Delete this skill?')) return;
      state.skills = state.skills.filter(s => s.id !== id);
      saveStore(state);
      renderSkillsTable();
      renderAssignmentsTable();
    }
  });

  function openAssignModal(editId = null) {
    renderJobOptions(byId('assignJob'));
    renderSkillOptions(byId('assignSkill'));

    byId('assignId').value = '';
    byId('assignProficiency').value = '';
    byId('modalAssign').querySelector('.modal-title').textContent =
      editId ? 'Edit Job ⇄ Skill Assignment' : 'Add Job ⇄ Skill Assignment';

    if (editId) {
      const rec = state.assigns.find(a => a.id === editId);
      if (!rec) return;
      byId('assignJob').value         = rec.jobId;
      byId('assignSkill').value       = rec.skillId;
      byId('assignProficiency').value = rec.proficiency;
      byId('assignId').value          = rec.id;
    }
    modalAssign?.show();
  }

  byId('btnAddAssign')?.addEventListener('click', () => openAssignModal());

  byId('formAssign')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal        = byId('assignId').value;
    const jobId        = Number(byId('assignJob').value);
    const skillId      = Number(byId('assignSkill').value);
    const proficiency  = byId('assignProficiency').value.trim();
    if (!proficiency) return;

    const dup = state.assigns.find(a =>
      a.jobId === jobId &&
      a.skillId === skillId &&
      a.id !== Number(idVal || 0)
    );
    if (dup) {
      alert('This Job ⇄ Skill link already exists.');
      return;
    }

    if (idVal) {
      const idx = state.assigns.findIndex(a => a.id === Number(idVal));
      if (idx >= 0) {
        state.assigns[idx].jobId       = jobId;
        state.assigns[idx].skillId     = skillId;
        state.assigns[idx].proficiency = proficiency;
      }
    } else {
      state.idCounters.assign += 1;
      const newId = state.idCounters.assign;
      state.assigns.push({
        id: newId,
        jobId,
        skillId,
        proficiency
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

  (function init() {
    renderJobsTable();
    renderSkillsTable();
    renderAssignmentsTable();
  })();

  const searchInput = byId('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();

      const jobsTbody = byId('tblJobs')?.querySelector('tbody');
      if (jobsTbody) {
        Array.from(jobsTbody.rows).forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
      }

      const skillsTbody = byId('tblSkills')?.querySelector('tbody');
      if (skillsTbody) {
        Array.from(skillsTbody.rows).forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
      }

      renderAssignmentsTable();
    });
  }

  ['tblJobs','tblSkills','tblAssignments'].forEach(id => {
    const tbody = byId(id)?.querySelector('tbody');
    if (!tbody) return;
    const mo = new MutationObserver(muts => {
      if (muts.some(m => m.type === 'childList')) renumberFirstCol(tbody);
    });
    mo.observe(tbody, { childList: true });
  });
});
