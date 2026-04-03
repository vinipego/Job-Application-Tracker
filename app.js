"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("application-form");
  const tbody = document.getElementById("applications-body");
  const emptyState = document.getElementById("empty-state");
  const submitBtn = document.getElementById("submit-btn");
  let apps = [];
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
    };

    if (editingId !== null) {
      apps = apps.map((app) => {
        if (app.id === editingId) {
          return {
            id: app.id,
            company,
            position,
            dateApplied,
          };
        }
        return app;
      });
      stopEditing();
    } else {
      apps.push(newApp);
      form.reset();
    }
    render();
  });

  tbody.addEventListener("click", function (e) {
    const action = e.target.dataset.action;

    if (!action) return;

    if (action === "delete") {
      const row = e.target.closest("tr");
      const id = row.dataset.id;

      // make pop up confirmation better in the future. For now, it works.
      const confirmed = confirm(
        "Are you sure you want to delete this application?",
      );
      if (!confirmed) return;
      apps = apps.filter(function (app) {
        return app.id !== id;
      });
      render();
      console.log("Delete ID: ", id);
    }

    if (action === "edit") {
      const row = e.target.closest("tr");
      const id = row.dataset.id;


      const appToEdit = apps.find(function (app) {
        return app.id === id;
      });

      if (!appToEdit) return;
      
      editingId = id;
      startEditing(appToEdit);
    }
  });

  function makeId() {
    return Date.now().toString();
  }

  function render() {
    tbody.innerHTML = "";

    console.log("Rendering apps:", apps);
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
            <td>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
            </td>
        `;
      tbody.appendChild(row);
    });
  }

  function startEditing(app){
    form.company.value = app.company;
    form.position.value = app.position;
    form.dateApplied.value = app.dateApplied;
    submitBtn.textContent = "Edit";
  }

  function stopEditing(){
    editingId = null;
    submitBtn.textContent = "Add Application"
    form.reset();
  }
  render();
});
