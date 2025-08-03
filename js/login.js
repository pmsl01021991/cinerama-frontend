// js/login.js

class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");

    this.adminUser = "admin@cinerama.com";
    this.adminPass = "pmsl123";

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const user = this.usuarioInput.value;
    const pass = this.passwordInput.value;
    const captcha = grecaptcha.getResponse();

    if (!captcha) {
      this.mensajeError.textContent = "Por favor verifica el captcha.";
      return;
    }

    // Enviar el formulario al servidor (PHP) usando fetch POST
    fetch("js/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        usuario: user,
        password: pass,
        "g-recaptcha-response": captcha
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes("OK")) {
        localStorage.setItem("adminLogeado", "true");
        window.location.href = "index.html";
      } else {
        this.mensajeError.textContent = "Usuario o contraseña incorrectos.";

        const intentos = JSON.parse(localStorage.getItem("intentosFallidos")) || [];
        const timestamp = new Date().toLocaleString();
        intentos.push({ usuario: user, fecha: timestamp });
        localStorage.setItem("intentosFallidos", JSON.stringify(intentos));

        // Enviar alerta por EmailJS
        emailjs.send("service_xpopdts", "template_n0qugjq", {
          usuario: user,
          fecha: timestamp,
        })
        .then(() => console.log("📧 Alerta enviada exitosamente a tu correo."))
        .catch((error) => console.error("❌ Error al enviar alerta:", error));
      }
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

