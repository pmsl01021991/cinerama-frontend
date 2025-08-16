import express from "express";
import { pool, tx } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { usuario_id, funcion_id, cantidad, total, asientos } = req.body;

  try {
    await tx(async (conn) => {
      // Insertar en reservas
      const [result] = await conn.execute(
        `INSERT INTO reservas (usuario_id, funcion_id, cantidad, total) 
         VALUES (?, ?, ?, ?)`,
        [usuario_id, funcion_id, cantidad, total]
      );

      const reservaId = result.insertId;

      // Insertar asientos
      for (let asiento of asientos) {
        await conn.execute(
          `INSERT INTO asientos_reservados (reserva_id, asiento_codigo) 
           VALUES (?, ?)`,
          [reservaId, asiento]
        );
      }
    });

    res.json({ message: "Reserva guardada correctamente" });

  } catch (err) {
    console.error("Error al guardar reserva:", err);
    res.status(500).send("Error al guardar reserva");
  }
});

export default router;
