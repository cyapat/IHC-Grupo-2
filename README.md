# WorkBridge

Proyecto web estatico para IHC y Programacion Web. WorkBridge conecta jovenes de 18 a 25 anos de Lima Metropolitana con empleos de entrada, practicas y oportunidades part-time. Tambien ofrece a empresas un panel simple para publicar vacantes, revisar candidatos y gestionar mensajes.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage para datos demo
- Responsive Web Design
- Netlify

## Paginas principales para Capitulo V

| Integrante | Archivo | Funcionalidades |
| --- | --- | --- |
| Patrick Leonardo | `index.html` | Landing page: hero, como funciona, categorias, features, CTA empresa/postulante. |
| Patrick Leonardo | `wb_empresa_panel.html` | Panel empresa: stats, lista postulantes, en proceso, contratados, vacantes activas y detalle candidato integrado. |
| Cristian Condori | `pages/e1_login.html` | Login con selector postulante/empresa, validacion de campos y redireccion segun tipo. |
| Cristian Condori | `pages/e1_registro.html` | Registro de postulante y empresa con formularios diferenciados. |
| Cristian Condori | `pages/e1_perfil_postulante.html` | Perfil editable: foto/avatar, sobre mi, habilidades, zona y proyectos academicos. |
| Valentino Rojas | `wb_hub_postulante.html` | Feed de empleos con buscador, filtros, chips, cards de empleo, guardar y postular. |
| Valentino Rojas | `wb_detalle_empleo.html` | Detalle de empleo con descripcion, requisitos, sueldo, empresa, preguntas de descarte y boton postular. |
| Valentino Rojas | `wb_guardados.html` | Lista de empleos guardados por el postulante. |
| David Zavala | `wb_mis_postulaciones.html` | Lista de empleos aplicados con cards de estado, fecha, vacante y empresa. |
| David Zavala | `wb_status_postulacion.html` | Seguimiento con linea de tiempo: enviada, vista, entrevista y resultado final. |
| Jose Requejo | `pages/canela89/e4_gestion_vacantes.html` | Publicacion de vacantes, lista de vacantes activas y bandeja de mensajes empresa-postulante. |
| Jose Requejo | `wb_publicar_vacante.html` | Acceso directo al formulario de publicacion de vacante. |
| Jose Requejo | `wb_mensajes.html` | Acceso directo a la bandeja de mensajes. |
| Todo el equipo | `style.css` | Design system compartido para landing, paneles y modulos. |

## Flujo de demo sugerido

1. Abrir `index.html`.
2. Entrar a `pages/e1_registro.html` o `pages/e1_login.html`.
3. Como postulante, ir a `pages/e1_perfil_postulante.html`.
4. Buscar empleos en `wb_hub_postulante.html`.
5. Abrir `wb_detalle_empleo.html` y postular.
6. Revisar `wb_mis_postulaciones.html`.
7. Ver seguimiento en `wb_status_postulacion.html`.
8. Como empresa, abrir `wb_empresa_panel.html`.
9. Publicar vacante o revisar mensajes desde `pages/canela89/e4_gestion_vacantes.html`.

## Despliegue

El archivo `netlify.toml` publica el proyecto desde la raiz:

```toml
[build]
  publish = "."
```
