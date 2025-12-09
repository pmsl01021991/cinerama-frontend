# CINERAMA

Sitio web de cine con **frontend estático (HTML/CSS/JS)** y un **backend en Express** para el login con **reCAPTCHA v2**. El proyecto incluye un **esquema MySQL** (en progreso) para soportar reservas y administración.

> Estado actual (según los archivos del repositorio):  
> - El **login de administrador** funciona contra un backend Express (`/api/auth/login`) con verificación de reCAPTCHA.  
> - El **panel de “Reservaciones”** está **protegido** y visible sólo cuando `adminLogeado === "true"`, pero **lee datos desde `localStorage`** (no desde la base de datos).  
> - Existen archivos de backend para **reservas y administración con MySQL**, pero **no están conectados** en el `server.js` publicado y falta la dependencia `mysql2`.  
> - El archivo `cinerama1.sql` contiene el **nombre y tablas clave**, pero aparece **truncado** (con `...`). Revisa la sección **“Pendientes detectados”**.

---


# Arranque de la página web ( IMPORTANTE )

- cd "C:\TERCER CICLO\ANALISIS Y DISEÑO DE SISTEMAS ORIENTADA A OBJETOS\EXAMEN_FINAL_ANALISIS\CINERAMA (1)\cinerama-express-backend"
 y luego ejecutar:
npm run dev



## 🎯 Funcionalidades principales

- **Home (`index.html`)** con slider, menú hamburguesa y secciones informativas.
- **Cartelera y Estrenos** (`cartelera.html`, `estrenos.html`) con componentes JS para sliders y trailers.
- **Selección de asientos** (`asientos.html` + `js/asientos.js`): gestión de butacas, cuenta de seleccionados y **precio por entrada = 12** (hardcodeado).
- **Pago** (`pago.html` + `js/pago.js`): selección de **método de pago** (tarjeta o billeteras); actualmente **muestra un mensaje** y **reinicia el formulario** (no persiste en backend).
- **Contacto** (`contacto.html` + `js/contacto.js`): validación de formulario; guarda mensajes en `localStorage` bajo `mensajesContacto` y reproduce audio/toast.
- **Login de administrador** (`login.html` + `js/login.js`): reCAPTCHA v2 (checkbox), envío al backend y, en éxito, setea `localStorage.adminLogeado = "true"`.
- **Panel de Reservaciones** (`reservaciones.html` + `js/reservaciones.js`): **requiere admin** (`<body data-require-admin="true">`), lee **reservaciones** y **mensajes** desde `localStorage`. Incluye botón **“Salir”** que borra la sesión local.
- **Guardas de interfaz** (`js/auth.js`): oculta/mostrar elementos marcados con `data-admin-only` y redirige si la página **requiere** admin.

---

## 🧱 Estructura del proyecto (carpetas principales)

```
CINERAMA (1)/
├── cinerama-express-backend/           # Backend en Node/Express (auth con reCAPTCHA)
│   ├── .env.example                    # Plantilla de variables de entorno
│   ├── db.js                           # Pool MySQL (requiere mysql2) [no conectado]
│   ├── routes/
│   │   ├── admin.js                    # Endpoints admin (requiere MySQL) [no montado]
│   │   └── reservas.js                 # Endpoints reservas (requiere MySQL) [no montado]
│   └── src/
│       ├── controllers/authController.js
│       ├── middleware/verifyCaptcha.js
│       ├── routes/auth.js
│       └── server.js                   # Arranca Express y monta /api/auth
├── css/                                # Estilos de cada página (Login, pago, etc.)
├── js/                                 # Lógica de páginas (asientos, cartelera, pago, etc.)
├── imagenes/, audio/                   # Assets
├── *.html                              # Páginas (index, cartelera, estrenos, asientos, pago…)
└── cinerama1.sql                       # Esquema MySQL (truncado en el repo)
```

---

## ⚙️ Requisitos

