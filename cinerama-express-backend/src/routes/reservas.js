// src/routes/reservas.js
import express from "express";
import { pool } from "../db.js";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * POST /api/reservas
 * Crea la reserva cuando el usuario elige el CINE
 * body: { cine: "CINERAMA PACIFICO" }
 */
router.post("/", async (req, res) => {
  const { cine } = req.body;

  if (!cine) {
    return res.status(400).json({ error: "El campo 'cine' es obligatorio" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO reservas (cine) VALUES (?)",
      [cine]
    );

    // devolvemos el id para guardarlo en localStorage
    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error al crear reserva:", err);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

/**
 * GET /api/reservas/:id
 * Devuelve los datos completos de una reserva (para el voucher, etc.)
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM reservas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(rows[0]); // devolvemos un solo objeto
  } catch (err) {
    console.error("Error al obtener reserva:", err);
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
});

/**
 * PUT /api/reservas/:id
 * Actualiza cualquier dato de la reserva según el paso del flujo
 * body puede traer:
 * - funcion_id
 * - pelicula_codigo, pelicula_titulo, tipo_cine, sala, horario
 * - asientos, cantidad_entradas, monto_entradas
 * - nombre_cliente, correo_cliente, metodo_pago, billetera, estado
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    funcion_id,
    pelicula_codigo,
    pelicula_titulo,
    tipo_cine,
    sala,
    horario,
    asientos,
    cantidad_entradas,
    monto_entradas,
    nombre_cliente,
    correo_cliente,
    metodo_pago,
    billetera,
    estado,
  } = req.body;

  // Construimos el UPDATE dinámicamente solo con los campos que lleguen
  const campos = [];
  const valores = [];

  if (funcion_id !== undefined) {
    campos.push("funcion_id = ?");
    valores.push(funcion_id);
  }
  if (pelicula_codigo !== undefined) {
    campos.push("pelicula_codigo = ?");
    valores.push(pelicula_codigo);
  }
  if (pelicula_titulo !== undefined) {
    campos.push("pelicula_titulo = ?");
    valores.push(pelicula_titulo);
  }
  if (tipo_cine !== undefined) {
    campos.push("tipo_cine = ?");
    valores.push(tipo_cine);
  }
  if (sala !== undefined) {
    campos.push("sala = ?");
    valores.push(sala);
  }
  if (horario !== undefined) {
    campos.push("horario = ?");
    valores.push(horario);
  }

  if (asientos !== undefined) {
    campos.push("asientos = ?");
    valores.push(asientos);
  }
  if (cantidad_entradas !== undefined) {
    campos.push("cantidad_entradas = ?");
    valores.push(cantidad_entradas);
  }
  if (monto_entradas !== undefined) {
    campos.push("monto_entradas = ?");
    valores.push(monto_entradas);
  }

  if (nombre_cliente !== undefined) {
    campos.push("nombre_cliente = ?");
    valores.push(nombre_cliente);
  }
  if (correo_cliente !== undefined) {
    campos.push("correo_cliente = ?");
    valores.push(correo_cliente);
  }
  if (metodo_pago !== undefined) {
    campos.push("metodo_pago = ?");
    valores.push(metodo_pago);
  }
  if (billetera !== undefined) {
    campos.push("billetera = ?");
    valores.push(billetera);
  }
  if (estado !== undefined) {
    campos.push("estado = ?");
    valores.push(estado);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  valores.push(id);

  const sql = `
    UPDATE reservas
    SET ${campos.join(", ")}
    WHERE id = ?
  `;

  try {
    await pool.execute(sql, valores);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al actualizar reserva:", err);
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
});

/**
 * POST /api/reservas/:id/enviar-voucher
 * Envía el voucher por correo al cliente después del pago
 */
router.post("/:id/enviar-voucher", async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener datos de la reserva
    const [rows] = await pool.execute(
      "SELECT * FROM reservas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const r = rows[0];

    if (!r.correo_cliente) {
      return res.status(400).json({ error: "La reserva no tiene un correo registrado" });
    }

    // Configurar el correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pablosuyon23@gmail.com",
        pass: "mlqn wjjd pjup lvbl"  // clave de aplicación Google
      }
    });

    // Contenido del correo
    const htmlVoucher = `
      <h2>🎟️ Voucher de Compra – CINERAMA</h2>
      <p><b>Cine:</b> ${r.cine}</p>
      <p><b>Película:</b> ${r.pelicula_titulo}</p>
      <p><b>Tipo:</b> ${r.tipo_cine}</p>
      <p><b>Horario:</b> ${r.horario}</p>
      <p><b>Asientos:</b> ${r.asientos}</p>
      <p><b>Cantidad:</b> ${r.cantidad_entradas}</p>
      <p><b>Monto pagado:</b> S/ ${r.monto_entradas}</p>
      <hr>
      <p><b>Cliente:</b> ${r.nombre_cliente}</p>
      <p><b>Correo:</b> ${r.correo_cliente}</p>
      <p><b>Método de pago:</b> ${r.metodo_pago}</p>
      <br>
      <p style="color:green;font-weight:600;">Gracias por su compra 💚</p>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: `"Cinerama" <pablosuyon23@gmail.com>`,
      to: r.correo_cliente,
      subject: "🎟️ Tu voucher de compra – CINERAMA",
      html: htmlVoucher
    });

    return res.json({ message: "Voucher enviado correctamente" });

  } catch (err) {
    console.error("Error enviando voucher:", err);
    return res.status(500).json({ error: "Error enviando el voucher" });
  }
});

/**
 * GET /api/reservas/ocupados/:pelicula/:sala/:horario
 * Devuelve la lista de asientos ya reservados y PAGADOS
 */
router.get("/ocupados/:pelicula/:sala/:horario", async (req, res) => {
  try {
    const { pelicula, sala, horario } = req.params;

    const [rows] = await pool.execute(
      `SELECT asientos FROM reservas
       WHERE pelicula_titulo = ? AND sala = ? AND horario = ? AND estado = 'PAGADO'`,
      [pelicula, sala, horario]
    );

    // Convertir "A1, A2" → ["A1", "A2"]
    const ocupados = rows
      .map(r => r.asientos)
      .filter(a => a)
      .flatMap(a => a.split(",").map(x => x.trim()));

    res.json({ ocupados });

  } catch (err) {
    console.error("Error cargando asientos ocupados:", err);
    res.status(500).json({ error: "Error cargando asientos ocupados" });
  }
});


export default router;
