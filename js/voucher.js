document.addEventListener("DOMContentLoaded", async () => {
    const reservaId = localStorage.getItem("reservaId");

    if (!reservaId) {
        document.getElementById("v-mensaje-final").textContent =
        "No se encontró ninguna reserva activa.";
        return;
    }

    try {
        const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`);
        if (!resp.ok) throw new Error("Error al obtener la reserva");

        const r = await resp.json();

        // Rellenar datos
        document.getElementById("v-estado").textContent =
        r.estado === "PAGADO" ? "Estado: PAGADO ✅" : `Estado: ${r.estado}`;

        document.getElementById("v-cine").textContent = r.cine || "-";
        document.getElementById("v-pelicula").textContent = r.pelicula_titulo || "-";
        document.getElementById("v-tipo").textContent = r.tipo_cine || "-";
        document.getElementById("v-horario").textContent = r.horario || "-";
        document.getElementById("v-asientos").textContent = r.asientos || "-";
        document.getElementById("v-cantidad").textContent = r.cantidad_entradas ?? "-";
        document.getElementById("v-monto").textContent = r.monto_entradas ?? "-";

        document.getElementById("v-nombre").textContent = r.nombre_cliente || "-";
        document.getElementById("v-correo").textContent = r.correo_cliente || "-";
        document.getElementById("v-metodo").textContent =
        r.metodo_pago === "billetera" && r.billetera
            ? `Billetera (${r.billetera})`
            : (r.metodo_pago || "-");

        // ================================
        // 🚀 ENVIAR AUTOMÁTICAMENTE EL VOUCHER
        // ================================
        async function enviarVoucher() {
            try {
                const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}/enviar-voucher`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                const data = await resp.json();
                console.log("Correo enviado:", data);
            } catch (err) {
                console.error("Error enviando correo:", err);
            }
        }

        // Llamamos a la función
        enviarVoucher();

        // Botón para regresar al inicio
        document.getElementById("btnCerrarVoucher").addEventListener("click", () => {

            // Limpia la reserva para que empiece otra desde 0
            localStorage.removeItem("reservaId");
            localStorage.removeItem("dataCine");
            localStorage.removeItem("horarioSeleccionado");
            localStorage.removeItem("tipoCine");
            localStorage.removeItem("asientosSeleccionados");

            // Redirige a la interfaz inicial
            window.location.href = "index.html";
        });


    } catch (err) {
        console.error(err);
        document.getElementById("v-mensaje-final").textContent =
        "Hubo un problema al cargar el voucher.";
    }
});