- **Node.js** 18 o 20 y **npm**
- (Opcional) **MySQL 8** si vas a conectar reservas reales
- (Opcional) **VS Code + Live Server** para servir el frontend en desarrollo
- Claves de **Google reCAPTCHA v2 (Checkbox)**: *Site Key* (frontend) y *Secret Key* (backend)
- (Opcional) **EmailJS** (se ve el `emailjs.init("nFJQXJun_0mdXBQ6U")` en `js/login.js`)

---

## 🚀 Puesta en marcha

### 1) Backend (Express)

```bash
cd cinerama-express-backend
npm install
cp .env.example .env
# edita .env con tus valores
npm run dev   # o: npm start
```

`src/server.js` levanta el servidor en el puerto definido por `PORT` (por defecto **3001**) y expone:

- `POST /api/auth/login` → verifica reCAPTCHA y credenciales del admin.

> **Importante:** El archivo `server.js` de este repositorio muestra fragmentos con `...` dentro de la **configuración de Helmet/CORS** y del **servido de estáticos**. Si tu versión local tiene ese código completo, no hay problema; en caso contrario, revisa la sección **Pendientes detectados** para la corrección.

### 2) Frontend (HTML estático)

Opción rápida (recomendada en dev):

- Abre el proyecto en VS Code y usa la extensión **Live Server** en `index.html`.  
- Asegúrate que `ALLOWED_ORIGIN` en el `.env` del backend coincida con la URL donde sirves el frontend (por ejemplo, `http://127.0.0.1:5500`).

O también puedes servir los archivos estáticos desde tu propio servidor (Nginx/Apache).

---

## 🔐 Variables de entorno (`.env`)

Ejemplo (basado en `.env.example`):

```
PORT=3001
RECAPTCHA_SECRET=TU_SECRETO_DE_RECAPTCHA
ADMIN_USER=admin@cinerama.com
ADMIN_PASS=pmsl123
ALLOWED_ORIGIN=http://127.0.0.1:5500
```

- **RECAPTCHA_SECRET**: clave secreta de reCAPTCHA v2 (checkbox).
- **ADMIN_USER / ADMIN_PASS**: credenciales válidas para el login de administrador.
- **ALLOWED_ORIGIN**: origen permitido para CORS (frontend).

> En `login.html` el `data-sitekey` del widget es:  
> `6Le6y5crAAAAAN-dhbDOxqJ8e-hhESbty8B1oFNU` (reemplázalo por tu **site key** real).

---

## 🔑 Flujo de autenticación (admin)

1. En `login.html`, el usuario completa usuario/contraseña y resuelve reCAPTCHA v2.
2. `js/login.js` envía:  
   - `usuario`, `password`, `g-recaptcha-response` → `POST /api/auth/login`.
3. `src/middleware/verifyCaptcha.js` valida el token contra Google (`/recaptcha/api/siteverify`).
4. `src/controllers/authController.js` compara con `ADMIN_USER` y `ADMIN_PASS`.  
   - Si coincide: **200 OK** y el frontend guarda `localStorage.adminLogeado = "true"`.
   - Si no: **401 LOGIN_INVALIDO**.

**Ejemplo de `curl`:**
```bash
curl -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{{ 
    "usuario": "admin@cinerama.com",
    "password": "pmsl123",
    "g-recaptcha-response": "TOKEN_DEL_WIDGET"
  }}'
```

---

## 🗃️ (Opcional) Base de datos MySQL

Hay un pool MySQL en `cinerama-express-backend/db.js` y rutas listas en `routes/admin.js` y `routes/reservas.js` (insertan en `reservas` y en `asientos_reservados`).  
El **esquema objetivo** (según `cinerama1.sql`) incluye tablas:

- `cines`, `salas`, `peliculas`, `funciones`, `usuarios`, `reservas`, `asientos_reservados`.

> **Advertencia:** `cinerama1.sql` está **incompleto** (aparecen `...`). Si vas a usar MySQL, asegúrate de tener el script completo o construir las tablas manualmente.

**Para activar MySQL de verdad:**

1. Instala la dependencia que falta:
   ```bash
   cd cinerama-express-backend
   npm i mysql2
   ```
