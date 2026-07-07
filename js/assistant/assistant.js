const chat = document.getElementById("aiChat");
const form = document.getElementById("aiForm");
const promptInput = document.getElementById("aiPrompt");
const statusText = document.getElementById("aiStatus");
const clearButton = document.getElementById("aiClear");
const suggestionButtons = document.querySelectorAll("[data-prompt]");

const messages = [
  {
    role: "system",
    content:
      "Eres WorkBridge IA, asistente de una plataforma academica de empleos para jovenes de 18 a 25 anos en Lima. Responde siempre en espanol, de forma clara y breve. Ayuda con perfiles, CV, postulaciones, entrevistas, busqueda de empleos de entrada y redaccion de vacantes. Si preguntan algo fuera de WorkBridge, empleabilidad o gestion de vacantes, redirige con amabilidad al objetivo del proyecto."
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
    appendMessage("bot", "WorkBridge IA", reply);
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
