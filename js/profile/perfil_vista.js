document.addEventListener("DOMContentLoaded", () => {
  const user = getSessionUser();
  const perfil = user.perfil || {};

  setText("[data-profile-name]", user.nombre || "Jose Mamani");
  setText("[data-profile-zone]", `${user.edad || "20"} anos - ${perfil.distrito || "San Juan de Lurigancho"}`);
  setText("[data-profile-bio]", perfil.bio || "Joven proactivo buscando su primer empleo. Puntual, responsable y con facilidad para trabajar en equipo.");
  setText("[data-profile-district]", perfil.distrito || "San Juan de Lurigancho");
  setText("[data-profile-phone]", user.celular || "999999999");
  setText("[data-profile-email]", user.correo || "jose@gmail.com");

  const avatar = document.querySelector("[data-profile-avatar]");
  if (avatar) {
    avatar.src = perfil.avatar || defaultAvatar();
  }

  const skills = document.querySelector("[data-profile-skills]");
  const habilidades = perfil.habilidades?.length ? perfil.habilidades : ["Atencion al cliente", "Puntualidad", "Trabajo en equipo"];
  if (skills) {
    skills.innerHTML = habilidades.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("");
  }
});

function getSessionUser() {
  const stored = JSON.parse(localStorage.getItem("wb_session") || "null");
  if (stored?.role === "postulante") return stored;

  const demo = {
    nombre: "Jose Mamani",
    edad: "20",
    celular: "999999999",
    correo: "jose@gmail.com",
    role: "postulante",
    perfil: {
      avatar: defaultAvatar(),
      bio: "Joven proactivo de SJL buscando su primer empleo en atencion al cliente. Puntual y con facilidad para trabajar en equipo.",
      distrito: "San Juan de Lurigancho",
      habilidades: ["Atencion al cliente", "Puntualidad", "Trabajo en equipo"],
    },
  };

  localStorage.setItem("wb_session", JSON.stringify(demo));
  return demo;
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function defaultAvatar() {
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232563eb'><circle cx='50' cy='50' r='50'/><circle cx='50' cy='35' r='18' fill='white'/><path d='M20 78c0-15 12-25 30-25s30 10 30 25z' fill='white'/></svg>";
}
