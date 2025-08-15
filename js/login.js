// js/login.js

// Inicializa EmailJS SOLO en la página de login (evita warnings en otras páginas)
document.addEventListener("DOMContentLoaded", () => {
  const isLoginPage = !!document.getElementById("LoginForm");
  if (isLoginPage && window.emailjs && typeof emailjs.init === "function") {
    try { emailjs.init("nFJQXJun_0mdXBQ6U"); } catch (_) {}
  }
});

class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.loading = false;
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.enviarFormulario();
    });
  }

  setLoading(loading) {
    this.loading = !!loading;
    if (this.submitBtn) {
      this.submitBtn.disabled = this.loading;
      this.submitBtn.textContent = this.loading ? "Procesando..." : "Iniciar sesión";
    }
  }

  enviarFormulario() {
    if (this.loading) return; // evita doble click

    const user = (this.usuarioInput?.value || "").trim();
    const pass = (this.passwordInput?.value || "").trim();

    if (!user || !pass) {
      this.mensajeError.textContent = "Por favor completa todos los campos.";
      return;
    }

    // Verifica que el captcha esté cargado
    if (typeof grecaptcha === "undefined") {
      this.mensajeError.textContent = "No se pudo cargar el captcha. Recarga la página.";
      return;
    }

    // Token del reCAPTCHA v2 (checkbox)
    const token = grecaptcha.getResponse();
    if (!token) {
      this.mensajeError.textContent = "Completa el captcha.";
      return;
    }

    this.setLoading(true);
    this.mensajeError.textContent = "";

    // Si sirves el frontend desde el mismo backend (http://localhost:3001), usa ruta relativa:
    const url = "/api/auth/login";
    // Si usas Live Server, usa: const url = "http://localhost:3001/api/auth/login";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: user,
        password: pass,
        "g-recaptcha-response": token, // nombre estándar
      }),
    })
      .then(async (res) => {
        const text = await res.text();

        if (res.ok && text === "OK") {
          localStorage.setItem("adminLogeado", "true");
          try { grecaptcha.reset(); } catch (_) {}
          // 👉 redirige al inicio después del login exitoso
          window.location.href = "index.html";
          return;
        }

        // Falló login o captcha
        const intentos = JSON.parse(localStorage.getItem("intentosFallidos")) || [];
        intentos.push({ usuario: user, fecha: new Date().toLocaleString() });
        localStorage.setItem("intentosFallidos", JSON.stringify(intentos));
        localStorage.setItem("showRestrictedToast", "true");

        // Notificación opcional (solo si EmailJS está cargado)
        if (window.emailjs && typeof emailjs.send === "function") {
          emailjs
            .send("service_xpopdts", "template_n0qugjq", {
              usuario: user,
              fecha: new Date().toLocaleString(),
            })
            .catch((err) => console.error("❌ Error EmailJS:", err));
        }

        this.mensajeError.textContent = text || "Login inválido";
        try { grecaptcha.reset(); } catch (_) {}

        // (ya NO redirigimos en fallo; te quedas en login viendo el error)
        // window.location.href = "index.html";
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        this.mensajeError.textContent = "Error de conexión.";
        try { grecaptcha.reset(); } catch (_) {}
      })
      .finally(() => this.setLoading(false));
  }
}

// IMPORTANTE: tu form tiene id="LoginForm"
new LoginForm("#LoginForm");

class AdminPanel {
  constructor() {
    this.logoutButton = document.getElementById("cerrarSesionBtn");
    this.validarAcceso();
    this.initEventos();
  }

  validarAcceso() {
    // Solo redirige si la página lo requiere explícitamente
    const requireAdmin = document.body?.dataset?.requireAdmin === "true";
    if (requireAdmin && localStorage.getItem("adminLogeado") !== "true") {
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

// Inicializa panel admin solo si existe el botón
if (document.getElementById("cerrarSesionBtn")) {
  new AdminPanel();
}
