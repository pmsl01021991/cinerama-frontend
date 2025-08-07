class PagoFormHandler {
    constructor() {
        this.radios = document.querySelectorAll('input[name="metodo"]');
        this.billeterasDetalle = document.getElementById("billeteras-detalle");
        this.btnPagar = document.getElementById("btn-pagar");

        this.init();
    }

    init() {
        this.radios.forEach(radio => {
            radio.addEventListener("change", () => this.toggleBilleterasDetalle(radio));
        });

        this.btnPagar.addEventListener("click", (e) => this.procesarPago(e));
    }

async procesarPago(e) {
    e.preventDefault();

    const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked');
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;

    if (!nombre || !correo || !metodoSeleccionado) {
        alert("Por favor complete todos los campos y seleccione un método de pago.");
        return;
    }

    const datos = {
        nombre,
        correo,
        metodo_pago: metodoSeleccionado.value
    };

    if (metodoSeleccionado.value === "billetera") {
        const tipoDoc = document.getElementById("tipo-doc").value;
        const numeroDoc = document.getElementById("numero-doc").value;
        const telefono = document.getElementById("telefono").value;
        const billeteraUsada = document.getElementById("billetera-usada").value;

        if (!tipoDoc || !numeroDoc || !telefono || !billeteraUsada) {
            alert("Por favor complete los datos de la billetera.");
            return;
        }

        // Agregar al objeto para enviar
        datos.tipo_doc = tipoDoc;
        datos.numero_doc = numeroDoc;
        datos.telefono = telefono;
        datos.billetera = billeteraUsada;
    }

    // ⬇️ Aquí es donde se envía al PHP
    try {
        const response = await fetch('registrar_pago.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (resultado.success) {
            alert("✅ ¡Pago registrado con éxito!");
        } else {
            alert("❌ Error: " + resultado.message);
        }

    } catch (error) {
        console.error("Error de red o del servidor:", error);
        alert("❌ Hubo un problema al registrar el pago.");
    }

    // Limpiar formulario
    document.getElementById("form-pago").reset();
    this.billeterasDetalle.style.display = "none";

    document.querySelectorAll('.opcion-pago').forEach(i => i.classList.remove('seleccionada'));
    document.getElementById("billetera-usada").value = '';
}
}


class BilleteraSelector {
    constructor() {
        this.billeteras = document.querySelectorAll('.opcion-pago');
        this.inputBilletera = document.getElementById('billetera-usada');

        this.init();
    }

    init() {
        this.billeteras.forEach(img => {
            img.addEventListener('click', () => this.seleccionarBilletera(img));
        });
    }

    seleccionarBilletera(img) {
        const billeteraSeleccionada = img.getAttribute('data-billetera');
        this.inputBilletera.value = billeteraSeleccionada;

        this.billeteras.forEach(i => i.classList.remove('seleccionada'));
        img.classList.add('seleccionada');

        document.getElementById("yapeImagenContainer").style.display = "none";
        document.getElementById("plinImagenContainer").style.display = "none";
        if (billeteraSeleccionada === "Yape") {
            document.getElementById("yapeImagenContainer").style.display = "block";
        } else if (billeteraSeleccionada === "Plin") {
            document.getElementById("plinImagenContainer").style.display = "block";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PagoFormHandler();
    new BilleteraSelector();
});
