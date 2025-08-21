// server.js (raíz del backend)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";



dotenv.config();

const app = express();

// Helmet: como el backend solo devuelve JSON, usamos lo básico
app.use(helmet());

// CORS: permite solo tu frontend (ajusta ALLOWED_ORIGIN en .env)
const origin = process.env.ALLOWED_ORIGIN || "http://127.0.0.1:5500";
app.use(cors({ origin }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit para endpoints /api (60 req/min)
app.use("/api", rateLimit({ windowMs: 60_000, max: 60 }));

// Rutas de autenticación (con captcha en el middleware)
app.use("/api/auth", authRouter);

// Ruta de salud
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "cinerama-backend" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
