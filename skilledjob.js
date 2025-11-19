document.addEventListener('DOMContentLoaded', function() {

if (localStorage.getItem('isLoggedIn')=='FALSE'){
  window.location.href="./index.html";
}
function toggleProfileMenu() {
  const profileMenu = document.getElementById('profile-menu');
  profileMenu.classList.toggle('show');
}
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

const tableBody      = document.getElementById('skilledTableBody');
const addEditModal   = document.getElementById('addEditModal');
const addEditTitle   = document.getElementById('addEditTitle');
const jobTitleInput  = document.getElementById('jobTitleInput');
const industryInput  = document.getElementById('industryInput');

const viewOverlay    = document.getElementById('viewOverlay');
const viewDetails    = document.getElementById('viewDetails');
const deleteOverlay  = document.getElementById('deleteOverlay');
const deleteLabel    = document.getElementById('deleteLabel');

let editingRowIndex  = null;
let deleteRowIndex   = null;

function renumberSkilledJobs() {
  if (!tableBody) return;
  [...tableBody.rows].forEach((r, i) => {
    if (r.children[0]) r.children[0].textContent = i + 1;
  });
}

document.getElementById('openAddModalBtn').onclick = () => {
  editingRowIndex = null;
  addEditTitle.textContent = 'Add Skilled Job';
  jobTitleInput.value = '';
  industryInput.value = '';
  addEditModal.style.display = 'flex';
  addEditModal.setAttribute('aria-hidden', 'false');
  jobTitleInput.focus();
};

document.getElementById('cancelAddEditBtn').onclick = () => {
  addEditModal.style.display = 'none';
  addEditModal.setAttribute('aria-hidden', 'true');
};

document.getElementById('saveJobBtn').onclick = () => {
  const title = jobTitleInput.value.trim();
  const industry = industryInput.value.trim();
  if (!title) { jobTitleInput.focus(); return; }

  if (editingRowIndex === null) {
    const newIndex = tableBody.rows.length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${newIndex}</td>
      <td>${title}</td>
      <td>${industry || '-'}</td>
      <td class="action-icons">
        <i class="bi bi-eye-fill icon-view" title="View"></i>
        <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
        <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
      </td>
    `;
    tableBody.appendChild(tr);

    renumberSkilledJobs();

  } else {
    const row = tableBody.rows[editingRowIndex];
    row.children[1].textContent = title;
    row.children[2].textContent = industry || '-';
  }

  addEditModal.style.display = 'none';
  addEditModal.setAttribute('aria-hidden', 'true');
};

document.addEventListener('click', (e) => {
  const iconView   = e.target.closest('.icon-view');
  const iconEdit   = e.target.closest('.icon-edit');
  const iconDelete = e.target.closest('.icon-delete');

  if (iconView) {
    const row = iconView.closest('tr');
    const title    = row.children[1].textContent.trim();
    const industry = row.children[2].textContent.trim();

    viewDetails.innerHTML = `
      <p><b>Job Title:</b><span>${title}</span></p>
      <p><b>Industry:</b><span>${industry}</span></p>
    `;
    viewOverlay.style.display = 'flex';
    viewOverlay.setAttribute('aria-hidden', 'false');
    return;
  }

  if (iconEdit) {
    const row = iconEdit.closest('tr');
    editingRowIndex = row.rowIndex - 1; // tbody index
    addEditTitle.textContent = 'Edit Skilled Job';
    jobTitleInput.value  = row.children[1].textContent.trim();
    const indText        = row.children[2].textContent.trim();
    industryInput.value  = (indText === '-' ? '' : indText);
    addEditModal.style.display = 'flex';
    addEditModal.setAttribute('aria-hidden', 'false');
    jobTitleInput.focus();
    return;
  }

  if (iconDelete) {
    const row = iconDelete.closest('tr');
    deleteRowIndex = row.rowIndex - 1;
    const title = row.children[1].textContent.trim();
    deleteLabel.textContent = `Are you sure you want to delete "${title}"?`;
    deleteOverlay.style.display = 'flex';
    deleteOverlay.setAttribute('aria-hidden', 'false');
    return;
  }
});

document.getElementById('closeView').onclick = () => {
  viewOverlay.style.display = 'none';
  viewOverlay.setAttribute('aria-hidden', 'true');
};

document.getElementById('cancelDeleteBtn').onclick = () => {
  deleteOverlay.style.display = 'none';
  deleteOverlay.setAttribute('aria-hidden', 'true');
  deleteRowIndex = null;
};

document.getElementById('confirmDeleteBtn').onclick = () => {
  if (deleteRowIndex !== null) {
    tableBody.deleteRow(deleteRowIndex);
    [...tableBody.rows].forEach((r, i) => r.children[0].textContent = i + 1);
  }

  renumberSkilledJobs();

  deleteOverlay.style.display = 'none';
  deleteOverlay.setAttribute('aria-hidden', 'true');
  deleteRowIndex = null;
};

window.addEventListener('click', (e) => {
  if (e.target === addEditModal) {
    addEditModal.style.display = 'none';
    addEditModal.setAttribute('aria-hidden', 'true');
  }
  if (e.target === viewOverlay) {
    viewOverlay.style.display = 'none';
    viewOverlay.setAttribute('aria-hidden', 'true');
  }
  if (e.target === deleteOverlay) {
    deleteOverlay.style.display = 'none';
    deleteOverlay.setAttribute('aria-hidden', 'true');
    deleteRowIndex = null;
  }
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  [...tableBody.rows].forEach(row => {
    const title    = row.children[1].textContent.toLowerCase();
    const industry = row.children[2].textContent.toLowerCase();
    row.style.display = (title.includes(q) || industry.includes(q)) ? '' : 'none';
  });
});


renumberSkilledJobs();

});

