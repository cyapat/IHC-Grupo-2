// Lógica del Perfil del Postulante para Épica E1
document.addEventListener("DOMContentLoaded", () => {
  // --- VERIFICACIÓN DE SESIÓN ---
  let sessionUser = JSON.parse(localStorage.getItem("wb_session"));
  
  if (!sessionUser) {
    sessionUser = {
      nombre: "Jose Mamani",
      edad: "20",
      celular: "999999999",
      correo: "jose@gmail.com",
      contrasena: "123456",
      role: "postulante",
      perfil: {
        avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>",
        bio: "Joven proactivo de SJL buscando su primer empleo en atencion al cliente. Puntual y con facilidad para trabajar en equipo.",
        distrito: "San Juan de Lurigancho",
        habilidades: ["Atencion al cliente", "Puntualidad", "Trabajo en equipo"]
      }
    };
    localStorage.setItem("wb_session", JSON.stringify(sessionUser));
  }

  if (sessionUser.role !== "postulante") {
    // Si es empresa, redirigir al panel correspondiente
    window.location.href = "../empresa/panel.html";
    return;
  }

  // --- ELEMENTOS DE LA PÁGINA ---
  const postulanteNombreSidebar = document.getElementById("postulante-nombre-sidebar");
  const postulanteNombreTopbar = document.getElementById("postulante-nombre-topbar");
  const bioInput = document.getElementById("bio");
  const distritoSelect = document.getElementById("distrito");
  const formPerfil = document.getElementById("form-perfil");
  const alertMsg = document.getElementById("alert-msg");

  // Habilidades (Tags)
  const skillInput = document.getElementById("skill-input");
  const addSkillBtn = document.getElementById("add-skill-btn");
  const skillsContainer = document.getElementById("skills-container");

  // Avatar
  const currentAvatarImg = document.getElementById("current-avatar-img");
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const fileAvatarInput = document.getElementById("file-avatar");

  // --- DATOS DEL PERFIL ---
  let perfil = sessionUser.perfil || {
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>",
    bio: "",
    distrito: "",
    habilidades: []
  };

  let habilidades = perfil.habilidades || [];
  let currentAvatar = perfil.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>";

  // --- INICIALIZAR VISTA ---
  const inicializarVista = () => {
    // Nombres
    if (postulanteNombreSidebar) postulanteNombreSidebar.textContent = sessionUser.nombre;
    if (postulanteNombreTopbar) postulanteNombreTopbar.textContent = sessionUser.nombre;

    // Campos de texto y select
    if (bioInput) bioInput.value = perfil.bio || "";
    if (distritoSelect) distritoSelect.value = perfil.distrito || "";

    // Cargar imagen de avatar
    if (currentAvatarImg) currentAvatarImg.src = currentAvatar;

    // Seleccionar visualmente la opción del avatar si coincide con una de las opciones
    avatarOptions.forEach(opt => {
      if (opt.getAttribute("src") === currentAvatar) {
        opt.classList.add("selected");
      } else {
        opt.classList.remove("selected");
      }
    });

    // Cargar habilidades
    renderHabilidades();
  };

  // --- CONTROL DE ALERTAS ---
  const showAlert = (message, type = "success") => {
    if (!alertMsg) return;
    alertMsg.textContent = message;
    alertMsg.className = `alert-msg ${type}`;
    alertMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    
    setTimeout(() => {
      alertMsg.style.display = "none";
    }, 4000);
  };

  // --- GESTIÓN DE HABILIDADES (TAGS) ---
  const renderHabilidades = () => {
    if (!skillsContainer) return;
    skillsContainer.innerHTML = "";

    habilidades.forEach((skill, index) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.innerHTML = `
        ${skill}
        <button type="button" class="remove-btn" data-index="${index}">&times;</button>
      `;
      skillsContainer.appendChild(tag);
    });

    // Agregar eventos para eliminar
    const removeButtons = skillsContainer.querySelectorAll(".remove-btn");
    removeButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.getAttribute("data-index"));
        habilidades.splice(idx, 1);
        renderHabilidades();
      });
    });
  };

  const agregarHabilidad = () => {
    if (!skillInput) return;
    const value = skillInput.value.trim();
    if (value === "") return;

    // Evitar duplicados
    if (habilidades.includes(value)) {
      showAlert("Esta habilidad ya ha sido agregada.", "error");
      skillInput.value = "";
      return;
    }

    habilidades.push(value);
    renderHabilidades();
    skillInput.value = "";
    skillInput.focus();
  };

  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", agregarHabilidad);
  }

  if (skillInput) {
    skillInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        agregarHabilidad();
      }
    });
  }

  // --- GESTIÓN DE AVATAR (PRESETS Y FILE UPLOAD) ---
  // Selección de presets
  avatarOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      avatarOptions.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      currentAvatar = opt.getAttribute("src");
      if (currentAvatarImg) currentAvatarImg.src = currentAvatar;
    });
  });

  // Carga de archivo personalizado (Base64)
  if (fileAvatarInput) {
    fileAvatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        showAlert("Por favor, selecciona un archivo de imagen válido.", "error");
        return;
      }

      // Validar tamaño (máximo 1.5MB para LocalStorage)
      if (file.size > 1.5 * 1024 * 1024) {
        showAlert("La imagen es muy pesada (máximo 1.5MB).", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        currentAvatar = event.target.result; // El contenido en Base64
        if (currentAvatarImg) currentAvatarImg.src = currentAvatar;

        // Deseleccionar presets
        avatarOptions.forEach(o => o.classList.remove("selected"));
      };
      reader.readAsDataURL(file);
    });
  }

  // --- GUARDAR PERFIL ---
  if (formPerfil) {
    formPerfil.addEventListener("submit", (e) => {
      e.preventDefault();

      const bio = bioInput.value.trim();
      const distrito = distritoSelect.value;

      if (!distrito) {
        showAlert("Por favor, selecciona tu distrito.", "error");
        return;
      }

      // Actualizar perfil local
      perfil.bio = bio;
      perfil.distrito = distrito;
      perfil.avatar = currentAvatar;
      perfil.habilidades = habilidades;

      // Actualizar objeto de usuario de la sesión
      sessionUser.perfil = perfil;
      localStorage.setItem("wb_session", JSON.stringify(sessionUser));

      // Actualizar base de datos de usuarios (wb_users)
      const users = JSON.parse(localStorage.getItem("wb_users")) || [];
      const updatedUsers = users.map(u => {
        if (u.correo === sessionUser.correo && u.role === "postulante") {
          return sessionUser;
        }
        return u;
      });
      localStorage.setItem("wb_users", JSON.stringify(updatedUsers));

      showAlert("Perfil guardado correctamente. Redirigiendo a la vista final...", "success");

      setTimeout(() => {
        window.location.href = "perfil_vista.html";
      }, 700);
    });
  }

  // Inicializar
  inicializarVista();
});
