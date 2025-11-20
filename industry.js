if (localStorage.getItem('isLoggedIn') == 'FALSE') {
  window.location.href = "./index.html";
}

document.addEventListener('DOMContentLoaded', () => {
  const byId = (id) => document.getElementById(id);

  // Profile menu
  function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('show');
  }
  window.toggleProfileMenu = toggleProfileMenu;

  // ===== NAV: keep submenu with active item open; close others
  (function initializeSubmenusByActive() {
    const allSubmenus = document.querySelectorAll('.submenu');
    let openedByActive = false;

    allSubmenus.forEach(sub => {
      const hasActive = sub.querySelector('.submenu-item.active');
      if (hasActive) {
        sub.classList.add('show');
        openedByActive = true;
      } else {
        sub.classList.remove('show');
      }
    });

    // If none had active (fallback), keep existing HTML default classes
    if (!openedByActive) {
      // do nothing
    }
  })();

  // Toggle behavior for top-level entries
  document.querySelectorAll('.toggle-menu').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const mySubmenu = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.submenu').forEach(list => {
        if (list !== mySubmenu) list.classList.remove('show');
      });

      // Toggle mine
      if (mySubmenu) mySubmenu.classList.toggle('show');
    });
  });

  // ====== App state (unchanged core logic) ======
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
  const modalJob      = window.bootstrap ? new bootstrap.Modal(byId('modalJob'))      : null;
  const modalAssign   = window.bootstrap ? new bootstrap.Modal(byId('modalAssign'))   : null;

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

  function renderIndustryOptions(selectEl, withEmpty = true) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    if (withEmpty) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '— None —';
      selectEl.appendChild(opt);
    }
    state.industries.forEach(ind => {
      const opt = document.createElement('option');
      opt.value = ind.id;
      opt.textContent = `${ind.name}`;
      selectEl.appendChild(opt);
    });
  }

  function renderJobOptions(selectEl, filterIndustryId = null) {
    if (!selectEl) return;
    selectEl.innerHTML = '';

    if (!state.jobs.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No jobs available';
      selectEl.appendChild(opt);
      return;
    }

    const preferred = [];
    const others = [];

    state.jobs.forEach(job => {
      if (filterIndustryId && job.industryId === Number(filterIndustryId)) preferred.push(job);
      else others.push(job);
    });

    const ordered = [...preferred, ...others];

    ordered.forEach(job => {
      const opt = document.createElement('option');
      opt.value = job.id;
      const indName = job.industryId ? industryName(job.industryId) : 'No industry';
      opt.textContent = `${job.title} (${indName})`;
      selectEl.appendChild(opt);
    });
  }

  function renderIndustriesTable() {
    const tbody = byId('tblIndustries')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.industries.forEach(ind => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ind.id}</td>
        <td>
          <div class="fw-semibold">${ind.name}</div>
          <div class="text-muted small">${ind.desc || ''}</div>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${ind.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${ind.id}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    renumberFirstCol(tbody);
  }

  function renderJobsTable() {
    const tbody = byId('tblJobs')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.jobs.forEach(job => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${job.id}</td>
        <td>
          <div class="fw-semibold">${job.title}</div>
          <div class="text-muted small">${job.desc || ''}</div>
        </td>
        <td class="d-none d-lg-table-cell">
          ${job.industryId ? industryName(job.industryId) : '<span class="text-muted">—</span>'}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-light me-1" data-action="edit" data-id="${job.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-light text-danger" data-action="del" data-id="${job.id}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    renumberFirstCol(tbody);
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

  byId('formIndustry')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = byId('industryId').value;
    const name = byId('industryName').value.trim();
    if (!name) return;
    const desc = byId('industryDesc').value.trim();

    if (id) {
      const idx = state.industries.findIndex(i => i.id === Number(id));
      if (idx >= 0) {
        state.industries[idx].name = name;
        state.industries[idx].desc = desc;
      }
    } else {
      state.idCounters.industry += 1;
      state.industries.push({ id: state.idCounters.industry, name, desc });
    }
    saveStore(state);
    renderIndustryOptions(byId('jobIndustry'));
    renderIndustryOptions(byId('assignIndustry'), false);
    renderIndustriesTable();
    renderAssignmentsTable();
    modalIndustry?.hide();
  });

  byId('tblIndustries')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {
      const ind = state.industries.find(i => i.id === id);
      if (!ind) return;
      byId('industryId').value = ind.id;
      byId('industryName').value = ind.name;
      byId('industryDesc').value = ind.desc || '';
      byId('modalIndustry').querySelector('.modal-title').textContent = 'Edit Industry';
      modalIndustry?.show();
    }
    if (action === 'del') {
      if (!confirm('Delete this industry? Related jobs/assignments will remain but may be orphaned.')) return;
      state.industries = state.industries.filter(i => i.id !== id);
      saveStore(state);
      renderIndustryOptions(byId('jobIndustry'));
      renderIndustryOptions(byId('assignIndustry'), false);
      renderIndustriesTable();
      renderJobsTable();
      renderAssignmentsTable();
    }
  });

  byId('btnAddJob')?.addEventListener('click', () => {
    byId('jobId').value = '';
    byId('jobTitle').value = '';
    byId('jobDesc').value = '';
    renderIndustryOptions(byId('jobIndustry'), true);
    byId('modalJob').querySelector('.modal-title').textContent = 'Add Job Role';
    modalJob?.show();
  });

  byId('formJob')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = byId('jobId').value;
    const title = byId('jobTitle').value.trim();
    if (!title) return;
    const desc = byId('jobDesc').value.trim();
    const indVal = byId('jobIndustry').value;
    const industryId = indVal ? Number(indVal) : null;

    if (id) {
      const idx = state.jobs.findIndex(j => j.id === Number(id));
      if (idx >= 0) {
        state.jobs[idx].title = title;
        state.jobs[idx].desc = desc;
        state.jobs[idx].industryId = industryId;
      }
    } else {
      state.idCounters.job += 1;
      state.jobs.push({ id: state.idCounters.job, title, desc, industryId });
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
      byId('jobId').value = job.id;
      byId('jobTitle').value = job.title;
      byId('jobDesc').value = job.desc || '';
      renderIndustryOptions(byId('jobIndustry'), true);
      byId('jobIndustry').value = job.industryId || '';
      byId('modalJob').querySelector('.modal-title').textContent = 'Edit Job Role';
      modalJob?.show();
    }
    if (action === 'del') {
      if (!confirm('Delete this job role? Related assignments will remain but may be orphaned.')) return;
      state.jobs = state.jobs.filter(j => j.id !== id);
      saveStore(state);
      renderJobsTable();
      renderAssignmentsTable();
    }
  });

  function openAssignModal(editId = null) {
    renderIndustryOptions(byId('assignIndustry'), false);
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

  // Init
  (function init() {
    renderIndustriesTable();
    renderJobsTable();
    renderIndustryOptions(byId('jobIndustry'), true);
    renderIndustryOptions(byId('assignIndustry'), false);
    renderAssignmentsTable();
  })();

  // Auto-renumber on tbody changes
  ['tblIndustries','tblJobs','tblAssignments'].forEach(id => {
    const tbody = byId(id)?.querySelector('tbody');
    if (!tbody) return;
    const mo = new MutationObserver(muts => {
      if (muts.some(m => m.type === 'childList')) renumberFirstCol(tbody);
    });
    mo.observe(tbody, { childList: true });
  });
});
