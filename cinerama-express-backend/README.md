# Cinerama Express Backend

Backend en Express que reemplaza `js/login.php` y mantiene el mismo flujo de reCAPTCHA v2 (checkbox) y validación de credenciales.

## Requisitos
- Node.js 18 o 20
- npm

## Instalación
```bash
npm i
```

Crea un archivo `.env` a partir de `.env.example`:

```
PORT=3001
RECAPTCHA_SECRET=TU_SECRETO_DE_RECAPTCHA
ADMIN_USER=admin@cinerama.com
ADMIN_PASS=pmsl123
ALLOWED_ORIGIN=http://127.0.0.1:5500
```

> **Importante:** Rota tu `RECAPTCHA_SECRET` en Google reCAPTCHA si estuvo expuesto en el PHP.

## Ejecutar en desarrollo
```bash
npm run dev
```
El backend queda en `http://localhost:3001` y expone:
- `POST /api/login`

## Frontend (cambio mínimo)
En tu `CINERAMA/js/login.js`, cambia la URL:

```diff
- fetch("js/login.php", {
+ fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      usuario: user,
      password: pass,
      "g-recaptcha-response": token
    })
})
```

## Cómo funciona
1. El frontend genera un `token` de reCAPTCHA y lo envía en el campo `g-recaptcha-response` junto con `usuario` y `password`.
2. El middleware `verifyCaptcha` llama a `https://www.google.com/recaptcha/api/siteverify` con tu `RECAPTCHA_SECRET` y el `token`.
3. Si `success=true`, pasa a `loginController` que compara contra `ADMIN_USER` y `ADMIN_PASS`. Si coinciden, responde `OK`; si no, `LOGIN_INVALIDO`.

## Errores comunes
- **"Captcha no enviado"**: no llegó `g-recaptcha-response` desde el frontend.
- **"Captcha inválido"**: token expirado o sitio/clave no coincide.
- **CORS bloqueado**: ajusta `ALLOWED_ORIGIN` o usa `*` temporalmente.
- **405/404**: verifica método `POST` y ruta `/api/login` correcta.
