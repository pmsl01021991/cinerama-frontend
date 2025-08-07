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

        
        document.getElementById("metodo_pago").value = metodoSeleccionado.value;

        if (metodoSeleccionado.value === "billetera") {
            const tipoDoc = document.getElementById("tipo-doc").value;
            const numeroDoc = document.getElementById("numero-doc").value;
            const telefono = document.getElementById("telefono").value;
            const billeteraUsada = document.getElementById("billetera-usada").value;

            if (!tipoDoc || !numeroDoc || !telefono || !billeteraUsada) {
                alert("Por favor complete los datos de la billetera.");
                return;
            }
        }


        // ✅ Mostrar solo mensaje sin enviar al backend
        alert("¡Tus datos han sido enviados!");

        // Limpiar formulario
        document.getElementById("form-pago").reset();
        this.billeterasDetalle.style.display = "none";

        const billeteras = document.querySelectorAll('.opcion-pago');
        billeteras.forEach(i => i.classList.remove('seleccionada'));
        document.getElementById("billetera-usada").value = '';
    }

    toggleBilleterasDetalle(radio) {
        if (radio.value === "billetera") {
            this.billeterasDetalle.style.display = "block";
        } else {
            this.billeterasDetalle.style.display = "none";
        }
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
