// ══════════════════════════════════════════════════════
// ⚙️  CONFIGURACIÓN DE LA IMAGEN DESCARGADA
//     Modifica estos valores para ajustar el diseño
// ══════════════════════════════════════════════════════
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
  const btn = document.querySelector('.btn-descargar');
  btn.textContent = 'Generando imagen...';
  btn.disabled = true;
  const btnContainer = document.querySelector('.btn-descargar-container');
  btnContainer.style.display = 'none';

  try {
    // ── 1. Cargar imagen de fondo ──
    const templateBg = document.querySelector('.template-bg');
    const bgImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = templateBg.src;
    });

    const W = bgImg.naturalWidth;
    const H = bgImg.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Dibujar fondo a resolución original
    ctx.drawImage(bgImg, 0, 0, W, H);

    // ── 2. Calcular escala entre el DOM y la imagen real ──
    const bgRect = templateBg.getBoundingClientRect();
    const escalaX = W / bgRect.width;
    const escalaY = H / bgRect.height;

    // ── 3. Helper wrap texto ──
    function wrapText(ctx, texto, x, y, maxW, lineH) {
      const palabras = texto.split(' ');
      let linea = '';
      let cy = y;
      for (const p of palabras) {
        const prueba = linea + p + ' ';
        if (ctx.measureText(prueba).width > maxW && linea) {
          ctx.fillText(linea.trim(), x, cy);
          cy += lineH;
          linea = p + ' ';
        } else linea = prueba;
      }
      if (linea.trim()) { ctx.fillText(linea.trim(), x, cy); cy += lineH; }
      return cy;
    }

    // ── 4. Dibujar cada tarjeta ──
    const tarjetas = document.querySelectorAll('.tarjeta');

    for (const tarjeta of tarjetas) {
      const domRect = tarjeta.getBoundingClientRect();

      // Convertir coordenadas DOM → píxeles de la imagen real
      const x = (domRect.left - bgRect.left) * escalaX;
      const y = (domRect.top  - bgRect.top)  * escalaY;
      const w = domRect.width  * escalaX;
      const h = domRect.height * escalaY;
      const r = 18 * escalaX;
      const pad = 14 * escalaX;

      const headerEl     = tarjeta.querySelector('.tarjeta-header');
      const fechaEl      = tarjeta.querySelector('.tarjeta-fecha');
      const recintoEl    = tarjeta.querySelector('.tarjeta-recinto');
      const direccionEl  = tarjeta.querySelector('.tarjeta-direccion');
      const descripcionEl = tarjeta.querySelector('.tarjeta-descripcion');

      const colorHeader = headerEl?.style.background || '#555';
      const headerDomH  = headerEl?.getBoundingClientRect().height || domRect.height * 0.5;
      const headerH     = headerDomH * escalaY;

      const getSize = (el) => el ? parseFloat(getComputedStyle(el).fontSize) * escalaY : 12 * escalaY;
      const fechaSize   = getSize(fechaEl);
      const recintoSize = getSize(recintoEl);
      const dirSize     = getSize(direccionEl);
      const descSize    = getSize(descripcionEl);

      // Sombra + fondo blanco con border-radius
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 16 * escalaX;
      ctx.shadowOffsetY = 5 * escalaY;
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
      ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r);
      ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h);
      ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r);
      ctx.quadraticCurveTo(x,y,x+r,y);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.restore();

      // Header coloreado (esquinas superiores)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
      ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+headerH);
      ctx.lineTo(x,y+headerH);
      ctx.lineTo(x,y+r);
      ctx.quadraticCurveTo(x,y,x+r,y);
      ctx.closePath();
      ctx.fillStyle = colorHeader;
      ctx.fill();
      ctx.restore();

      // Fecha
      let ty = y + pad + fechaSize;
      if (fechaEl) {
        ctx.fillStyle = 'white';
        ctx.font = `bold ${fechaSize}px "Source Sans 3", Arial, sans-serif`;
        ctx.fillText(fechaEl.textContent.trim(), x + pad, ty);
        ty += fechaSize * 0.5;
      }

      // Recinto
      if (recintoEl) {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = `italic bold ${recintoSize}px Nunito, Arial, sans-serif`;
        const txt = recintoEl.innerText.replace(/^\s*.\s*/, '').trim();
        ty = wrapText(ctx, '📍 ' + txt, x + pad, ty, w - pad*2, recintoSize * 1.3);
      }

      // Dirección
      if (direccionEl) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `${dirSize}px Nunito, Arial, sans-serif`;
        wrapText(ctx, direccionEl.textContent.trim(), x + pad, ty, w - pad*2, dirSize * 1.3);
      }

      // Descripción
      if (descripcionEl) {
        ctx.fillStyle = '#444';
        ctx.font = `bold ${descSize}px Nunito, Arial, sans-serif`;
        let ly = y + headerH + pad + descSize;
        for (const parrafo of descripcionEl.textContent.trim().split('\n')) {
          if (parrafo.trim()) ly = wrapText(ctx, parrafo.trim(), x + pad, ly, w - pad*2, descSize * 1.45);
          else ly += descSize * 0.5;
        }
      }
    }

    // ── 5. Descargar ──
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `cartelera-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();

  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  } finally {
    btnContainer.style.display = '';
    btn.textContent = 'Descargar Cartelera';
    btn.disabled = false;
  }
}