"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("application-form");
  const tbody = document.getElementById("applications-body");
  const emptyState = document.getElementById("empty-state");
  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  let apps = loadApps();
  let editingId = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const company = form.company.value.trim();
    const position = form.position.value.trim();
    const dateApplied = form.dateApplied.value;
    const status = form.status.value;
    const newApp = {
      id: makeId(),
      company,
      position,
      dateApplied,
      status,
    };

    if (editingId !== null) {
      apps = apps.map((app) => {
        if (app.id === editingId) {
          return {
            id: app.id,
            company,
            position,
            dateApplied,
            status,
          };
        }
        return app;
      });
      stopEditing();
    } else {
      apps.push(newApp);
      resetFormToDefaults();
    }
    saveApps();
    render();
  });

  cancelBtn.addEventListener("click", (e) => {
    stopEditing();
  });

  tbody.addEventListener("click", function (e) {
    const action = e.target.dataset.action;
    if (!action) return;
    const row = e.target.closest("tr");

    if (action === "delete") {
      const rowId = row.dataset.id;

      // make pop up confirmation better in the future. For now, it works.
      const confirmed = confirm(
        "Are you sure you want to delete this application?",
      );
      if (!confirmed) return;
      apps = apps.filter(function (app) {
        return app.id !== rowId;
      });
      saveApps();
      render();
    }

    if (action === "edit") {
      const rowId = row.dataset.id;

      const appToEdit = apps.find(function (app) {
        return app.id === rowId;
      });

      if (!appToEdit) return;

      editingId = rowId;
      startEditing(appToEdit);
    }
  });

  function makeId() {
    return Date.now().toString();
  }

  function render() {
    tbody.innerHTML = "";

    if (apps.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    apps.forEach(function (app) {
      const row = document.createElement("tr");
      row.dataset.id = app.id;

      row.innerHTML = `
            <td>${app.company}</td>
            <td>${app.position}</td>
            <td>${app.dateApplied}</td>
            <td>${app.status}</td>
            <td>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
            </td>
        `;
      tbody.appendChild(row);
    });
  }

  function startEditing(app) {
    cancelBtn.hidden = false;
    form.company.value = app.company;
    form.position.value = app.position;
    form.dateApplied.value = app.dateApplied;
    form.status.value = app.status;
    submitBtn.textContent = "Save Changes";
  }

  function stopEditing() {
    editingId = null;
    resetFormToDefaults();
  }

  function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    form.dateApplied.value = `${year}-${month}-${day}`;
  }

  function resetFormToDefaults() {
    cancelBtn.hidden = true;
    form.reset();
    setTodayDate();
    form.status.value = "Applied";
    submitBtn.textContent = "Add Application";
  }

  function saveApps() {
    localStorage.setItem("apps", JSON.stringify(apps));
  }

  function loadApps(){
    const stored = localStorage.getItem("apps");
    if (!stored) return [];
    return JSON.parse(stored);
  }

  setTodayDate();
  render();
});
