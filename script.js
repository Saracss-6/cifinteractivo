// script.js 
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js cargado correctamente');

  // === Mostrar secciones ===
  window.mostrarSeccion = function (id) {
    document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("visible"));
    const el = document.getElementById(id);
    if (el) el.classList.add("visible");
  };

  // === Canasta ===
  const canasta = document.getElementById("canasta");
  function obtenerSeccionCanasta(nombreSeccion) {
    let seccion = canasta.querySelector(`[data-seccion="${nombreSeccion}"]`);
    if (!seccion) {
      seccion = document.createElement("div");
      seccion.dataset.seccion = nombreSeccion;
      seccion.innerHTML = `<h3>${nombreSeccion}</h3><ul></ul>`;
      canasta.appendChild(seccion);
    }
    return seccion.querySelector("ul");
  }

  // === Modal de calificadores ===
  const modalCalificador = document.getElementById("modalCalificador");
  const cerrarModal = document.getElementById("cerrarModal");
  const textoCalificador = document.getElementById("textoCalificador");
  const btnGuardar = document.getElementById("guardarCalificador");
  let codigoTemporal = null;

  // === Contenido del modal por sección ===
  function contenidoParaSeccion(seccion) {
    if (seccion === "Funciones corporales") {
      return `
        <h3>Funciones corporales</h3>
        <p>Grado de deterioro:</p>
        <select id="cal1">
          <option value="">-- Seleccione --</option>
          <option value="1">1 – Deterioro leve</option>
          <option value="2">2 – Deterioro moderado</option>
          <option value="3">3 – Deterioro grave</option>
          <option value="4">4 – Deterioro total</option>
          <option value="8">8 – No especificado</option>
          <option value="9">9 – No aplicable</option>
        </select>`;
    }

    if (seccion === "Estructuras corporales") {
      return `
        <h3>Estructuras corporales</h3>
        <p>Primer calificador – Deficiencia:</p>
        <select id="cal1">
          <option value="">-- Seleccione --</option>
          <option value="0">0 – No existe deficiencia</option>
          <option value="1">1 – Deficiencia leve</option>
          <option value="2">2 – Deficiencia moderada</option>
          <option value="3">3 – Deficiencia grave</option>
          <option value="4">4 – Deficiencia completa</option>
          <option value="8">8 – No especificada</option>
          <option value="9">9 – No aplicable</option>
        </select>

        <p>Segundo calificador – Naturaleza de deficiencia:</p>
        <select id="cal2">
          <option value="">-- Seleccione --</option>
          <option value="0">0 – Sin cambio</option>
          <option value="1">1 – Ausencia total</option>
          <option value="2">2 – Ausencia parcial</option>
          <option value="3">3 – Parte adicional</option>
          <option value="4">4 – Dimensiones aberrantes</option>
          <option value="5">5 – Discontinuidad</option>
          <option value="6">6 – Posición desviada</option>
          <option value="7">7 – Cambio cualitativo</option>
          <option value="8">8 – No especificada</option>
          <option value="9">9 – No aplicable</option>
        </select>

        <p>Tercer calificador – Localización de deficiencia:</p>
        <select id="cal3">
          <option value="">-- Seleccione --</option>
          <option value="1">1 – Derecha</option>
          <option value="2">2 – Izquierda</option>
          <option value="3">3 – Ambos lados</option>
          <option value="4">4 – Frontal</option>
          <option value="5">5 – Posterior</option>
          <option value="6">6 – Proximal</option>
          <option value="7">7 – Distal</option>
          <option value="8">8 – No especificada</option>
          <option value="9">9 – No aplicable</option>
        </select>`;
    }

    if (seccion === "Factores ambientales") {
      return `
        <h3>Factores ambientales</h3>
        <p>Seleccione si es <b>Barrera</b> o <b>Facilitador</b>:</p>
        <select id="tipoFactor">
          <option value="">-- Seleccione --</option>
          <option value="Barrera">Barrera</option>
          <option value="Facilitador">Facilitador</option>
        </select>

        <p>Calificador:</p>
        <select id="nivelFactor">
          <option value="">-- Seleccione --</option>
          <option value="1">1 – Ligero</option>
          <option value="2">2 – Moderado</option>
          <option value="3">3 – Grave</option>
          <option value="4">4 – Completo</option>
          <option value="8">8 – No especificado</option>
          <option value="9">9 – No aplicable</option>
        </select>`;
    }

    if (seccion === "Actividades y participación") {
      return `
        <h3>Actividades y participación</h3>
        <p>Calificador de realización:</p>
        <select id="cal1">
          <option value="">-- Seleccione --</option>
          <option value="1">1 – Ligera</option>
          <option value="2">2 – Moderada</option>
          <option value="3">3 – Grave</option>
          <option value="4">4 – Completa</option>
          <option value="8">8 – No especificado</option>
          <option value="9">9 – No aplicable</option>
        </select>`;
    }

    return `<p>Seleccione calificadores</p>`;
  }

  function mostrarModal(seccion, codigo, nombre) {
    codigoTemporal = { seccion, codigo, nombre };
    textoCalificador.innerHTML = contenidoParaSeccion(seccion);
    modalCalificador.classList.add("activo");
  }

  cerrarModal.addEventListener('click', () => modalCalificador.classList.remove('activo'));
  window.addEventListener('click', e => { if (e.target === modalCalificador) modalCalificador.classList.remove('activo'); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') modalCalificador.classList.remove('activo'); });

  // === Generar descripción textual ===
  function generarDescripcion(seccion, valores) {
    if (seccion === "Factores ambientales") {
      const tipo = document.getElementById("tipoFactor")?.value;
      const nivel = document.getElementById("nivelFactor")?.value;
      const map = { 1: "ligero", 2: "moderado", 3: "grave", 4: "completo" };
      return tipo ? `${tipo.toLowerCase()} ${map[nivel] || ""}`.trim() : "";
    }
    return "";
  }

  // === Guardar selección en canasta (CON LA CORRECCIÓN CIF) ===
  btnGuardar.addEventListener('click', () => {
    if (!codigoTemporal) return;

    const { seccion, codigo, nombre } = codigoTemporal;
    const lista = obtenerSeccionCanasta(seccion);
    let codigoFinal = "";

    // ⭐ CORRECCIÓN CIF PARA FACTORES AMBIENTALES ⭐
    if (seccion === "Factores ambientales") {
      const tipo = document.getElementById("tipoFactor")?.value;
      const nivel = document.getElementById("nivelFactor")?.value;

      if (!tipo || !nivel) {
        alert("Seleccione tipo y nivel antes de guardar.");
        return;
      }

      if (tipo === "Facilitador") {
        codigoFinal = `${codigo}+${nivel}`;
      } else if (tipo === "Barrera") {
        codigoFinal = `${codigo}.${nivel}`;
      }
    } else {
      // Otras secciones
      const valores = Array.from(
        textoCalificador.querySelectorAll("select")
      ).map(el => el.value.trim());

      codigoFinal = `${codigo}.${valores.join("") || "0"}`;
    }

    const descripcion = generarDescripcion(seccion);

    const li = document.createElement("li");
    li.innerHTML = `<b>${codigoFinal}</b> – ${nombre} ${descripcion} <button class="eliminar">❌</button>`;
    li.querySelector(".eliminar").addEventListener("click", () => li.remove());
    lista.appendChild(li);

    modalCalificador.classList.remove('activo');
    codigoTemporal = null;
  });

  // === Detectar clic en botones de la página ===
  document.addEventListener('click', e => {
    const btn = e.target.closest('button[data-valor]');
    if (!btn) return;
    const codigo = btn.dataset.valor;
    const seccion = btn.dataset.seccion || "Otros";
    const nombre = btn.innerText.trim();
    mostrarModal(seccion, codigo, nombre);
  });

  // === CSS para tooltips flotantes ===
  const style = document.createElement("style");
  style.textContent = `
    [data-definicion] { position: relative; cursor: help; }
    [data-definicion]::after {
      content: attr(data-definicion);
      position: absolute;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      background: #004d3d;
      color: #fff;
      padding: 8px 10px;
      border-radius: 8px;
      white-space: pre-wrap;
      width: 250px;
      font-size: 0.85rem;
      line-height: 1.2;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease;
      z-index: 9999;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
    [data-definicion]:hover::after,
    [data-definicion]:focus::after {
      opacity: 1;
      visibility: visible;
    }
  `;
  document.head.appendChild(style);
});

// === Cargar DEFINICIONES desde definiciones.json ===
fetch("definiciones.json")
  .then(res => res.json())
  .then(data => {
    const definiciones = {};
    if (Array.isArray(data)) {
      data.forEach(d => { definiciones[d.codigo] = d.texto; });
    } else {
      Object.assign(definiciones, data);
    }

    document.querySelectorAll("button[data-valor]").forEach(btn => {
      const codigo = btn.dataset.valor;
      const defin = definiciones[codigo];
      if (defin) btn.setAttribute("data-definicion", defin);
    });
  })
  .catch(err => console.error("Error cargando definiciones:", err));
