class AsientosHandler {
    constructor() {
        this.seleccionado = 0;
        this.entrada = 12;
        this.butacasSeleccionadasArray = [];
        this.setupBaseEventListeners();
        this.renderizarData();
    }
 
    setupBaseEventListeners() {
        document.getElementById('alerta-confirmar').addEventListener('click', () => this.confirmarCompra());
        document.getElementById('alerta-continuar').addEventListener('click', () => this.cerrarModal());
        document.getElementById('btn-atras').addEventListener('click', () => this.abrirModal());
        document.getElementById('btn-continuar').addEventListener('click', () => this.continuarCompra());
    }
 
    setupSeatEventListeners() {
        document.querySelectorAll('.asiento-box').forEach(asiento => {
            asiento.addEventListener('click', (event) => this.toggleAsiento(event.currentTarget));
        });
    }
 
    confirmarCompra() {
        try {
            const dataCine = JSON.parse(localStorage.getItem('dataCine'));
            localStorage.removeItem('dataCompra');
            window.location.replace(`${dataCine.url}`);
        } catch (error) {
            alert('No se encontraron datos en LocalStorage');
            console.log(error);
        }
    }
 
    cerrarModal() {
        document.getElementById('modal-alert-salir').classList.add('remove');
    }
 
    abrirModal() {
        document.getElementById('modal-alert-salir').classList.remove('remove');
    }
 
    renderizarData() {
        const dataCine = JSON.parse(localStorage.getItem('dataCine'));
        const horaSeleccionado = localStorage.getItem('horarioSeleccionado');
        const tipoCine = localStorage.getItem('tipoCine');
 
        const hoy = new Date();
        const formatear = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        const fechaActualFormateada = `Hoy, ${formatear.format(hoy)}`;
 
        document.getElementById('img-pelicula').src = `${dataCine.poster}`;
        document.getElementById('titulo').textContent = `${dataCine.titulo}`;
        document.getElementById('tipo-pelicula').textContent = `${tipoCine} Entrada Regular`;
        document.getElementById('fecha-actual').textContent = `📅 ${fechaActualFormateada}`;
        document.getElementById('hora').textContent = `⏱️ ${horaSeleccionado}`;
        document.getElementById('sala').textContent = `🔴 SALA ${dataCine.sala}`;
    }
 
    toggleAsiento(asiento) {
        const totalPagar = document.getElementById('total-pagar');
        const totalEntradas = document.getElementById('total-entrada');
        const butacasSeleccionadas = document.getElementById('butacas-seleccionadas');
        const butaca = asiento.getAttribute('data-asiento');
 
        if (asiento.classList.toggle('box-select')) {
            this.seleccionado++;
            this.butacasSeleccionadasArray.push(butaca);
            asiento.querySelector('.emoji-asiento').textContent = '🧍‍♂️🪑';
        } else {
            this.seleccionado--;
            const index = this.butacasSeleccionadasArray.indexOf(butaca);
            asiento.querySelector('.emoji-asiento').textContent = '🪑';
            if (index > -1) {
                this.butacasSeleccionadasArray.splice(index, 1);
            }
        }
 
        totalPagar.textContent = `${this.seleccionado * this.entrada}.00`;
        totalEntradas.textContent = this.seleccionado;
        butacasSeleccionadas.textContent = this.butacasSeleccionadasArray.join(', ');
 
        const btnContinuar = document.getElementById('btn-continuar');
        if (this.seleccionado > 0) {
            btnContinuar.classList.remove('bloquear');
            btnContinuar.disabled = false;
            btnContinuar.style.cursor = 'pointer';
        } else {
            btnContinuar.classList.add('bloquear');
            btnContinuar.disabled = true;
        }
    }
 
    continuarCompra() {
        window.location.href = 'pago.html';
    }
 
    renderizarTextoAsientos() {
        document.querySelectorAll('.asiento-box').forEach(asiento => {
            const codigo = asiento.getAttribute('data-asiento');
            asiento.innerHTML = `<span class="emoji-asiento">🪑</span><span class="asiento-codigo">${codigo}</span>`;
        });
    }
}
 
// ===============================
// Generación dinámica de asientos
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const contenedorAsientos = document.getElementById("asientos-container");
    const tipoSala = localStorage.getItem('tipoCine') || "3D"; // Usa lo guardado en localStorage
 
    const handler = new AsientosHandler();
 
    const funcionId = localStorage.getItem('id_funcion');
if (!funcionId) {
    alert("No se encontró la función seleccionada.");
    return;
}

fetch(`obtener_asientos.php?id_funcion=${funcionId}`)
    .then(response => response.json())
    .then(asientos => {
        if (!Array.isArray(asientos)) {
            throw new Error("Respuesta inesperada del servidor.");
        }

        generarAsientosDesdeBD(asientos);
        handler.renderizarTextoAsientos();
        handler.setupSeatEventListeners();
    })
    .catch(err => console.error("Error al cargar asientos desde la BD:", err));


function generarAsientosDesdeBD(asientosBD) {
    contenedorAsientos.innerHTML = "";

    const asientosPorFila = {};

    // Agrupar por letra de fila
    asientosBD.forEach(asiento => {
        const fila = asiento.numero_asiento.charAt(0);
        if (!asientosPorFila[fila]) asientosPorFila[fila] = [];
        asientosPorFila[fila].push(asiento);
    });

    for (let fila in asientosPorFila) {
        const filaDiv = document.createElement("div");
        filaDiv.classList.add("asientos-fila");

        asientosPorFila[fila].forEach(asiento => {
            const asientoDiv = document.createElement("div");
            asientoDiv.classList.add("asiento-box");
            asientoDiv.dataset.asiento = asiento.numero_asiento;
            asientoDiv.dataset.idAsiento = asiento.id;

            if (!asiento.disponible) {
                asientoDiv.classList.add("ocupado");
                asientoDiv.innerHTML = `<span class="emoji-asiento">❌</span><span class="asiento-codigo">${asiento.numero_asiento}</span>`;
                asientoDiv.style.pointerEvents = "none";
            } else {
                asientoDiv.innerHTML = `<span class="emoji-asiento">🪑</span><span class="asiento-codigo">${asiento.numero_asiento}</span>`;
            }

            filaDiv.appendChild(asientoDiv);
        });

        contenedorAsientos.appendChild(filaDiv);
    }
}
});