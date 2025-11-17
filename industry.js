if (localStorage.getItem('isLoggedIn')=='FALSE'){
  window.location.href="./index.html";
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

    function toggleProfileMenu() {
      const profileMenu = document.getElementById('profile-menu');
      profileMenu.classList.toggle('show');
    }

    const qs  = (s, d=document) => d.querySelector(s);
    const qsa = (s, d=document) => Array.from(d.querySelectorAll(s));

    const addModal    = qs("#addIndustryModal");
    const editModal   = qs("#editIndustryModal");
    const viewOverlay = qs("#viewOverlay");
    const viewDetails = qs("#viewDetails");
    const deleteOverlay = qs("#deleteOverlay");
    const tableBody   = qs("#industryTableBody");

    function show(el){ el.style.display = "flex"; el.setAttribute("aria-hidden","false"); }
    function hide(el){ el.style.display = "none"; el.setAttribute("aria-hidden","true"); }

    qs("#openAddModalBtn").onclick = () => show(addModal);

    qsa(".btn-cancel[data-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetSelector = btn.getAttribute("data-close");
        const target = qs(targetSelector);
        if (target) hide(target);
      });
    });

    qs("#saveIndustryBtn").onclick = () => {
      const name = qs("#addIndustryName").value.trim();
      const desc = qs("#addIndustryDesc").value.trim();
      if(!name){
        qs("#addIndustryName").focus();
        return;
      }
      addRow({ name, desc });
      qs("#addIndustryName").value = "";
      qs("#addIndustryDesc").value = "";
      hide(addModal);
    };

    function addRow({name, desc}) {
      const rowCount = tableBody.querySelectorAll("tr").length + 1;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rowCount}</td>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(desc)}</td>
        <td class="action-icons">
          <i class="bi bi-eye-fill icon-view" title="View"></i>
          <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
          <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
        </td>
      `;
      tableBody.appendChild(tr);
    }

    let rowToEdit   = null;
    let rowToDelete = null;

    document.addEventListener("click", e => {
      const iconView   = e.target.closest(".icon-view");
      const iconEdit   = e.target.closest(".icon-edit");
      const iconDelete = e.target.closest(".icon-delete");

      if (iconView) {
        const row  = iconView.closest("tr");
        const name = row.children[1].innerText;
        const desc = row.children[2].innerText || "—";

        viewDetails.innerHTML = `
          <p><b>Industry Name:</b><span>${name}</span></p>
          <p><b>Description:</b><span>${desc}</span></p>
        `;
        show(viewOverlay);
      }

      if (iconEdit) {
        const row = iconEdit.closest("tr");
        rowToEdit = row;

        qs("#editIndustryName").value = row.children[1].innerText;
        qs("#editIndustryDesc").value = row.children[2].innerText;

        show(editModal);
      }

      if (iconDelete) {
        const row  = iconDelete.closest("tr");
        rowToDelete = row;

        const name = row.children[1].innerText;
        qs("#deleteIndustryText").textContent =
          `Are you sure you want to delete "${name}"?`;

        show(deleteOverlay);
      }
    });

    qs("#updateIndustryBtn").onclick = () => {
      if (!rowToEdit) return;

      const newName = qs("#editIndustryName").value.trim();
      const newDesc = qs("#editIndustryDesc").value.trim();

      if (newName) {
        rowToEdit.children[1].innerText = newName;
      }
      rowToEdit.children[2].innerText = newDesc;

      hide(editModal);
      rowToEdit = null;
    };

    const cancelDeleteBtn  = qs("#cancelDeleteBtn");
    const confirmDeleteBtn = qs("#confirmDeleteBtn");

    cancelDeleteBtn.onclick = () => {
      hide(deleteOverlay);
      rowToDelete = null;
    };

    confirmDeleteBtn.onclick = () => {
      if (rowToDelete) {
        const tbody = rowToDelete.parentElement;
        tbody.removeChild(rowToDelete);
        renumberRows();
      }
      hide(deleteOverlay);
      rowToDelete = null;
    };

    qs("#closeView").onclick = () => hide(viewOverlay);

    window.addEventListener("click", (e) => {
      if (e.target === viewOverlay)    hide(viewOverlay);
      if (e.target === deleteOverlay)  hide(deleteOverlay);
      if (e.target === addModal)       hide(addModal);
      if (e.target === editModal)      hide(editModal);
    });

    qs("#searchInput").addEventListener("keyup", (e) => {
      const q = e.target.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });

    function renumberRows() {
      Array.from(tableBody.rows).forEach((tr, i) => {
        tr.children[0].innerText = i + 1;
      });
    }

    function escapeHtml(str = "") {
      return str
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }