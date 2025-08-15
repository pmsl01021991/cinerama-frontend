class AdminPanel {
  constructor() {
    this.adminLogeado = localStorage.getItem("adminLogeado") === "true";
    this.cerrarBtn = document.getElementById("cerrarSesionBtn");
    this.contenedor = document.getElementById("contenedor-reservaciones");
    this.adminData = null;
    this.init();
  }

  init() {
    if (!this.adminLogeado) {
      alert("Acceso restringido. Solo administradores.");
      window.location.href = "index.html";
      return;
    }

    this.mostrarBotonCerrarSesion();
    this.crearBotonesPanel();
    this.crearContenedorDatos();
  }

  mostrarBotonCerrarSesion() {
    if (this.cerrarBtn) {
      this.cerrarBtn.hidden = false;
      this.cerrarBtn.addEventListener("click", () => {
        localStorage.removeItem("adminLogeado");
        window.location.href = "index.html";
      });
    }
  }

  crearBotonesPanel() {
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    const btnReservaciones = this.crearBoton("Ver Reservaciones", () => this.renderData("reservaciones"));
    const btnMensajes = this.crearBoton("Ver Mensajes de Contacto", () => this.renderData("mensajes"));

    btnGroup.appendChild(btnReservaciones);
    btnGroup.appendChild(btnMensajes);
    this.contenedor.appendChild(btnGroup);
  }

  crearBoton(texto, onClick) {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.classList.add("btn-panel");
    btn.addEventListener("click", onClick);
    return btn;
  }

  crearContenedorDatos() {
    this.adminData = document.createElement("div");
    this.adminData.id = "adminData";
    this.contenedor.appendChild(this.adminData);
  }

  obtenerDatos(tipo) {
    if (tipo === "reservaciones") {
      return JSON.parse(localStorage.getItem("reservaciones") || "[]");
    } else if (tipo === "mensajes") {
      return JSON.parse(localStorage.getItem("mensajesContacto") || "[]");
    }
    return [];
  }

  renderData(tipo) {
    this.adminData.innerHTML = "";
    const datos = this.obtenerDatos(tipo);

    if (datos.length === 0) {
      this.adminData.textContent = "No hay datos disponibles.";
      return;
    }

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar...";
    searchInput.style.padding = "8px";
    searchInput.style.marginBottom = "10px";
    searchInput.style.width = "100%";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "5px";
    this.adminData.appendChild(searchInput);

    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");

    const table = document.createElement("table");
    table.classList.add("table-admin");

    let headers = [];
    if (tipo === "reservaciones") {
      headers = ["#", "Usuario", "Cine", "Fecha"];
    } else {
      headers = ["#", "Nombre", "Email", "Cine", "Asunto", "Mensaje", "Fecha"];
    }

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    datos.forEach((item, index) => {
      const tr = document.createElement("tr");

      if (tipo === "reservaciones") {
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.usuario}</td>
          <td>${item.cine}</td>
          <td>${item.fecha}</td>
        `;
      } else {
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.nombre} ${item.apellidos}</td>
          <td>${item.email}</td>
          <td>${item.cine}</td>
          <td>${item.asunto}</td>
          <td>${item.mensaje}</td>
          <td>${item.fecha}</td>
        `;
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    this.adminData.appendChild(tableContainer);

    // Filtro en vivo
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      const rows = tbody.getElementsByTagName("tr");
      for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      }
    });
  }
}

// Inicializar clase
document.addEventListener("DOMContentLoaded", () => new AdminPanel());

// Menú hamburguesa
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
});
