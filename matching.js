    const $  = (s, c=document) => c.querySelector(s);
    const $$ = (s, c=document) => [...c.querySelectorAll(s)];

    const addOverlay    = $("#addOverlay");
    const viewOverlay   = $("#viewOverlay");
    const deleteOverlay = $("#deleteOverlay");

    const addModalBox = $("#addModalBox");

    const btnNewMatch   = $("#btnNewMatch");
    const cancelAdd     = $("#cancelAdd");
    const closeView     = $("#closeView");
    const cancelDelete  = $("#cancelDelete");
    const confirmDelete = $("#confirmDelete");

    const tableBody     = $("#tableBody");
    const form          = $("#addMatchForm");
    const formTitle     = $("#formTitle");
    const editIndex     = $("#editIndex");
    const applicant     = $("#applicant");
    const appliedJob    = $("#appliedJob");
    const vacancy       = $("#vacancy");
    const establishment = $("#establishment");
    const score         = $("#score");


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


    const open  = (ov) => { ov.style.display = "flex"; ov.setAttribute("aria-hidden", "false"); };
    const close = (ov) => { ov.style.display = "none"; ov.setAttribute("aria-hidden", "true"); };

    let deleteRow = null;

    btnNewMatch.addEventListener("click", () => {
      form.reset();
      editIndex.value = "";
      formTitle.textContent = "➕ New Match";
      addModalBox.classList.remove("edit-modal");
      addModalBox.classList.add("new-modal");
      open(addOverlay);
    });
    cancelAdd.addEventListener("click", () => close(addOverlay));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

      const cells = `
        <td></td>
        <td>${applicant.value}</td>
        <td>${appliedJob.value}</td>
        <td>${vacancy.value}</td>
        <td>${establishment.value}</td>
        <td>${score.value}</td>
        <td><span class="badge pending">Pending</span></td>
        <td>${date}</td>
        <td class="action-icons">
          <i class="bi bi-eye-fill icon-view" title="View"></i>
          <i class="bi bi-pencil-square icon-edit" title="Edit"></i>
          <i class="bi bi-check2-square icon-accept" title="Accept"></i>
          <i class="bi bi-x-square icon-reject" title="Reject"></i>
          <i class="bi bi-trash3-fill icon-delete" title="Delete"></i>
        </td>`;

      if (editIndex.value !== "") {
        const row = tableBody.rows[parseInt(editIndex.value, 10)];
        row.innerHTML = cells;
      } else {
        const tr = document.createElement("tr");
        tr.innerHTML = cells;
        tableBody.appendChild(tr);
      }

   
      [...tableBody.rows].forEach((r, i) => r.cells[0].textContent = i + 1);

      close(addOverlay);
      form.reset();
      editIndex.value = "";
    });

    document.addEventListener("click", (e) => {
     
      if (e.target.classList.contains("icon-view")) {
        const row = e.target.closest("tr");
        const c = row.cells;
        const pairs = [
          ["Applicant:", c[1].innerText],
          ["Applied Job:", c[2].innerText],
          ["Matched Vacancy:", c[3].innerText],
          ["Establishment:", c[4].innerText],
          ["Score:", c[5].innerText],
          ["Status:", c[6].innerText],
          ["Date:", c[7].innerText],
        ];
        $("#viewDetails").innerHTML = pairs.map(([l,v]) =>
          `<p><b>${l}</b><span>${v}</span></p>`).join("");
        open(viewOverlay);
      }

      if (e.target.classList.contains("icon-edit")) {
        const row = e.target.closest("tr");
        const c = row.cells;
        applicant.value     = c[1].innerText;
        appliedJob.value    = c[2].innerText;
        vacancy.value       = c[3].innerText;
        establishment.value = c[4].innerText;
        score.value         = c[5].innerText;
        editIndex.value     = row.rowIndex - 1; 
        formTitle.textContent = "✏️ Edit Match";
        addModalBox.classList.remove("new-modal");
        addModalBox.classList.add("edit-modal");
        open(addOverlay);
      }

      if (e.target.classList.contains("icon-accept")) {
        const badge = e.target.closest("tr").querySelector(".badge");
        badge.textContent = "Matched";
        badge.className = "badge active";
      }

      if (e.target.classList.contains("icon-reject")) {
        const badge = e.target.closest("tr").querySelector(".badge");
        badge.textContent = "Rejected";
        badge.className = "badge inactive";
      }

      if (e.target.classList.contains("icon-delete")) {
        deleteRow = e.target.closest("tr");
        open(deleteOverlay);
      }
    });


    closeView.addEventListener("click", () => close(viewOverlay));
    cancelDelete.addEventListener("click", () => close(deleteOverlay));
    confirmDelete.addEventListener("click", () => {
      if (deleteRow) {
        deleteRow.remove();
        deleteRow = null;
        [...tableBody.rows].forEach((r, i) => r.cells[0].textContent = i + 1);
      }
      close(deleteOverlay);
    });

    
    $("#searchInput").addEventListener("keyup", (e) => {
      const q = e.target.value.toLowerCase();
      [...tableBody.rows].forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
      });
    });

    
    const runBtn = $("#runMatching");
    const runText = $("#runText");
    const spinner = $("#spinner");
    runBtn.addEventListener("click", () => {
      runBtn.disabled = true;
      spinner.style.display = "inline-block";
      runText.textContent = "Running...";
      setTimeout(() => {
        spinner.style.display = "none";
        runText.textContent = "Run Matching";
        runBtn.disabled = false;
        alert("✅ Matching simulation complete! New potential matches found.");
      }, 1200);
    });

   
    $$(".toggle-menu").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const submenu = btn.nextElementSibling;
        $$(".submenu").forEach(list => { if (list !== submenu) list.classList.remove("show"); });
        submenu.classList.toggle("show");
      });
    });

   
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("skl-overlay")) {
        e.target.style.display = "none";
      }
    });