2. Crea la base de datos y tablas (corrige/termina `cinerama1.sql`).
3. Completa las variables del `.env` que usa `db.js`:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASS=tu_password
   DB_NAME=cinerama
   ```
4. **Monta las rutas** de `routes/admin.js` y `routes/reservas.js` en tu `server.js`, por ejemplo:
   ```js
   import adminRouter from "../routes/admin.js";
   import reservasRouter from "../routes/reservas.js";

   app.use("/api/admin", adminRouter);
   app.use("/api/reservas", reservasRouter);
   ```
5. Cambia el frontend para **enviar las reservas reales** a `/api/reservas` en lugar de guardarlas sólo en `localStorage`.

---

## 🖥️ Páginas y JS destacados

- `index.html` + `js/script.js`: slider principal, menú hamburguesa y enlaces.
- `cartelera.html` + `js/cartelera.js`: carrusel de películas, modal de trailers.
- `estrenos.html` + `js/estrenos.js`: listado de estrenos con interacción.
- `asientos.html` + `js/asientos.js`: selección de butacas.  
  - Precio por defecto: **S/ 12** (`this.entrada = 12`).
  - Usa `localStorage` para traer `dataCine`, `horarioSeleccionado`, `tipoCine`.
- `pago.html` + `js/pago.js`: métodos de pago (tarjeta o billeteras).  
  - Actualmente **no realiza cobro**: muestra alerta *“¡Tus datos han sido enviados!”* y limpia el formulario.
- `contacto.html` + `js/contacto.js`: valida y guarda mensajes en `localStorage.mensajesContacto`, muestra toasts y sintetiza voz.
- `login.html` + `js/login.js`: reCAPTCHA v2 + envío a backend; al éxito, setea `adminLogeado`.
- `reservaciones.html` + `js/reservaciones.js`: **Panel Admin** (requiere sesión). Muestra **reservaciones** y **contactos** desde `localStorage`.

---

## 🔧 Solución de problemas

- **“Captcha no enviado / inválido”**  
  Revisa que el frontend envíe `g-recaptcha-response` y que el `RECAPTCHA_SECRET` y **site key** correspondan al mismo dominio.
- **CORS bloqueado**  
  Ajusta `ALLOWED_ORIGIN` en `.env` (por ejemplo `http://127.0.0.1:5500` para Live Server).
- **La sesión de admin no persiste**  
  Verifica que, al éxito del login, el frontend guarde `localStorage.adminLogeado = "true"` y que `js/auth.js` esté cargado en las páginas protegidas.
- **No se ven reservas en el panel**  
  Hoy se leen desde `localStorage`. Si quieres datos reales, conecta MySQL y modifica el frontend para consumir `/api/admin/reservas`.
- **Errores en MySQL**  
  Completa el script `cinerama1.sql` y revisa claves foráneas; `routes/reservas.js` espera `usuarios`, `funciones`, `salas`, etc. existentes.

---

## 📝 Pendientes detectados en este repo

- En varios archivos aparecen literales `...` (por ejemplo `src/server.js`, `src/middleware/verifyCaptcha.js`, `db.js`, `cinerama1.sql`, algunos `.js` del frontend).  
  **Solución**: reemplaza esos `...` por el código que falta (parecen recortes al copiar/pegar).
- `cinerama-express-backend/package.json` **no incluye** `"mysql2"` aunque `db.js` lo usa.
- `src/server.js` **no monta** `routes/admin.js` ni `routes/reservas.js`. Si quieres persistencia real, móntalas y conecta MySQL.
- `pago.js` **no** envía datos al backend. Si necesitas pagos reales, integra un gateway (p.ej., Culqi, Niubiz, Stripe) y **nunca** proceses tarjetas en el frontend.
- El **.env real** no está incluido (sólo `.env.example`). Crea tu `.env` con tus claves/usuarios.

---

## 📄 Licencia

No se ha especificado una licencia en el repositorio. Si se va a publicar, añade una licencia (MIT/Apache-2.0) según corresponda.

---

## 👤 Autoría y soporte

Proyecto **CINERAMA**.  
Si necesitas que conecte **toda la parte de reservas a MySQL** (rutas montadas, esquema completo y fetch desde el frontend), indícalo y lo dejo operativo sobre este mismo código.
