class AsientosHandler {
    constructor() {
        this.seleccionado = 0;                 // cantidad de butacas seleccionadas
        this.entrada = 12;                     // precio por entrada
        this.butacasSeleccionadasArray = [];   // ej. ["A4","D7"]

        this.setupBaseEventListeners();
        this.renderizarData();
    }

    // Listeners básicos (atrás, modal, continuar)
    setupBaseEventListeners() {
        document
            .getElementById('alerta-confirmar')
            .addEventListener('click', () => this.confirmarCompra());

        document
            .getElementById('alerta-continuar')
            .addEventListener('click', () => this.cerrarModal());

        document
            .getElementById('btn-atras')
            .addEventListener('click', () => this.abrirModal());

        document
            .getElementById('btn-continuar')
            .addEventListener('click', () => this.continuarCompra());
    }

    // Listeners para cada asiento generado dinámicamente
    setupSeatEventListeners() {
        document.querySelectorAll('.asiento-box').forEach(asiento => {
            asiento.addEventListener('click', (event) =>
                this.toggleAsiento(event.currentTarget)
            );
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

    // Pinta la info de la película en la parte izquierda
    renderizarData() {
        const dataCine = JSON.parse(localStorage.getItem('dataCine'));
        const horaSeleccionado = localStorage.getItem('horarioSeleccionado');
        const tipoCine = localStorage.getItem('tipoCine');

        const hoy = new Date();
        const formatear = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const fechaActualFormateada = `Hoy, ${formatear.format(hoy)}`;

        document.getElementById('img-pelicula').src = `${dataCine.poster}`;
        document.getElementById('titulo').textContent = `${dataCine.titulo}`;
        document.getElementById('tipo-pelicula').textContent = `${tipoCine} Entrada Regular`;
        document.getElementById('fecha-actual').textContent = `📅 ${fechaActualFormateada}`;
        document.getElementById('hora').textContent = `⏱️ ${horaSeleccionado}`;
        document.getElementById('sala').textContent = `🔴 SALA ${dataCine.sala}`;
    }

    // Selección / deselección de asientos
    toggleAsiento(asiento) {
        const totalPagar = document.getElementById('total-pagar');
        const totalEntradas = document.getElementById('total-entrada');
        const butacasSeleccionadas = document.getElementById('butacas-seleccionadas');
        const butaca = asiento.getAttribute('data-asiento');

        if (asiento.classList.toggle('box-select')) {
            // seleccionar
            this.seleccionado++;
            this.butacasSeleccionadasArray.push(butaca);
            asiento.querySelector('.emoji-asiento').textContent = '🧍‍♂️🪑';
        } else {
            // deseleccionar
            this.seleccionado--;
            const index = this.butacasSeleccionadasArray.indexOf(butaca);
            asiento.querySelector('.emoji-asiento').textContent = '🪑';
            if (index > -1) {
                this.butacasSeleccionadasArray.splice(index, 1);
            }
        }

        // actualizar totales en la UI
        totalPagar.textContent = `${this.seleccionado * this.entrada}.00`;
        totalEntradas.textContent = this.seleccionado;
        butacasSeleccionadas.textContent = this.butacasSeleccionadasArray.join(', ');

        // habilitar / bloquear botón continuar
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

    // 👉 Aquí se manda a la BD: asientos, cantidad_entradas, monto_entradas
    async continuarCompra() {
        const reservaId = localStorage.getItem("reservaId");
        if (!reservaId) {
            alert("No se encontró la reserva. Vuelve a seleccionar el cine.");
            window.location.href = "index.html#cines";
            return;
        }

        const totalEntradas = this.seleccionado;
        const totalPagar = this.seleccionado * this.entrada;
        const asientos = this.butacasSeleccionadasArray;

        try {
            const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    asientos: asientos.join(", "),     // "A4, D7"
                    cantidad_entradas: totalEntradas,  // mismo nombre que la columna
                    monto_entradas: totalPagar         // idem
                })
            });

            if (!resp.ok) throw new Error("Error al actualizar asientos");

            console.log("Reserva actualizada con asientos y totales");
            window.location.href = 'pago.html';
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar la selección de asientos.");
        }
    }

    // Poner emoji y código de asiento dentro de cada caja
    renderizarTextoAsientos() {
        document.querySelectorAll('.asiento-box').forEach(asiento => {
            const codigo = asiento.getAttribute('data-asiento');
            asiento.innerHTML = `
                <span class="emoji-asiento">🪑</span>
                <span class="asiento-codigo">${codigo}</span>
            `;
        });
    }
}

// ===============================
// Generación dinámica de asientos
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const contenedorAsientos = document.getElementById("asientos-container");
    const tipoSala = localStorage.getItem('tipoCine') || "3D";

    const handler = new AsientosHandler();

    fetch(".vscode/salas.json")
        .then(response => response.json())
        .then(async data => {
            const config = data[tipoSala];

            if (!config) {
                console.error(`No hay configuración para la sala: ${tipoSala}`);
                return;
            }

            generarAsientos(config.filas, config.columnas, config.pasillo);

            

            // ===============================
            // Cargar ASIENTOS OCUPADOS desde la BD
            // ===============================
            async function marcarAsientosOcupados() {

                const dataCine = JSON.parse(localStorage.getItem("dataCine"));
                const horaSeleccionado = localStorage.getItem("horarioSeleccionado");

                const peli = dataCine.titulo;
                const sala = dataCine.sala;
                const horario = horaSeleccionado;

                const resp = await fetch(
                    `http://localhost:3001/api/reservas/ocupados/${encodeURIComponent(peli)}/${sala}/${encodeURIComponent(horario)}`
                );

                const data = await resp.json();

                data.ocupados.forEach(cod => {
                    const asiento = document.querySelector(`.asiento-box[data-asiento="${cod}"]`);
                    if (asiento) {
                        asiento.classList.add("asiento-ocupado");
                        asiento.innerHTML = "❌";
                        asiento.style.pointerEvents = "none";
                    }
                });
            }

            // EJECUCIÓN EN ORDEN
            await marcarAsientosOcupados();
            handler.renderizarTextoAsientos();
            handler.setupSeatEventListeners();


        })
        .catch(err => console.error("Error al cargar el JSON de salas:", err));

    function generarAsientos(filas, columnas, pasillo) {
        contenedorAsientos.innerHTML = "";

        for (let i = 0; i < filas; i++) {
            const fila = document.createElement("div");
            fila.classList.add("asientos-fila");

            const letraFila = String.fromCharCode(65 + i); // A, B, C...

            for (let j = 1; j <= columnas; j++) {

                // Pasillo como rango [7, 8]
                if (Array.isArray(pasillo)) {
                    if (j === pasillo[0] + 1) {
                        for (let k = pasillo[0]; k < pasillo[1]; k++) {
                            const espacio = document.createElement("div");
                            espacio.classList.add("asiento-espacio");
                            fila.appendChild(espacio);
                        }
                    }
                }
                // Pasillo como un solo número
                else if (j === pasillo + 1) {
                    const espacio = document.createElement("div");
                    espacio.classList.add("asiento-espacio");
                    fila.appendChild(espacio);
                }

                const asiento = document.createElement("div");
                asiento.classList.add("asiento-box");
                asiento.dataset.asiento = `${letraFila}${j}`;
                fila.appendChild(asiento);
            }

            contenedorAsientos.appendChild(fila);
        }
    }
});
