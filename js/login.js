
class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");

    this.modal2FA = document.getElementById("modal2FA");
    this.codigoInput = document.getElementById("codigo2FA");
    this.btnVerificarCodigo = document.getElementById("btnVerificarCodigo");

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.enviarFormulario();
      });
    }

    if (this.btnVerificarCodigo) {
      this.btnVerificarCodigo.addEventListener("click", () => {
        this.verificarCodigo();
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
    .then(res => res.text())
    .then(text => {
      console.log("Respuesta del login.php:", text); // 🔹 Debug

      if (text.includes("codigo_enviado")) {
        // Muestra el modal 2FA y NO redirige
        this.modal2FA.style.display = "block";
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
        this.mensajeError.textContent = "Respuesta inesperada del servidor.";
        grecaptcha.reset();
      }
    })

  }

  verificarCodigo() {
    const codigo = this.codigoInput.value.trim();
    if (!codigo) return alert("Ingresa el código 2FA");

    fetch("js/verificar_codigo.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ codigo_2fa: codigo })
    })
    .then(res => res.text())
    .then(text => {
      if (text.includes("OK_2FA")) {
        localStorage.setItem("adminLogeado", "true");
        window.location.href = "reservaciones.html";
      } else if (text.includes("SESION_EXPIRADA")) {
        alert("Sesión expirada. Intenta loguearte de nuevo.");
        window.location.reload();
      } else {
        alert("Código inválido.");
        this.codigoInput.value = "";
        this.codigoInput.focus();
      }

    })
    .catch(err => console.error(err));
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

