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

  // Update progress bar
  document.getElementById("progress-bar-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent = `${completed} / ${total} clases completadas (${percent}%)`;

  grid.innerHTML = "";

  CLASSES.forEach((cls) => {
    const isDone = !!progress[cls.id];

    const card = document.createElement("div");
    card.className = "class-card" + (isDone ? " done" : "");

    card.innerHTML = `
      <div class="card-number">${cls.id}</div>
      <div class="card-info">
        <h3 class="card-title">${cls.title}</h3>
        ${cls.description ? `<p class="card-desc">${cls.description}</p>` : ""}
      </div>
      <button class="toggle-btn" data-id="${cls.id}" title="${isDone ? "Marcar como pendiente" : "Marcar como completada"}">
        ${isDone ? "&#10003;" : "&#9675;"}
      </button>
    `;

    card.querySelector(".toggle-btn").addEventListener("click", () => {
      const p = loadProgress();
      p[cls.id] = !p[cls.id];
      saveProgress(p);
      renderClasses();
    });

    grid.appendChild(card);
  });
}

function resetProgress() {
  if (confirm("¿Seguro que quieres reiniciar todo el progreso?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderClasses();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderClasses();
  document.getElementById("reset-btn").addEventListener("click", resetProgress);
});
