# WorkBridge

Proyecto web estatico para IHC y Programacion Web. WorkBridge conecta jovenes de 18 a 25 anos de Lima Metropolitana con empleos de entrada, practicas y oportunidades part-time. Tambien ofrece a empresas un panel simple para publicar vacantes, revisar candidatos y gestionar mensajes.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- OpenAI API con funcion serverless de Netlify
- Supabase como base de datos provisional
- LocalStorage para datos demo
- Responsive Web Design
- Netlify

## Organizacion de carpetas

- `index.html`: landing page principal, ubicada en la raiz como en el ejemplo PagoYa.
- `pages/`: contiene las paginas internas separadas por modulo.
- `css/`: contiene todos los estilos CSS, incluyendo estilos compartidos y estilos especificos por pagina.
- `js/`: contiene todos los archivos JavaScript separados por modulo.

```text
IHC-Grupo-2/
  index.html
  css/
  js/
    assistant/
    auth/
    empresa/
    profile/
    supabase/
  netlify/
    functions/
  pages/
    assistant/
    auth/
    empresa/
    postulante/
    profile/
  supabase/
    schema.sql
```

## Paginas principales para Capitulo V

| Integrante | Archivo | Funcionalidades |
| --- | --- | --- |
| Patrick Leonardo | `index.html` | Landing page: hero, como funciona, categorias, features, CTA empresa/postulante. |
| Patrick Leonardo | `pages/empresa/panel.html` | Panel empresa: stats, lista postulantes, en proceso, contratados, vacantes activas y detalle candidato integrado. |
| Cristian Condori | `pages/auth/login.html` | Login con selector postulante/empresa, validacion de campos y redireccion segun tipo. |
| Cristian Condori | `pages/auth/register.html` | Registro de postulante y empresa con formularios diferenciados. |
| Cristian Condori | `pages/profile/perfil_postulante.html` | Perfil editable: foto/avatar, sobre mi, habilidades, zona y proyectos academicos. |
| Valentino Rojas | `pages/postulante/hub_postulante.html` | Feed de empleos con buscador, filtros, chips, cards de empleo, guardar y postular. |
| Valentino Rojas | `pages/postulante/detalle_empleo.html` | Detalle de empleo con descripcion, requisitos, sueldo, empresa, preguntas de descarte y boton postular. |
| Valentino Rojas | `pages/postulante/guardados.html` | Lista de empleos guardados por el postulante. |
| David Zavala | `pages/postulante/mis_postulaciones.html` | Lista de empleos aplicados con cards de estado, fecha, vacante y empresa. |
| David Zavala | `pages/postulante/status_postulacion.html` | Seguimiento con linea de tiempo: enviada, vista, entrevista y resultado final. |
| Jose Requejo | `pages/empresa/gestion_vacantes.html` | Publicacion de vacantes, lista de vacantes activas y bandeja de mensajes empresa-postulante. |
| Jose Requejo | `pages/empresa/publicar_vacante.html` | Acceso directo al formulario de publicacion de vacante. |
| Jose Requejo | `pages/empresa/mensajes.html` | Acceso directo a la bandeja de mensajes. |
| Todo el equipo | `pages/assistant/assistant.html` | Asistente IA para orientar postulantes y empresas usando OpenAI desde Netlify Functions. |
| Todo el equipo | `css/style.css` | Design system compartido para landing, paneles y modulos. |

## Flujo de demo sugerido

1. Abrir `index.html`.
2. Entrar a `pages/auth/register.html` o `pages/auth/login.html`.
3. Como postulante, ir a `pages/profile/perfil_postulante.html`.
4. Buscar empleos en `pages/postulante/hub_postulante.html`.
5. Abrir `pages/postulante/detalle_empleo.html` y postular.
6. Revisar `pages/postulante/mis_postulaciones.html`.
7. Ver seguimiento en `pages/postulante/status_postulacion.html`.
8. Abrir `pages/assistant/assistant.html` para probar la integracion de IA generativa.
9. Como empresa, abrir `pages/empresa/panel.html`.
10. Publicar vacante o revisar mensajes desde `pages/empresa/gestion_vacantes.html`.

## IA Generativa

La pagina `pages/assistant/assistant.html` usa `js/assistant/assistant.js` para enviar preguntas a la funcion `netlify/functions/openai.js`. La API key no se guarda en el navegador ni en el repositorio: debe configurarse en Netlify como variable de entorno:

```text
OPENAI_API_KEY=tu_clave
```

## Supabase

La base de datos provisional esta documentada en `supabase/schema.sql`. Ese archivo se ejecuta en el SQL Editor de Supabase y crea tablas demo para usuarios, perfiles, empresas, vacantes, postulaciones, guardados y mensajes.

La funcion `netlify/functions/supabase.js` consulta Supabase desde Netlify y la capa frontend `js/supabase/workbridge-data.js` muestra datos reales en:

- `pages/postulante/hub_postulante.html`
- `pages/postulante/busqueda.html`
- `pages/postulante/mis_postulaciones.html`

Variables sugeridas para Netlify:

```text
SUPABASE_URL=tu_project_url
SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
```

## Despliegue

El archivo `netlify.toml` publica el proyecto desde la raiz:

```toml
[build]
  publish = "."
```
