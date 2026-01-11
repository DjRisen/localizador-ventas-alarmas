/***************
 * CARGAR JSON
 ***************/
let municipios = [];

fetch("2901.json")
  .then(r => r.json())
  .then(datos => {
    municipios = datos;
    console.log("Municipios cargados:", municipios.length);
  });

/********************
 * BUSCADOR
 ********************/
function buscarPueblo() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";

  const filtrados = municipios.filter(m =>
    m.nombre.toLowerCase().includes(texto)
  );

  filtrados.forEach(m => {
    resultados.innerHTML += `
      <div class="resultado">
        <strong>${m.nombre}</strong><br>
        👥 Población: ${Number(m.poblacion).toLocaleString("es-ES")}
        <br><br>
        <button onclick="nuevoRobo('${m.nombre}','Robo en vivienda')">
          Simular robo
        </button>
      </div>
    `;
  });
}

/************************
 * ALERTA + SONIDO
 ************************/
function mostrarAlertaRobo(pueblo, tipo) {
  const alerta = document.getElementById("alertaRobo");
  const texto = document.getElementById("textoAlerta");
  const sonido = document.getElementById("sonidoAlarma");

  texto.textContent = `${tipo} en ${pueblo}`;
  alerta.style.display = "block";
  sonido.play();

  setTimeout(() => {
    alerta.style.display = "none";
  }, 10000);
}

/************************
 * EMAIL
 ************************/
function enviarCorreoRobo(pueblo, tipo) {
  emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
    pueblo: pueblo,
    tipo: tipo,
    hora: new Date().toLocaleString("es-ES")
  });
}

/************************
 * DISPARADOR GENERAL
 ************************/
function nuevoRobo(pueblo, tipo) {
  mostrarAlertaRobo(pueblo, tipo);
  enviarCorreoRobo(pueblo, tipo);
}
