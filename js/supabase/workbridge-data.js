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
    renderDetalleVacante();
    renderPostulaciones();
    renderGuardados();
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

  async function renderGuardados() {
    const panel = document.querySelector("[data-supabase-guardados]");
    const counter = document.querySelector("[data-supabase-guardados-count]");

    if (!panel) return;

    try {
      const guardados = await getResource("guardados");

      if (counter) {
        counter.textContent = `${guardados.length} guardados`;
      }

      if (!guardados.length) {
        panel.innerHTML = `<p class="page-lead">Aun no tienes empleos guardados desde Supabase.</p>`;
        return;
      }

      panel.innerHTML = guardados.map(guardadoCard).join("");
    } catch (error) {
      console.warn(error);
    }
  }

  async function renderDetalleVacante() {
    const detailRoot = document.querySelector("[data-supabase-detalle]");

    if (!detailRoot) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {
      let vacante = null;

      if (id && window.location.protocol !== "file:") {
        const response = await fetch(`/.netlify/functions/supabase?resource=detalleVacante&id=${encodeURIComponent(id)}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "No se pudo cargar el detalle.");
        }

        vacante = payload.data?.[0] || null;
      }

      hydrateDetalle(vacante || getDemoVacante(params.get("demo") || id));
    } catch (error) {
      console.warn(error);
      hydrateDetalle(getDemoVacante());
    }
  }

  function hydrateDetalle(vacante) {
    if (!vacante) return;

    const empresa = vacante.empresas || {};
    const empresaNombre = empresa.nombre || "Empresa WorkBridge";
    const empresaIniciales = empresaNombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const requisitos = Array.isArray(vacante.requisitos) ? vacante.requisitos : [];

    setText("[data-detalle-titulo]", vacante.titulo);
    setText("[data-detalle-empresa]", `${empresaNombre} - ${vacante.ubicacion}, Lima`);
    setText("[data-detalle-sueldo]", vacante.salario || "Sueldo a tratar");
    setText("[data-detalle-horario]", getHorario(vacante.titulo));
    setText("[data-detalle-jornada]", vacante.modalidad || "Modalidad por definir");
    setText("[data-detalle-experiencia]", requisitos.some((item) => item.toLowerCase().includes("experiencia")) ? "No requerida" : "Inicial");
    setText("[data-detalle-descripcion]", vacante.descripcion);
    setText("[data-detalle-empresa-nombre]", empresaNombre);
    setText("[data-detalle-empresa-avatar]", empresaIniciales || "WB");
    setText("[data-detalle-empresa-descripcion]", empresa.descripcion || "Empresa verificada dentro de WorkBridge con oportunidades para jovenes talentos.");

    const requisitosList = document.querySelector("[data-detalle-requisitos]");
    if (requisitosList) {
      requisitosList.innerHTML = requisitos.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    const postular = document.querySelector("[data-detalle-postular]");
    if (postular) {
      postular.setAttribute("aria-label", `Postular a ${vacante.titulo}`);
      postular.href = `mis_postulaciones.html?vacante=${encodeURIComponent(vacante.id || vacante.titulo)}`;
      postular.addEventListener("click", (event) => {
        event.preventDefault();
        runVacanteAction("postular", vacante.id, postular, "mis_postulaciones.html");
      });
    }

    const guardar = document.querySelector("[data-detalle-guardar]");
    if (guardar) {
      guardar.setAttribute("aria-label", `Guardar ${vacante.titulo}`);
      guardar.href = `guardados.html?vacante=${encodeURIComponent(vacante.id || vacante.titulo)}`;
      guardar.addEventListener("click", (event) => {
        event.preventDefault();
        runVacanteAction("guardar", vacante.id, guardar, "guardados.html");
      });
    }

    document.title = `WorkBridge - ${vacante.titulo} - ${empresaNombre}`;
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

  function guardadoCard(guardado, index) {
    const vacante = guardado.vacantes || {};
    const empresa = vacante.empresas?.nombre || "Empresa WorkBridge";
    const requisitos = Array.isArray(vacante.requisitos) ? vacante.requisitos : [];
    const badge = requisitos[0] || "Guardado";
    const iconClass = index % 2 === 0 ? "job-icon cyan" : "job-icon";
    const inicial = (empresa[0] || "W").toUpperCase();

    return `
      <article class="guardado-card">
        <div class="${iconClass}">${escapeHtml(inicial)}</div>
        <div class="guardado-info">
          <strong>${escapeHtml(vacante.titulo || "Vacante WorkBridge")}</strong>
          <span>${escapeHtml(empresa)} - ${escapeHtml(vacante.ubicacion || "Lima")}</span>
          <span>${escapeHtml(vacante.modalidad || "Modalidad por definir")} - ${escapeHtml(vacante.salario || "Sueldo a tratar")}</span>
        </div>
        <div class="guardado-acciones">
          <span class="badge">${escapeHtml(badge)}</span>
          <a class="btn btn-secondary" href="detalle_empleo.html?id=${encodeURIComponent(vacante.id || "")}">Ver detalle</a>
        </div>
      </article>
    `;
  }

  async function runVacanteAction(action, vacanteId, button, redirectTo) {
    if (!vacanteId || String(vacanteId).startsWith("demo-")) {
      window.location.href = redirectTo;
      return;
    }

    const originalText = button.textContent;
    button.textContent = action === "guardar" ? "Guardando..." : "Postulando...";
    button.setAttribute("aria-busy", "true");

    try {
      const response = await fetch("/.netlify/functions/supabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, vacanteId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo completar la accion.");
      }

      button.textContent = action === "guardar" ? "Guardado" : "Postulacion enviada";
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 650);
    } catch (error) {
      console.warn(error);
      button.textContent = "Intenta otra vez";
      button.removeAttribute("aria-busy");

      setTimeout(() => {
        button.textContent = originalText;
      }, 1800);
    }
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

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value || "";
    }
  }

  function getHorario(title = "") {
    const lower = title.toLowerCase();
    if (lower.includes("tienda") || lower.includes("mozo")) return "Turno tarde";
    if (lower.includes("almacen")) return "Lunes a sabado";
    if (lower.includes("recepcion")) return "Lunes a viernes";
    return "Horario coordinado con la empresa";
  }

  function getDemoVacante(key = "") {
    const vacantes = [
      {
        id: "demo-atencion",
        titulo: "Asistente de atencion al cliente",
        modalidad: "Presencial",
        ubicacion: "Lima Centro",
        salario: "S/ 1200 - S/ 1500",
        descripcion: "Orientar clientes en tienda, registrar solicitudes simples y dar seguimiento a consultas frecuentes. La empresa brinda capacitacion inicial sobre productos, protocolo de atencion y uso basico del sistema.",
        requisitos: ["Buen trato al cliente", "Comunicacion clara", "Disponibilidad inmediata", "Manejo basico de computadora"],
        empresas: {
          nombre: "Comercial Andina",
          descripcion: "Cadena de tiendas de conveniencia enfocada en atencion cercana, orden de tienda y oportunidades para jovenes talentos.",
        },
      },
      {
        id: "demo-tienda",
        titulo: "Asistente de tienda part-time",
        modalidad: "Part-time",
        ubicacion: "Ate",
        salario: "S/ 850",
        descripcion: "Apoyar en orden de productos, reposicion de anaqueles, atencion en piso de venta y apoyo en caja durante horas de mayor movimiento. Ideal para estudiantes con disponibilidad por la tarde.",
        requisitos: ["Responsabilidad", "Orden y puntualidad", "Disponibilidad por la tarde", "No requiere experiencia previa"],
        empresas: {
          nombre: "Tiendas Lima Center",
          descripcion: "Empresa retail con sedes en Lima Este. Busca jovenes responsables para apoyar en reposicion, caja y atencion al cliente.",
        },
      },
      {
        id: "demo-almacen",
        titulo: "Auxiliar de almacen",
        modalidad: "Tiempo completo",
        ubicacion: "La Molina",
        salario: "S/ 1100",
        descripcion: "Realizar conteo de productos, apoyo en recepcion de mercaderia, rotulado, preparacion de pedidos y mantenimiento del orden del almacen. Se ensena el flujo completo durante la primera semana.",
        requisitos: ["Condicion fisica para trabajo operativo", "Orden", "Trabajo en equipo", "Disponibilidad de lunes a sabado"],
        empresas: {
          nombre: "Logistica Express SAC",
          descripcion: "Operador logistico local que brinda servicios de almacen, inventario y despacho para pequenos comercios.",
        },
      },
      {
        id: "demo-mozo",
        titulo: "Mozo junior",
        modalidad: "Part-time",
        ubicacion: "Miraflores",
        salario: "S/ 900",
        descripcion: "Atender mesas, tomar pedidos, coordinar con cocina y apoyar en el cobro de cuentas. No se requiere experiencia previa; el equipo capacita en carta, protocolo de servicio y manejo de horarios.",
        requisitos: ["Actitud de servicio", "Buena comunicacion", "Disponibilidad fines de semana", "Ganas de aprender"],
        empresas: {
          nombre: "Cevicheria Don Jose",
          descripcion: "Restaurante familiar en Miraflores especializado en comida marina. Ofrece capacitacion inicial y buen ambiente de trabajo.",
        },
      },
      {
        id: "demo-recepcion",
        titulo: "Recepcionista junior",
        modalidad: "Presencial",
        ubicacion: "San Isidro",
        salario: "S/ 1025",
        descripcion: "Recibir pacientes, orientar consultas, confirmar citas, registrar datos basicos y coordinar con las areas internas. Puesto recomendado para postulantes con trato amable y organizacion.",
        requisitos: ["Trato amable", "Orden administrativo", "Comunicacion telefonica", "Disponibilidad de lunes a viernes"],
        empresas: {
          nombre: "Clinica San Rafael",
          descripcion: "Centro medico privado con atencion ambulatoria. Requiere apoyo administrativo y recepcion para orientar pacientes.",
        },
      },
    ];

    return vacantes.find((vacante) => key && (vacante.id === key || key.toLowerCase().includes(vacante.id.replace("demo-", "")))) || vacantes[0];
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
