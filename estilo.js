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

// Renderizar botones de color
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

function agregarEvento() {
  const fecha = document.getElementById('inp-fecha').value.trim();
  const recinto = recintoSeleccionado;
  const direccion = document.getElementById('inp-direccion').value.trim();
  const descripcion = document.getElementById('inp-descripcion').value.trim();

  if (!fecha && !recinto && !descripcion) {
    alert('Completa al menos el día, recinto o descripción.');
    return;
  }

  // Quitar placeholder si existe
  const grilla = document.getElementById('grilla');
  const placeholder = grilla.querySelector('.placeholder-vacio');
  if (placeholder) placeholder.remove();

  // Crear tarjeta
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';

  tarjeta.innerHTML = `
      <button class="btn-eliminar" onclick="this.closest('.tarjeta').remove()" title="Eliminar">✕</button>
      <div class="tarjeta-header" style="background: ${colorSeleccionado}">
        <div class="tarjeta-fecha">${fecha || '—'}</div>
        <div class="tarjeta-recinto">
          <span class="tarjeta-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg></span>${recinto || '—'}
          
        </div>
      </div>
      <div class="tarjeta-body">
        ${direccion ? `<div class="tarjeta-direccion">${direccion}</div>` : ''}
        <div class="tarjeta-descripcion">${descripcion || ''}</div>
      </div>
    `;

  grilla.appendChild(tarjeta);

  // Limpiar formulario
  document.getElementById('inp-fecha').value = '';
  recintoSeleccionado = '';
  document.querySelector('.dropdown-toggle').textContent = 'Selecciona una organización';
  document.getElementById('inp-direccion').value = '';
  document.getElementById('inp-descripcion').value = '';
  document.getElementById('inp-fecha').focus();
}

// Agregar con Enter en los inputs (excepto textarea)
['inp-fecha', 'inp-direccion'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') agregarEvento();
  });
});

// Rellenar recintoSeleccionado al seleccionar un item del dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    recintoSeleccionado = item.getAttribute('data-value') || item.textContent;
    // Actualizar el texto del botón del dropdown
    document.querySelector('.dropdown-toggle').textContent = recintoSeleccionado;
  });
});