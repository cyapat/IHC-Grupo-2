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
        .map(p => `<li>${p}</li>`)
        .join('');

      const nuevaVacante = document.createElement('article');
      nuevaVacante.classList.add('e4-vacante');

      nuevaVacante.innerHTML = `
        <div class="e4-vacante-header">
          <h3>${titulo}</h3>
          <span class="e4-estado">Activa</span>
        </div>
        <p class="e4-detalle">${distrito} · ${jornada} · ${sueldo}</p>
        <p>Requisitos: ${requisitos}</p>
        <ol class="e4-preguntas">${preguntas}</ol>
      `;

      document.getElementById('listaVacantes').prepend(nuevaVacante);

      const contador = document.getElementById('contadorVacantes');
      contador.textContent = parseInt(contador.textContent) + 1;

      this.reset();
      alert('Vacante publicada correctamente.');
    });

    function cambiarChat(nombre, detalle, elemento) {
      document.getElementById('nombreChat').textContent = nombre;
      document.getElementById('detalleChat').textContent = detalle;

      document.getElementById('historialMensajes').innerHTML = `
        <div class="e4-mensaje e4-postulante">
          Buenas tardes, estoy interesado/a en la vacante.
        </div>
        <div class="e4-mensaje e4-empresa">
          Buenas tardes, gracias por postular. Revisaremos tu perfil.
        </div>
      `;

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
