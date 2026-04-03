// ── MASONRY ──
function aplicarMasonry() {
  const grilla = document.getElementById('grilla');
  const tarjetas = grilla.querySelectorAll('.tarjeta');
  tarjetas.forEach(tarjeta => {
    tarjeta.style.gridRowEnd = '';
    const alto = tarjeta.getBoundingClientRect().height;
    const filas = Math.ceil(alto / 8);
    tarjeta.style.gridRowEnd = `span ${filas}`;
  });
}

const colores = [
  { bg: '#4a3b8a', label: 'Morado' },
  { bg: '#2e7d6e', label: 'Verde' },
  { bg: '#1a6fa8', label: 'Azul' },
  { bg: '#c0392b', label: 'Rojo' },
  { bg: '#d35400', label: 'Naranja' },
  { bg: '#7d3c98', label: 'Violeta' },
  { bg: '#1e8449', label: 'Verde oscuro' },
  { bg: '#2e4057', label: 'Gris azul' },
];

let colorSeleccionado = colores[0].bg;
let recintoSeleccionado = '';
let colorRecinto = '';
let esOtraOrganizacion = false;
let fechaFormateada = '';

// Abreviaturas de días de la semana en español
const diasAbreviados = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

// Array para almacenar los eventos
let eventos = [];
let fechaCompleta = null;

// Función para habilitar/deshabilitar botones de color
function habilitarColores(habilitado) {
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.style.opacity = habilitado ? '1' : '0.5';
    btn.style.cursor = habilitado ? 'pointer' : 'not-allowed';
    btn.style.pointerEvents = habilitado ? 'auto' : 'none';
  });
}

// Función para renderizar todas las tarjetas ordenadas
function renderizarTarjetas() {
  const grilla = document.getElementById('grilla');
  grilla.innerHTML = '';

  // Ordenar eventos por fecha
  eventos.sort((a, b) => a.fechaCompleta - b.fechaCompleta);

  // Crear las tarjetas en orden
  eventos.forEach(evento => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';

    const colorFinal = evento.color;

    tarjeta.innerHTML = `
      <button class="btn-eliminar" onclick="eliminarEvento(${evento.id})" title="Eliminar">✕</button>
      <div class="tarjeta-header" style="background: ${colorFinal}">
        <div class="tarjeta-fecha">${evento.fechaFormato}</div>
        <div class="tarjeta-recinto">
          <span class="tarjeta-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg></span>${evento.recinto}
        </div>
        ${evento.direccion ? `<div class="tarjeta-direccion">${evento.direccion}</div>` : ''}
      </div>
      <div class="tarjeta-body">
        <div class="tarjeta-descripcion">${evento.descripcion}</div>
      </div>
    `;

    grilla.appendChild(tarjeta);
  });

  // Aplicar masonry después de que el DOM renderice
  requestAnimationFrame(() => {
    requestAnimationFrame(() => aplicarMasonry());
  });
}

// Función para eliminar un evento
function eliminarEvento(id) {
  eventos = eventos.filter(evento => evento.id !== id);
  renderizarTarjetas();
}
const colorRow = document.getElementById('color-row');
colores.forEach((c, i) => {
  const btn = document.createElement('button');
  btn.className = 'color-btn' + (i === 0 ? ' selected' : '');
  btn.style.background = c.bg;
  btn.title = c.label;
  btn.onclick = () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    colorSeleccionado = c.bg;
  };
  colorRow.appendChild(btn);
});

// Deshabilitar botones de color inicialmente
habilitarColores(false);

function agregarEvento() {
  const fecha = fechaFormateada;
  let recinto = recintoSeleccionado;

  // Si es "Otra organización", obtener el valor del input personalizado
  if (esOtraOrganizacion) {
    recinto = document.getElementById('inp-otra-organizacion').value.trim();
    if (!recinto) {
      alert('Por favor especifica el nombre de la organización.');
      return;
    }
  }

  const direccion = document.getElementById('inp-direccion').value.trim();
  const descripcion = document.getElementById('inp-descripcion').value.trim();

  if (!fecha && !recinto && !descripcion) {
    alert('Completa al menos el día, recinto o descripción.');
    return;
  }

  // Agregar evento al array
  const evento = {
    id: Date.now(), // ID único basado en timestamp
    fechaCompleta: fechaCompleta, // Fecha completa para ordenamiento
    fechaFormato: fecha,
    recinto: recinto || '—',
    direccion: direccion || '',
    descripcion: descripcion || '',
    color: colorRecinto ? colorRecinto : colorSeleccionado
  };

  eventos.push(evento);

  // Renderizar todas las tarjetas ordenadas
  renderizarTarjetas();

  // Limpiar formulario
  document.getElementById('inp-fecha').value = '';
  fechaFormateada = '';
  recintoSeleccionado = '';
  colorRecinto = '';
  esOtraOrganizacion = false;
  document.querySelector('.dropdown-toggle').textContent = 'Selecciona una organización';
  document.getElementById('inp-otra-organizacion').value = '';
  document.getElementById('grupo-otra-organizacion').style.display = 'none';
  document.getElementById('inp-direccion').value = '';
  document.getElementById('inp-descripcion').value = '';
  // Restaurar el primer botón de color como seleccionado y deshabilitar
  document.querySelectorAll('.color-btn').forEach((btn, i) => {
    if (i === 0) btn.classList.add('selected');
  });
  habilitarColores(false);
  colorSeleccionado = colores[0].bg;
  document.getElementById('inp-fecha').focus();
}

