// js/login.js

class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.enviarFormulario();
      });
    }
  }

  enviarFormulario() {
    const user = this.usuarioInput.value.trim();
    const pass = this.passwordInput.value.trim();
    const token = document.querySelector('[name="g-recaptcha-response"]').value;

    if (!user || !pass) {
      this.mensajeError.textContent = "Por favor completa todos los campos.";
      return;
    }

    if (!token) {
      this.mensajeError.textContent = "Completa el captcha.";
      return;
    }

    fetch("js/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            usuario: user,
            password: pass,
            "g-recaptcha-response": token
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta servidor:", data);

        if (data.status === "ok") {
            localStorage.setItem("adminLogeado", "true");
            window.location.href = "reservaciones.html";
        } else if (data.status === "fail") {
            localStorage.setItem("showRestrictedToast", "true");
            // retrasar un poco para asegurar que se guarde en localStorage
            setTimeout(() => {
                window.location.href = "index.html";
            }, 100);

            // Guardar intento fallido
            const intentos = JSON.parse(localStorage.getItem("intentosFallidos")) || [];
            intentos.push({ usuario: user, fecha: new Date().toLocaleString() });
            localStorage.setItem("intentosFallidos", JSON.stringify(intentos));

            emailjs.send("service_xpopdts", "template_n0qugjq", {
                usuario: user,
                fecha: new Date().toLocaleString(),
            }).then(() => console.log("📧 Alerta enviada."))
              .catch(err => console.error("❌ Error EmailJS:", err));

            grecaptcha.reset();
        } else {
            this.mensajeError.textContent = data.msg || "Error desconocido";
            grecaptcha.reset();
        }
    })
    .catch(err => {
        console.error("❌ Fetch error:", err);
        this.mensajeError.textContent = "Error de conexión.";
        grecaptcha.reset();
    });

  }
}

new LoginForm("#form-login");






class AdminPanel {
  constructor() {
    this.logoutButton = document.getElementById("cerrarSesionBtn");
    this.validarAcceso();
    this.initEventos();
  }

  validarAcceso() {
    if (localStorage.getItem("adminLogeado") !== "true") {
      alert("Acceso denegado");
      window.location.href = "login.html";
    }
  }

  initEventos() {
    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", () => this.cerrarSesion());
    }
  }

  cerrarSesion() {
    localStorage.removeItem("adminLogeado");
    window.location.href = "index.html";
  }
}

// Inicializar panel admin solo si existe el botón
if (document.getElementById("cerrarSesionBtn")) {
  new AdminPanel();
}

