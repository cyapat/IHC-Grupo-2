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

  const endpoints = {
    vacantes: "/rest/v1/vacantes?select=id,titulo,modalidad,ubicacion,salario,descripcion,requisitos,estado,creado_en,empresas(nombre,rubro)&estado=eq.activa&order=creado_en.desc",
    detalleVacante: `/rest/v1/vacantes?select=id,titulo,modalidad,ubicacion,salario,descripcion,requisitos,estado,creado_en,empresas(nombre,rubro,descripcion,ubicacion)&id=eq.${encodeURIComponent(event.queryStringParameters?.id || "")}&limit=1`,
    postulaciones: "/rest/v1/postulaciones?select=id,estado,mensaje,creado_en,vacantes(titulo,modalidad,ubicacion,salario,empresas(nombre))&order=creado_en.desc",
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

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}
