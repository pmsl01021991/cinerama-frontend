class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.enviarFormulario();
    });
  }

  enviarFormulario() {
    const user = this.usuarioInput.value.trim();
    const pass = this.passwordInput.value.trim();
    const token = document.querySelector('[name="g-recaptcha-response"]')?.value;

    // Resetear mensajes
    this.mensajeError.textContent = "";

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
    .then(res => {
      if (!res.ok) throw new Error("Error HTTP: " + res.status);
      return res.text();
    })
    .then(text => {
      console.log("Respuesta del servidor:", text); // Debug
      if (text.trim() === "LOGIN_EXITOSO") {
        window.location.href = "reservaciones.html";
      } else if (text.trim() === "LOGIN_INVALIDO") {
        this.mensajeError.textContent = "Usuario o contraseña incorrectos.";
        grecaptcha.reset();
      } else if (text.trim() === "ERROR_CAPTCHA") {
        this.mensajeError.textContent = "Captcha inválido. Intenta nuevamente.";
        grecaptcha.reset();
      } else {
        this.mensajeError.textContent = "Error inesperado: " + text;
      }
    })
    .catch(err => {
      console.error("Error en fetch:", err);
      this.mensajeError.textContent = "Error de conexión. Intenta más tarde.";
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

