(function () {
  const stateLabels = {
    enviada: "Enviada",
    en_revision: "Vista",
    entrevista: "Entrevista",
    rechazada: "Descartada",
    aceptada: "Contratado",
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderVacantes();
    renderPostulaciones();
  });

  async function getResource(resource) {
    const response = await fetch(`/.netlify/functions/supabase?resource=${resource}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo cargar la informacion.");
    }

    return payload.data || [];
  }

  async function renderVacantes() {
    const panel = document.querySelector("[data-supabase-vacantes]");
    const counter = document.querySelector("[data-supabase-vacantes-count]");

    if (!panel) return;

    try {
      const vacantes = await getResource("vacantes");

      if (counter) {
        counter.textContent = `${vacantes.length} empleos desde Supabase`;
      }

      if (!vacantes.length) {
        panel.innerHTML = `<p class="page-lead">No hay vacantes activas registradas en Supabase.</p>`;
        return;
      }

      panel.innerHTML = vacantes.map(vacanteCard).join("");
    } catch (error) {
      if (counter) {
        counter.textContent = "Datos demo locales";
      }
      console.warn(error);
    }
  }

  async function renderPostulaciones() {
    const panel = document.querySelector("[data-supabase-postulaciones]");
    const counter = document.querySelector("[data-supabase-postulaciones-count]");

    if (!panel) return;

    try {
      const postulaciones = await getResource("postulaciones");

      if (counter) {
        counter.textContent = String(postulaciones.length);
      }

      if (!postulaciones.length) {
        panel.innerHTML = `<p class="page-lead">Aun no hay postulaciones registradas en Supabase.</p>`;
        return;
      }

      panel.innerHTML = postulaciones.map(postulacionCard).join("");
    } catch (error) {
      console.warn(error);
    }
  }

  function vacanteCard(vacante, index) {
    const empresa = vacante.empresas?.nombre || "Empresa WorkBridge";
    const inicial = (empresa[0] || "W").toUpperCase();
    const requisitos = Array.isArray(vacante.requisitos) ? vacante.requisitos : [];
    const badge = requisitos[0] || "Sin experiencia";
    const iconClass = index % 2 === 0 ? "job-icon cyan" : "job-icon";

    return `
      <a class="resultado-card" href="detalle_empleo.html?id=${encodeURIComponent(vacante.id)}" aria-label="Ver detalle de ${escapeHtml(vacante.titulo)}">
        <div class="${iconClass}">${escapeHtml(inicial)}</div>
        <div class="resultado-info">
          <strong>${escapeHtml(vacante.titulo)}</strong>
          <span>${escapeHtml(empresa)} - ${escapeHtml(vacante.ubicacion)}</span>
          <span>${escapeHtml(vacante.modalidad)} - ${escapeHtml(vacante.salario || "Sueldo a tratar")}</span>
        </div>
        <span class="badge">${escapeHtml(badge)}</span>
        <span class="resultado-accion">Ver detalle -></span>
      </a>
    `;
  }

  function postulacionCard(postulacion, index) {
    const vacante = postulacion.vacantes || {};
    const empresa = vacante.empresas?.nombre || "Empresa WorkBridge";
    const estado = stateLabels[postulacion.estado] || "Enviada";
    const statusClass = getStatusClass(postulacion.estado, index);
    const fecha = formatDate(postulacion.creado_en);

    return `
      <article class="application-card ${index === 0 ? "featured" : ""}">
        <div class="application-head">
          <span class="status ${statusClass}">${escapeHtml(estado)}</span>
          <small>${escapeHtml(fecha)}</small>
        </div>
        <h3>${escapeHtml(vacante.titulo || "Vacante WorkBridge")}</h3>
        <p>${escapeHtml(empresa)} - ${escapeHtml(vacante.ubicacion || "Lima")}</p>
        <ul>
          <li>${escapeHtml(vacante.modalidad || "Modalidad por definir")}</li>
          <li>${escapeHtml(vacante.salario || "Sueldo a tratar")}</li>
          <li>${escapeHtml(postulacion.mensaje || "Postulacion registrada en Supabase")}</li>
        </ul>
        <a class="btn btn-secondary" href="status_postulacion.html">Ver estado</a>
      </article>
    `;
  }

  function getStatusClass(status, index) {
    if (status === "entrevista") return "process";
    if (status === "en_revision") return "live";
    if (status === "rechazada") return "paused";
    if (status === "aceptada") return "live";
    return index === 0 ? "process" : "new";
  }

  function formatDate(value) {
    if (!value) return "Hoy";
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
