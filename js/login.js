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
      // Ya no escuchamos el submit porque usaremos el botón con reCAPTCHA
      this.form.addEventListener("submit", (e) => e.preventDefault());
    }
  }
}

window.loginWithCaptcha = function(token) {
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const mensajeError = document.getElementById("mensajeError");

  const user = usuarioInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!user || !pass) {
    mensajeError.textContent = "Por favor completa todos los campos.";
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
    if (text.includes("OK")) {
      localStorage.setItem("adminLogeado", "true");
      window.location.href = "index.html";
    } else {
      mensajeError.textContent = text === "LOGIN_INVALIDO"
        ? "Usuario o contraseña incorrectos."
        : "Error de captcha o servidor.";

      const intentos = JSON.parse(localStorage.getItem("intentosFallidos")) || [];
      intentos.push({ usuario: user, fecha: new Date().toLocaleString() });
      localStorage.setItem("intentosFallidos", JSON.stringify(intentos));

      emailjs.send("service_xpopdts", "template_n0qugjq", {
        usuario: user,
        fecha: new Date().toLocaleString(),
      })
      .then(() => console.log("📧 Alerta enviada."))
      .catch(err => console.error("❌ Error EmailJS:", err));
    }
  })
  .catch(err => {
    console.error("❌ Fetch error:", err);
    mensajeError.textContent = "Error de conexión.";
  });
};

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

