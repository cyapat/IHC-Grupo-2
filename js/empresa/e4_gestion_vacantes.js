function mostrarSeccion(id, boton) {
      document.querySelectorAll('.e4-section').forEach(section => {
        section.classList.remove('active');
      });

      document.getElementById(id).classList.add('active');

      document.querySelectorAll('.e4-menu button').forEach(btn => {
        btn.classList.remove('active');
      });

      boton.classList.add('active');
    }

    window.addEventListener('DOMContentLoaded', () => {
      cargarVacantesGuardadas();

      if (window.location.hash === '#mensajes') {
        const botones = document.querySelectorAll('.e4-menu button');
        mostrarSeccion('mensajes', botones[1]);
      }
    });

    document.getElementById('formVacante').addEventListener('submit', function(e) {
      e.preventDefault();

      const titulo = document.getElementById('titulo').value;
      const distrito = document.getElementById('distrito').value;
      const jornada = document.getElementById('jornada').value;
      const sueldo = document.getElementById('sueldo').value;
      const requisitos = document.getElementById('requisitos').value;
      const preguntasTexto = document.getElementById('preguntas').value;

      const preguntas = preguntasTexto
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => `<li>${escapeHtml(p)}</li>`)
        .join('');

      const vacante = { titulo, distrito, jornada, sueldo, requisitos, preguntas };

      agregarVacanteAlListado(vacante);
      guardarVacanteLocal(vacante);

      const contador = document.getElementById('contadorVacantes');
      contador.textContent = parseInt(contador.textContent) + 1;

      this.reset();
      alert('Vacante publicada correctamente.');
    });

    function agregarVacanteAlListado(vacante) {
      const nuevaVacante = document.createElement('article');
      nuevaVacante.classList.add('e4-vacante');
      nuevaVacante.dataset.localVacante = 'true';

      nuevaVacante.innerHTML = `
        <div class="e4-vacante-header">
          <h3>${escapeHtml(vacante.titulo)}</h3>
          <span class="e4-estado">Activa</span>
        </div>
        <p class="e4-detalle">${escapeHtml(vacante.distrito)} - ${escapeHtml(vacante.jornada)} - ${escapeHtml(vacante.sueldo)}</p>
        <p>Requisitos: ${escapeHtml(vacante.requisitos)}</p>
        <ol class="e4-preguntas">${vacante.preguntas}</ol>
      `;

      document.getElementById('listaVacantes').prepend(nuevaVacante);
    }

    function guardarVacanteLocal(vacante) {
      const guardadas = JSON.parse(localStorage.getItem('wb_empresa_vacantes') || '[]');
      guardadas.unshift(vacante);
      localStorage.setItem('wb_empresa_vacantes', JSON.stringify(guardadas.slice(0, 8)));
    }

    function cargarVacantesGuardadas() {
      const guardadas = JSON.parse(localStorage.getItem('wb_empresa_vacantes') || '[]');
      guardadas.slice().reverse().forEach(agregarVacanteAlListado);

      const contador = document.getElementById('contadorVacantes');
      if (contador) {
        contador.textContent = String(parseInt(contador.textContent) + guardadas.length);
      }
    }

    const conversacionesDemo = {
      'Lucia Ramos': `
        <div class="e4-mensaje e4-nota">
          Coincidencia alta por comunicacion clara, disponibilidad inmediata y zona cercana.
        </div>
        <div class="e4-mensaje e4-postulante">
          Buenas tardes, vi la vacante de atencion al cliente y tengo disponibilidad inmediata.
          <span>Hoy 9:12 a.m.</span>
        </div>
        <div class="e4-mensaje e4-empresa">
          Buenas tardes, tu perfil aparece como buen match por comunicacion y disponibilidad.
          <span>Hoy 9:18 a.m.</span>
        </div>
        <div class="e4-mensaje e4-postulante">
          Perfecto, puedo acercarme a entrevista esta semana.
          <span>Hoy 9:25 a.m.</span>
        </div>
      `,
      'Jose Mamani': `
        <div class="e4-mensaje e4-nota">
          Candidato en proceso para turno tarde. Conviene confirmar fines de semana.
        </div>
        <div class="e4-mensaje e4-empresa">
          Hola Jose, vimos tu postulacion para mozo junior. Puedes trabajar sabados y domingos?
          <span>Ayer 4:40 p.m.</span>
        </div>
        <div class="e4-mensaje e4-postulante">
          Si, tengo disponibilidad fines de semana y puedo llegar a Miraflores en turno tarde.
          <span>Ayer 5:02 p.m.</span>
        </div>
        <div class="e4-mensaje e4-empresa">
          Genial. Te esperamos para una entrevista breve hoy a las 5:00 p.m.
          <span>Hoy 10:10 a.m.</span>
        </div>
      `,
      'Camila Flores': `
        <div class="e4-mensaje e4-nota">
          Respondio preguntas de descarte y tiene disponibilidad part-time.
        </div>
        <div class="e4-mensaje e4-postulante">
          Puedo trabajar de lunes a viernes por la tarde y tambien algunos domingos.
          <span>Lun 6:20 p.m.</span>
        </div>
        <div class="e4-mensaje e4-empresa">
          Gracias Camila. La vacante requiere orden, reposicion y apoyo en caja. Te sientes comoda con eso?
          <span>Lun 6:31 p.m.</span>
        </div>
        <div class="e4-mensaje e4-postulante">
          Si, en el colegio apoye en actividades de venta y manejo basico de caja.
          <span>Lun 6:45 p.m.</span>
        </div>
      `,
      'Marco Huaman': `
        <div class="e4-mensaje e4-nota">
          Candidato contratado. Conversacion orientada a documentos y fecha de ingreso.
        </div>
        <div class="e4-mensaje e4-empresa">
          Marco, confirmamos tu ingreso como auxiliar de almacen. Puedes traer DNI y copia de recibo?
          <span>Mar 11:08 a.m.</span>
        </div>
        <div class="e4-mensaje e4-postulante">
          Si, los llevo manana. Tambien confirmo disponibilidad de lunes a sabado.
          <span>Mar 11:22 a.m.</span>
        </div>
        <div class="e4-mensaje e4-empresa">
          Perfecto. Tu induccion inicia a las 8:30 a.m. en La Molina.
          <span>Mar 11:40 a.m.</span>
        </div>
      `,
      'Valeria Cruz': `
        <div class="e4-mensaje e4-nota">
          Perfil nuevo con buen trato al publico. Falta validar horario de manana.
        </div>
        <div class="e4-mensaje e4-postulante">
          Hola, me interesa la vacante de recepcionista. Tengo facilidad para atender llamadas.
          <span>Hoy 8:30 a.m.</span>
        </div>
        <div class="e4-mensaje e4-empresa">
          Gracias Valeria. La posicion es presencial en San Isidro. Puedes asistir en horario de oficina?
          <span>Hoy 8:42 a.m.</span>
        </div>
        <div class="e4-mensaje e4-postulante">
          Si, puedo asistir de lunes a viernes y llegar antes de las 9:00 a.m.
          <span>Hoy 8:49 a.m.</span>
        </div>
      `
    };

    function cambiarChat(nombre, detalle, elemento) {
      document.getElementById('nombreChat').textContent = nombre;
      document.getElementById('detalleChat').textContent = detalle;

      document.getElementById('historialMensajes').innerHTML = conversacionesDemo[nombre] || conversacionesDemo['Lucia Ramos'];

      document.querySelectorAll('.e4-conversacion').forEach(c => {
        c.classList.remove('active');
      });

      elemento.classList.add('active');
    }

    function enviarMensaje() {
      const input = document.getElementById('nuevoMensaje');
      const texto = input.value.trim();

      if (texto === '') {
        alert('Escribe un mensaje antes de enviar.');
        return;
      }

      const mensaje = document.createElement('div');
      mensaje.classList.add('e4-mensaje', 'e4-empresa');
      mensaje.textContent = texto;

      document.getElementById('historialMensajes').appendChild(mensaje);
      input.value = '';
    }

    function escapeHtml(value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }
