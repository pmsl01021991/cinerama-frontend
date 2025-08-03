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
    .then(res => res.text())
    .then(text => {
      if (text.includes("LOGIN_EXITOSO")) {
        window.location.href = "reservaciones.html"; // 👈 Redirige directamente
      } 
      else if (text.includes("LOGIN_INVALIDO")) {
        this.mensajeError.textContent = "Usuario o contraseña incorrectos.";
        grecaptcha.reset();
      } 
      else if (text.includes("ERROR_CAPTCHA")) {
        this.mensajeError.textContent = "Verifica el Captcha.";
        grecaptcha.reset();
      } 
      else {
        this.mensajeError.textContent = "Error inesperado. Intenta nuevamente.";
      }
    })
    .catch(err => console.error("Error:", err));
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