// Event listener para procesar la fecha seleccionada
document.getElementById('inp-fecha').addEventListener('change', (e) => {
  if (e.target.value) {
    const fecha = new Date(e.target.value + 'T00:00:00');
    fechaCompleta = fecha; // Guardar fecha completa para ordenamiento
    const diaSemana = diasAbreviados[fecha.getDay()];
    const numeroDia = String(fecha.getDate()).padStart(2, '0');
    fechaFormateada = `${diaSemana} ${numeroDia}`;
  } else {
    fechaFormateada = '';
    fechaCompleta = null;
  }
});

// Agregar con Enter en los inputs (excepto textarea)
['inp-direccion'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') agregarEvento();
  });
});

// Rellenar recintoSeleccionado al seleccionar un item del dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const valor = item.getAttribute('data-value') || item.textContent;

    recintoSeleccionado = valor;

    // Detectar si es "Otra organización"
    if (valor === 'Otra organización') {
      esOtraOrganizacion = true;
      colorRecinto = ''; // Sin color automático
      // Mostrar el input y habilitar colores
      document.getElementById('grupo-otra-organizacion').style.display = 'block';
      document.getElementById('inp-otra-organizacion').focus();
      habilitarColores(true);
      // Desseleccionar todos los botones para que el usuario elija
      document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    } else {
      esOtraOrganizacion = false;
      colorRecinto = item.getAttribute('data-color') || '#2e4057';
      // Ocultar el input y deshabilitar colores
      document.getElementById('grupo-otra-organizacion').style.display = 'none';
      document.getElementById('inp-otra-organizacion').value = '';
      habilitarColores(false);
      // Desseleccionar todos los botones de color
      document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    }

    // Actualizar el texto del botón del dropdown
    document.querySelector('.dropdown-toggle').textContent = recintoSeleccionado;
  });
});

// Función para descargar la cartelera como imagen
async function descargarCartelera() {
  const templateImg = document.querySelector('.template-bg');
  const grilla = document.querySelector('.grilla');
  const tarjetas = grilla.querySelectorAll('.tarjeta');

  try {
    // Cargar la imagen del template
    const templateSrc = templateImg.src;
    const templateImage = new Image();
    templateImage.crossOrigin = 'anonymous';

    templateImage.onload = async () => {
      // Crear un canvas con las dimensiones de la imagen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = templateImage.width;
      canvas.height = templateImage.height;

      // Dibujar la imagen del template
      ctx.drawImage(templateImage, 0, 0);

      // Obtener el ratio respecto al tamaño en pantalla
      const containerWidth = document.querySelector('.template-container').offsetWidth;
      const scaleRatio = canvas.width / containerWidth;

      // Dibujar cada tarjeta sobre el canvas
      for (const tarjeta of tarjetas) {
        const tarjetaCanvas = await html2canvas(tarjeta, {
          backgroundColor: null,
          scale: scaleRatio,
          logging: false,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          removeContainer: true,
        });

        // Calcular posición en el canvas original
        const tarjetaRect = tarjeta.getBoundingClientRect();
        const containerRect = document.querySelector('.template-container').getBoundingClientRect();

        const x = (tarjetaRect.left - containerRect.left) * scaleRatio;
        const y = (tarjetaRect.top - containerRect.top) * scaleRatio;

        // Crear canvas con bordes redondeados para las tarjetas
        const roundedCanvas = document.createElement('canvas');
        const roundedCtx = roundedCanvas.getContext('2d');
        roundedCanvas.width = tarjetaCanvas.width;
        roundedCanvas.height = tarjetaCanvas.height;

        // Dibujar la tarjeta con bordes redondeados
        const radius = 18 * scaleRatio;
        roundedCtx.beginPath();
        roundedCtx.moveTo(radius, 0);
        roundedCtx.lineTo(roundedCanvas.width - radius, 0);
        roundedCtx.quadraticCurveTo(roundedCanvas.width, 0, roundedCanvas.width, radius);
        roundedCtx.lineTo(roundedCanvas.width, roundedCanvas.height - radius);
        roundedCtx.quadraticCurveTo(roundedCanvas.width, roundedCanvas.height, roundedCanvas.width - radius, roundedCanvas.height);
        roundedCtx.lineTo(radius, roundedCanvas.height);
        roundedCtx.quadraticCurveTo(0, roundedCanvas.height, 0, roundedCanvas.height - radius);
        roundedCtx.lineTo(0, radius);
        roundedCtx.quadraticCurveTo(0, 0, radius, 0);
        roundedCtx.closePath();
        roundedCtx.clip();
        roundedCtx.drawImage(tarjetaCanvas, 0, 0);

        // Dibujar tarjeta en el canvas principal
        ctx.drawImage(roundedCanvas, x, y);
      }

      // Descargar
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `cartelera-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    templateImage.onerror = () => {
      alert('No se pudo cargar la imagen del template.');
    };

    templateImage.src = templateSrc;
  } catch (error) {
    console.error('Error al descargar la cartelera:', error);
    alert('Hubo un error al descargar la cartelera. Por favor intenta de nuevo.');
  }
}