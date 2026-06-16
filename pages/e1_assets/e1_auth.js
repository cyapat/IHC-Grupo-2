// Lógica de Registro y Login para Épica E1
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar base de datos de usuarios si no existe
  if (!localStorage.getItem("wb_users")) {
    // Algunos usuarios demo predeterminados para pruebas
    const demoUsers = [
      {
        nombre: "José Mamani",
        edad: "20",
        celular: "999999999",
        correo: "jose@gmail.com",
        contrasena: "123456",
        role: "postulante",
        perfil: {
          avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>",
          bio: "Joven proactivo de SJL buscando su primer empleo en atención al cliente. Puntual y con facilidad para trabajar en equipo.",
          distrito: "SJL",
          habilidades: ["Atención al cliente", "Puntualidad", "Trabajo en equipo"]
        }
      },
      {
        nombre: "Constructora Nova",
        ruc: "20123456789",
        distrito: "Miraflores",
        correo: "empresa@gmail.com",
        contrasena: "123456",
        role: "empresa"
      }
    ];
    localStorage.setItem("wb_users", JSON.stringify(demoUsers));
  }

  // --- SELECTORES DE ROL (INTERCAMBIO DINÁMICO) ---
  const roleButtons = document.querySelectorAll(".role-btn");
  const activeRoleInput = document.getElementById("active-role");
  
  const camposPostulante = document.getElementById("campos-postulante");
  const camposEmpresa = document.getElementById("campos-empresa");

  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const alertMsg = document.getElementById("alert-msg");

  // Función para mostrar alertas de error/éxito
  const showAlert = (message, type = "error") => {
    if (!alertMsg) return;
    alertMsg.textContent = message;
    alertMsg.className = `alert-msg ${type}`;
    alertMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    
    // Ocultar alerta después de 5 segundos
    setTimeout(() => {
      alertMsg.style.display = "none";
    }, 5000);
  };

  // Manejar cambio de rol
  if (roleButtons.length > 0) {
    roleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remover clase activa de todos
        roleButtons.forEach(b => b.classList.remove("active"));
        // Agregar activa al botón clickeado
        btn.classList.add("active");
        
        const role = btn.getAttribute("data-role");
        if (activeRoleInput) activeRoleInput.value = role;

        // Alternar campos del formulario de registro
        if (role === "postulante") {
          if (camposPostulante) camposPostulante.style.display = "flex";
          if (camposEmpresa) camposEmpresa.style.display = "none";
          
          // Ajustar requeridos
          setRequired(camposPostulante, true);
          setRequired(camposEmpresa, false);
        } else if (role === "empresa") {
          if (camposPostulante) camposPostulante.style.display = "none";
          if (camposEmpresa) camposEmpresa.style.display = "flex";
          
          // Ajustar requeridos
          setRequired(camposPostulante, false);
          setRequired(camposEmpresa, true);
        }
      });
    });
  }

  // Helper para activar/desactivar requeridos en un contenedor
  function setRequired(container, isRequired) {
    if (!container) return;
    const inputs = container.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      if (isRequired) {
        input.setAttribute("required", "required");
      } else {
        input.removeAttribute("required");
      }
    });
  }

  // --- LÓGICA DE REGISTRO ---
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const role = activeRoleInput ? activeRoleInput.value : "postulante";
      const correo = document.getElementById("correo").value.trim().toLowerCase();
      const contrasena = document.getElementById("contrasena").value;
      const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

      // Validar contraseñas
      if (contrasena !== confirmarContrasena) {
        showAlert("Las contraseñas no coinciden.");
        return;
      }

      // Validar si el correo ya está registrado
      const users = JSON.parse(localStorage.getItem("wb_users")) || [];
      if (users.some(u => u.correo === correo)) {
        showAlert("Este correo ya está registrado.");
        return;
      }

      let newUser = {
        correo,
        contrasena,
        role
      };

      if (role === "postulante") {
        const nombre = document.getElementById("nombre-completo").value.trim();
        const edad = document.getElementById("edad").value.trim();
        const celular = document.getElementById("celular").value.trim();

        // Validaciones específicas
        if (parseInt(edad) < 18 || parseInt(edad) > 100) {
          showAlert("Debes ser mayor de 18 años para registrarte.");
          return;
        }
        if (celular.length < 9) {
          showAlert("El número de celular debe tener al menos 9 dígitos.");
          return;
        }

        newUser.nombre = nombre;
        newUser.edad = edad;
        newUser.celular = celular;
        newUser.perfil = {
          avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>", // avatar predeterminado
          bio: "",
          distrito: "",
          habilidades: []
        };
      } else if (role === "empresa") {
        const nombreEmpresa = document.getElementById("nombre-empresa").value.trim();
        const ruc = document.getElementById("ruc").value.trim();
        const distrito = document.getElementById("distrito-empresa").value;

        // Validaciones específicas
        if (ruc.length !== 11 || isNaN(ruc)) {
          showAlert("El RUC debe tener exactamente 11 dígitos numéricos.");
          return;
        }
        if (!distrito) {
          showAlert("Por favor, selecciona un distrito.");
          return;
        }

        newUser.nombre = nombreEmpresa;
        newUser.ruc = ruc;
        newUser.distrito = distrito;
      }

      // Guardar usuario nuevo
      users.push(newUser);
      localStorage.setItem("wb_users", JSON.stringify(users));

      // Guardar sesión activa
      localStorage.setItem("wb_session", JSON.stringify(newUser));

      showAlert("¡Registro exitoso! Redirigiendo...", "success");

      // Redirección con retraso para mostrar mensaje de éxito
      setTimeout(() => {
        if (role === "postulante") {
          window.location.href = "./e1_perfil_postulante.html";
        } else {
          window.location.href = "../wb_empresa_panel.html";
        }
      }, 1500);
    });
  }

  // --- LÓGICA DE INICIO DE SESIÓN ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const role = activeRoleInput ? activeRoleInput.value : "postulante";
      const correo = document.getElementById("correo").value.trim().toLowerCase();
      const contrasena = document.getElementById("contrasena").value;

      const users = JSON.parse(localStorage.getItem("wb_users")) || [];
      const userFound = users.find(
        u => u.correo === correo && u.contrasena === contrasena && u.role === role
      );

      if (!userFound) {
        showAlert("Correo o contraseña incorrectos para el rol seleccionado.");
        return;
      }

      // Guardar sesión activa
      localStorage.setItem("wb_session", JSON.stringify(userFound));

      showAlert("¡Inicio de sesión exitoso! Redirigiendo...", "success");

      // Redirección
      setTimeout(() => {
        if (role === "postulante") {
          window.location.href = "./e1_perfil_postulante.html";
        } else {
          window.location.href = "../wb_empresa_panel.html";
        }
      }, 1200);
    });
  }
});

// Función global de cerrar sesión (para ser llamada desde el panel)
window.logoutUser = () => {
  localStorage.removeItem("wb_session");
  window.location.href = "./e1_login.html";
};
