(function () {
  const candidates = {
    lucia: {
      avatar: "LR",
      name: "Lucia Ramos",
      summary: "21 anos - Lima Centro - Disponible de lunes a sabado en horario completo.",
      job: "Asistente de atencion al cliente",
      match: "91%",
      status: "Nuevo postulante",
      tags: ["Atencion al cliente", "Excel basico", "Comunicacion clara"],
      phone: "51999999999",
    },
    jose: {
      avatar: "JM",
      name: "Jose Mamani",
      summary: "20 anos - SJL - Disponible para turno tarde y fines de semana.",
      job: "Mozo junior",
      match: "88%",
      status: "En proceso",
      tags: ["Servicio al cliente", "Puntualidad", "Disponibilidad tarde"],
      phone: "51988888888",
    },
    camila: {
      avatar: "CF",
      name: "Camila Flores",
      summary: "22 anos - Ate - Busca empleo part-time compatible con estudios.",
      job: "Asistente de tienda part-time",
      match: "86%",
      status: "Entrevista",
      tags: ["Caja basica", "Reposicion", "Orden"],
      phone: "51977777777",
    },
    marco: {
      avatar: "MH",
      name: "Marco Huaman",
      summary: "19 anos - La Molina - Interesado en trabajo operativo y almacen.",
      job: "Auxiliar de almacen",
      match: "90%",
      status: "Contratado",
      tags: ["Trabajo operativo", "Orden", "Disponibilidad completa"],
      phone: "51966666666",
    },
    valeria: {
      avatar: "VC",
      name: "Valeria Cruz",
      summary: "23 anos - San Isidro - Buen trato al publico y disponibilidad de manana.",
      job: "Recepcionista junior",
      match: "84%",
      status: "Nuevo postulante",
      tags: ["Trato amable", "Comunicacion telefonica", "Organizacion"],
      phone: "51955555555",
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindCandidateDetails();
    bindCandidateSearch();
    bindMoveToProcess();
    showCandidate("lucia");
  });

  function bindCandidateDetails() {
    document.querySelectorAll("[data-candidate-detail]").forEach((link) => {
      link.addEventListener("click", () => {
        showCandidate(link.dataset.candidateDetail);
      });
    });
  }

  function bindCandidateSearch() {
    const input = document.querySelector("[data-candidate-search]");
    if (!input) return;

    input.addEventListener("input", () => {
      const query = normalize(input.value);
      document.querySelectorAll("[data-candidate]").forEach((row) => {
        const visible = normalize(row.textContent).includes(query);
        row.style.display = visible ? "" : "none";
      });
    });
  }

  function bindMoveToProcess() {
    const button = document.querySelector("[data-move-process]");
    if (!button) return;

    button.addEventListener("click", () => {
      const status = document.querySelector("[data-candidate-status]");
      if (status) status.textContent = "En proceso";
      button.textContent = "Marcado en proceso";
      setTimeout(() => {
        button.textContent = "Mover a proceso";
      }, 1600);
      document.getElementById("proceso")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function showCandidate(key) {
    const candidate = candidates[key] || candidates.lucia;

    setText("[data-candidate-avatar]", candidate.avatar);
    setText("[data-candidate-name]", candidate.name);
    setText("[data-candidate-summary]", candidate.summary);
    setText("[data-candidate-job]", candidate.job);
    setText("[data-candidate-match]", candidate.match);
    setText("[data-candidate-status]", candidate.status);

    const tags = document.querySelector("[data-candidate-tags]");
    if (tags) {
      tags.innerHTML = candidate.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    }

    const whatsapp = document.querySelector("[data-candidate-whatsapp]");
    if (whatsapp) {
      whatsapp.href = `https://wa.me/${candidate.phone}`;
    }
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function normalize(value = "") {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
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
