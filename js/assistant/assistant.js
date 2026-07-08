const chat = document.getElementById("aiChat");
const form = document.getElementById("aiForm");
const promptInput = document.getElementById("aiPrompt");
const statusText = document.getElementById("aiStatus");
const clearButton = document.getElementById("aiClear");
const suggestionButtons = document.querySelectorAll("[data-prompt]");
const assistantMode = document.body.dataset.assistantMode || "postulante";
const assistantName = assistantMode === "empresa" ? "WorkBridge IA Empresa" : "WorkBridge IA";

const messages = [
  {
    role: "system",
    content:
      assistantMode === "empresa"
        ? "Eres WorkBridge IA Empresa, asistente para pymes de Lima que contratan jovenes de 18 a 25 anos. Responde siempre en espanol, de forma clara y breve. Ayuda a redactar vacantes, crear preguntas de descarte, evaluar candidatos sin experiencia, preparar mensajes de entrevista y mejorar procesos de seleccion. Si preguntan algo fuera de WorkBridge o reclutamiento, redirige con amabilidad al objetivo del proyecto."
        : "Eres WorkBridge IA, asistente de una plataforma academica de empleos para jovenes de 18 a 25 anos en Lima. Responde siempre en espanol, de forma clara y breve. Ayuda con perfiles, CV, postulaciones, entrevistas y busqueda de empleos de entrada. Si preguntan algo fuera de WorkBridge o empleabilidad, redirige con amabilidad al objetivo del proyecto."
  }
];

function appendMessage(kind, title, text) {
  const message = document.createElement("div");
  message.className = `ai-message ai-message-${kind}`;

  const heading = document.createElement("strong");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  message.append(heading, paragraph);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function askAssistant(text) {
  const response = await fetch("/.netlify/functions/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [...messages, { role: "user", content: text }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "No se pudo contactar al asistente.");
  }
  return data.reply;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = promptInput.value.trim();
  if (!text) return;

  appendMessage("user", "Tu", text);
  messages.push({ role: "user", content: text });
  promptInput.value = "";
  statusText.textContent = "Generando respuesta...";

  try {
    const reply = await askAssistant(text);
    messages.push({ role: "assistant", content: reply });
    appendMessage("bot", assistantName, reply);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
  }
});

clearButton.addEventListener("click", () => {
  chat.querySelectorAll(".ai-message:not(:first-child)").forEach((node) => node.remove());
  messages.splice(1);
  promptInput.value = "";
  statusText.textContent = "";
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    promptInput.focus();
  });
});
