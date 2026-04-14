const CONFIG_IMAGEN = {

  // ── FECHA (ej: "Sab 04") ──
  fecha: {
    multiplicador: 1.0,   // 1.0 = tamaño original del DOM. Sube a 1.2 para más grande
    bold: true,
    color: 'white',
    familia: '"Source Sans 3", Arial, sans-serif',
  },

  // ── RECINTO (nombre organización) ──
  recinto: {
    multiplicador: 1.0,
    italic: true,
    bold: true,
    color: 'rgba(255,255,255,0.95)',
    familia: 'Nunito, Arial, sans-serif',
    mostrarIcono: true,   // true = muestra el ícono 📍 antes del nombre
    icono: '📍',          // puedes cambiarlo a '▸', '•', '→', etc.
  },

  // ── DIRECCIÓN ──
  direccion: {
    multiplicador: 1.0,
    color: 'rgba(255,255,255,0.85)',
    familia: 'Nunito, Arial, sans-serif',
  },

  // ── DESCRIPCIÓN (cuerpo blanco) ──
  descripcion: {
    multiplicador: 1.0,
    bold: true,
    color: '#444',
    familia: 'Nunito, Arial, sans-serif',
  },

  // ── TARJETA ──
  tarjeta: {
    borderRadius: 14,     // redondez de esquinas en px
    padding: 10,          // espaciado interno en px
    sombra: true,
  },
};
// ══════════════════════════════════════════════════════

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

  if (!fecha || !recinto || !descripcion) {
    alert('Completa fecha, organización y descripción.');
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

// Función para descargar las tarjetas como se ven en pantalla
async function descargarCartelera() {
  const btn = document.querySelector('.btn-descargar');

  if (eventos.length === 0) {
    alert('No hay tarjetas para descargar');
    return;
  }

  btn.textContent = 'Generando imagen...';
  btn.disabled = true;

  try {
    await document.fonts.ready;

    const templateBg  = document.querySelector('.template-bg');
    const grillaOriginal = document.getElementById('grilla');

    // Dimensiones reales del template PNG
    const TW = templateBg.naturalWidth;
    const TH = templateBg.naturalHeight;

    // Escala DOM → PNG real
    const bgRect    = templateBg.getBoundingClientRect();
    const escalaX   = TW / bgRect.width;
    const escalaY   = TH / bgRect.height;

    // Posición y tamaño de la grilla en el PNG real
    const grillaRect = grillaOriginal.getBoundingClientRect();
    const offsetX = (grillaRect.left - bgRect.left) * escalaX;
    const offsetY = (grillaRect.top  - bgRect.top)  * escalaY;
    const grillaW = grillaRect.width  * escalaX;
    const grillaH = grillaRect.height * escalaY;

    // Crear un div invisible del tamaño EXACTO de la grilla (950x750)
    // con position:fixed fuera de pantalla
    const contenedor = document.createElement('div');
    contenedor.style.cssText = `
      position: fixed;
      top: -99999px;
      left: -99999px;
      width: ${grillaRect.width}px;
      height: ${grillaRect.height}px;
      overflow: hidden;
      background: transparent;
    `;

    // Clonar la grilla manteniendo position:absolute y transform
    // pero reubicándola en (0,0) dentro del contenedor
    const grillaClone = grillaOriginal.cloneNode(true);
    grillaClone.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      transform: none;
      width: ${grillaRect.width}px;
      height: ${grillaRect.height}px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: 8px;
      column-gap: 10px;
      row-gap: 10px;
      padding: 15px;
      align-items: start;
      overflow: hidden;
      background: transparent;
    `;

    // Copiar gridRowEnd del masonry y ocultar botón eliminar
    grillaOriginal.querySelectorAll('.tarjeta').forEach((t, i) => {
      const tc = grillaClone.querySelectorAll('.tarjeta')[i];
      if (!tc) return;
      tc.style.gridRowEnd = t.style.gridRowEnd;
      const b = tc.querySelector('.btn-eliminar');
      if (b) b.style.display = 'none';
    });

    contenedor.appendChild(grillaClone);
    document.body.appendChild(contenedor);

    // Esperar render + fuentes completamente cargadas
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 500));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    // Primer render en seco (dom-to-image necesita "calentarse" con fuentes externas)
    await domtoimage.toPng(contenedor, { width: grillaRect.width, height: grillaRect.height });
    await new Promise(r => setTimeout(r, 200));

    // Captura real
    const dataUrl = await domtoimage.toPng(contenedor, {
      width:  grillaRect.width,
      height: grillaRect.height,
      style: { background: 'transparent' },
    });

    document.body.removeChild(contenedor);

    // Canvas final del tamaño del template PNG, fondo transparente
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = dataUrl; });

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width  = TW;
    finalCanvas.height = TH;
    const ctx = finalCanvas.getContext('2d');
    ctx.clearRect(0, 0, TW, TH);
    ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, grillaW, grillaH);

    const link = document.createElement('a');
    link.href = finalCanvas.toDataURL('image/png');
    link.download = `tarjetas-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();

  } catch (error) {
    console.error(error);
    alert('Error al generar imagen: ' + error.message);
  } finally {
    btn.textContent = 'Descargar Cartelera';
    btn.disabled = false;
  }
}