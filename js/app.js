const STORAGE_KEY = "contenido-50-clases-progress";

function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getCompletedCount(progress) {
  return Object.values(progress).filter(Boolean).length;
}

function renderClasses() {
  const progress = loadProgress();
  const grid = document.getElementById("classes-grid");
  const completed = getCompletedCount(progress);
  const total = CLASSES.length;
  const percent = Math.round((completed / total) * 100);

  document.getElementById("progress-bar-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent = `${completed} / ${total} clases completadas (${percent}%)`;

  grid.innerHTML = "";

  CLASSES.forEach((cls) => {
    const isDone = !!progress[cls.id];
    const hasContent = cls.objetivo || cls.teoria.length > 0 || cls.ejercicios.length > 0;

    const card = document.createElement("div");
    card.className = "class-card" + (isDone ? " done" : "") + (hasContent ? " clickable" : "");

    card.innerHTML = `
      <div class="card-number">${cls.id}</div>
      <div class="card-info">
        <span class="card-aula">${cls.aula}</span>
        <h3 class="card-title">${cls.title}</h3>
      </div>
      <button class="toggle-btn" data-id="${cls.id}" title="${isDone ? "Marcar como pendiente" : "Marcar como completada"}">
        ${isDone ? "&#10003;" : "&#9675;"}
      </button>
    `;

    if (hasContent) {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".toggle-btn")) openModal(cls);
      });
    }

    card.querySelector(".toggle-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const p = loadProgress();
      p[cls.id] = !p[cls.id];
      saveProgress(p);
      renderClasses();
    });

    grid.appendChild(card);
  });
}

function nl2br(text) {
  return text.replace(/\n/g, "<br>");
}

function openModal(cls) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  let html = `
    <div class="modal-aula">${cls.aula}</div>
    <h2 class="modal-title">${cls.title}</h2>
  `;

  if (cls.objetivo) {
    html += `
      <div class="modal-section">
        <h4 class="section-label objetivo-label">Objetivo</h4>
        <p>${cls.objetivo}</p>
      </div>
    `;
  }

  if (cls.teoria && cls.teoria.length > 0) {
    html += `<div class="modal-section"><h4 class="section-label">Contenido Teórico</h4>`;
    cls.teoria.forEach((item) => {
      html += `
        <div class="teoria-block">
          <h5 class="teoria-subtitle">${item.subtitle}</h5>
          <p>${nl2br(item.text)}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (cls.ejercicios && cls.ejercicios.length > 0) {
    html += `<div class="modal-section"><h4 class="section-label ejercicios-label">Ejercicios Prácticos</h4>`;
    cls.ejercicios.forEach((ej) => {
      html += `
        <div class="ejercicio-block">
          <h5 class="ejercicio-title">${ej.title}</h5>
          <p>${nl2br(ej.text)}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (cls.dica) {
    html += `
      <div class="modal-section dica-section">
        <h4 class="section-label dica-label">Dica Pedagógica</h4>
        <p>${cls.dica}</p>
      </div>
    `;
  }

  body.innerHTML = html;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
}

function openConfirm() {
  document.getElementById("confirm-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeConfirm() {
  document.getElementById("confirm-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  renderClasses();

  document.getElementById("reset-btn").addEventListener("click", openConfirm);

  document.getElementById("confirm-cancel").addEventListener("click", closeConfirm);
  document.getElementById("confirm-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("confirm-overlay")) closeConfirm();
  });
  document.getElementById("confirm-ok").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderClasses();
    closeConfirm();
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeConfirm();
    }
  });
});
