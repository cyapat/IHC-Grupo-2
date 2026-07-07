const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: jsonHeaders,
      body: "",
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  const resource = event.queryStringParameters?.resource || "vacantes";

  if (!supabaseUrl || !supabaseKey) {
    return response(500, {
      error: "Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY en Netlify.",
    });
  }

  if (event.httpMethod === "POST") {
    return handleMutation(event, supabaseUrl, supabaseKey);
  }

  const endpoints = {
    vacantes: "/rest/v1/vacantes?select=id,titulo,modalidad,ubicacion,salario,descripcion,requisitos,estado,creado_en,empresas(nombre,rubro)&estado=eq.activa&order=creado_en.desc",
    detalleVacante: `/rest/v1/vacantes?select=id,titulo,modalidad,ubicacion,salario,descripcion,requisitos,estado,creado_en,empresas(nombre,rubro,descripcion,ubicacion)&id=eq.${encodeURIComponent(event.queryStringParameters?.id || "")}&limit=1`,
    postulaciones: "/rest/v1/postulaciones?select=id,estado,mensaje,creado_en,vacantes(titulo,modalidad,ubicacion,salario,empresas(nombre))&order=creado_en.desc",
    guardados: "/rest/v1/guardados?select=id,creado_en,vacantes(id,titulo,modalidad,ubicacion,salario,requisitos,empresas(nombre))&order=creado_en.desc",
  };

  if (!endpoints[resource]) {
    return response(400, { error: "Recurso no soportado." });
  }

  try {
    const supabaseResponse = await fetch(`${supabaseUrl}${endpoints[resource]}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const data = await supabaseResponse.json();

    if (!supabaseResponse.ok) {
      return response(supabaseResponse.status, {
        error: "Supabase no pudo responder la consulta.",
        detail: data,
      });
    }

    return response(200, { data });
  } catch (error) {
    return response(500, {
      error: "No se pudo conectar con Supabase.",
      detail: error.message,
    });
  }
};

async function handleMutation(event, supabaseUrl, supabaseKey) {
  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return response(400, { error: "El cuerpo de la solicitud no es valido." });
  }

  const { action, vacanteId } = payload;

  if (!vacanteId || !["guardar", "postular"].includes(action)) {
    return response(400, { error: "Faltan action o vacanteId validos." });
  }

  const user = await supabaseRequest(supabaseUrl, supabaseKey, "/rest/v1/usuarios?select=id&email=eq.lucia@demo.com&limit=1");
  const postulanteId = user.data?.[0]?.id;

  if (!postulanteId) {
    return response(404, { error: "No se encontro el postulante demo en Supabase." });
  }

  const table = action === "guardar" ? "guardados" : "postulaciones";
  const body = action === "guardar"
    ? { vacante_id: vacanteId, postulante_id: postulanteId }
    : {
        vacante_id: vacanteId,
        postulante_id: postulanteId,
        estado: "enviada",
        mensaje: "Postulacion enviada desde WorkBridge.",
      };

  const result = await supabaseRequest(
    supabaseUrl,
    supabaseKey,
    `/rest/v1/${table}?on_conflict=vacante_id,postulante_id`,
    {
      method: "POST",
      headers: {
        Prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify(body),
    },
  );

  if (!result.ok) {
    return response(result.status, {
      error: action === "guardar" ? "No se pudo guardar el empleo." : "No se pudo registrar la postulacion.",
      detail: result.data,
    });
  }

  return response(200, {
    ok: true,
    action,
    data: result.data,
  });
}

async function supabaseRequest(supabaseUrl, supabaseKey, path, options = {}) {
  const supabaseResponse = await fetch(`${supabaseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  const data = await supabaseResponse.json();

  return {
    ok: supabaseResponse.ok,
    status: supabaseResponse.status,
    data,
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}
