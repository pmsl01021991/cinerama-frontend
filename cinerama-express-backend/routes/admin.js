import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Ruta para obtener todas las reservas (solo admin)
router.get("/reservas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, u.nombre, u.email, p.titulo, s.nombre AS sala, s.tipo, 
             f.fecha, f.hora, r.cantidad, r.total, r.fecha_reserva
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN funciones f ON r.funcion_id = f.id
      JOIN peliculas p ON f.pelicula_id = p.id
      JOIN salas s ON f.sala_id = s.id
      ORDER BY r.fecha_reserva DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).send("Error al obtener reservas");
  }
});

// Ruta para login de administrador
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE email = ? AND password_hash = ? AND es_admin = 1`,
      [email, password] // ⚠ En producción usar bcrypt
    );

    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).send("Credenciales inválidas");
    }
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).send("Error en login");
  }
});

export default router;
