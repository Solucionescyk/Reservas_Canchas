import express from "express";
import cors from "cors";
import pkg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const port = process.env.PORT || 3000;
const { Pool } = pkg;

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(bodyParser.json());

/* =========================
   DB
========================= */
const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });

pool
  .connect()
  .then(() => console.log("✅ Conexión a PostgreSQL exitosa"))
  .catch((err) => console.error("❌ Error de conexión a PostgreSQL", err));

/* =========================
   Normalización & Mapas
========================= */
// Normaliza: minúsculas, sin espacios y sin tildes
const keyFrom = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "");

const escenarioMap = {
  idem: "idem",
  villanueva: "villanueva",
  asuncion: "asuncion",
  presbitero: "presbitero",
  fatima: "fatima",
  misericordia: "misericordia",
  machado: "machado",
  ciudadela: "ciudadela",
  pedrera: "pedrera",
  cristorey: "CristoRey", // ⚠️ si tu tabla real es en minúsculas, cambia a "cristorey"
};

// Conjunto único de tablas para evitar duplicados en el chequeo semanal
const uniqueTables = [...new Set(Object.values(escenarioMap))];

/* =========================
   Email (transporter global)
========================= */
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = (process.env.EMAIL_PASS || "").replace(/\s/g, ""); // sin espacios

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("⚠️ Faltan EMAIL_USER y/o EMAIL_PASS en el entorno");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

transporter
  .verify()
  .then(() => console.log("✉️  SMTP listo ✅"))
  .catch((e) => console.error("✉️  SMTP falló ❌", e));

/* =========================
   Rutas
========================= */
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "✅ Backend en funcionamiento" });
});

app.post("/escenario", async (req, res) => {
  const { nombre, cedula, telefono, correo, fecha, hora, escenario } = req.body;

  // Validación rápida
  if (!nombre || !cedula || !telefono || !correo || !fecha || !hora || !escenario) {
    return res.status(400).json({ ok: false, mensaje: "❌ Faltan campos obligatorios." });
  }

  // Normaliza y mapea el escenario a nombre de tabla
  const escenarioKey = keyFrom(escenario);
  const tableName = escenarioMap[escenarioKey];
  if (!tableName) {
    return res.status(400).json({ ok: false, mensaje: "❌ Escenario no válido." });
  }

  try {
    // Regla: 1 reserva por semana (dom-sáb) en cualquier cancha
    const startOfWeek = new Date(fecha); // fecha en formato YYYY-MM-DD
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // domingo
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // sábado

    const startWeekStr = startOfWeek.toISOString().split("T")[0];
    const endWeekStr = endOfWeek.toISOString().split("T")[0];

    // Chequeo contra todas las tablas (sin duplicados)
    const checkQueries = uniqueTables.map(
      (table) => `
        SELECT COUNT(*)::int AS c FROM ${table}
        WHERE (cedula = $1 OR telefono = $2 OR correo = $3)
          AND fecha BETWEEN $4 AND $5
      `
    );
    const fullCheckQuery = checkQueries.join(" UNION ALL ");

    const checkResult = await pool.query(fullCheckQuery, [
      cedula,
      telefono,
      correo,
      startWeekStr,
      endWeekStr,
    ]);

    const totalReservas = checkResult.rows.reduce((acc, row) => acc + (row.c || 0), 0);
    if (totalReservas > 0) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "❌ Solo se permite una reserva por semana en cualquier cancha." });
    }

    // Verifica disponibilidad en la tabla específica
    const checkQuery = `SELECT 1 FROM ${tableName} WHERE fecha = $1 AND hora = $2 LIMIT 1`;
    const checkResultTable = await pool.query(checkQuery, [fecha, hora]);
    if (checkResultTable.rows.length > 0) {
      return res.status(400).json({ ok: false, mensaje: "❌ Horario no disponible." });
    }

    // Inserta la reserva
    const insertQuery = `
      INSERT INTO ${tableName} (nombre, cedula, telefono, correo, fecha, hora, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'reservado')
      RETURNING id
    `;
    const insertRes = await pool.query(insertQuery, [nombre, cedula, telefono, correo, fecha, hora]);
    const reservaId = insertRes.rows?.[0]?.id || null;

    // Envía correo (AWAIT antes de responder)
    let emailEnviado = false;
    try {
      const mailOptions = {
        from: `"INDER Copacabana" <${EMAIL_USER}>`, // from = EMAIL_USER
        to: correo,
        subject: "🎉 Confirmación de tu Reserva 🎉",
        html: `
          <html lang="es">
          <body style="font-family: Arial; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 10px;">
              <h2 style="color: #1e197c;">Reserva Confirmada</h2>
              <p>Hola <strong>${nombre}</strong>, tu reserva ha sido confirmada:</p>
              <p><strong>📍 Escenario:</strong> ${escenario}</p>
              <p><strong>📅 Fecha:</strong> ${fecha}</p>
              <p><strong>⏰ Hora:</strong> ${hora}</p>
              <p><strong>🆔 Reserva:</strong> ${reservaId ?? "-"}</p>
            </div>
          </body>
          </html>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Correo enviado:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      });
      emailEnviado = true;
    } catch (emailError) {
      console.error("❌ Error al enviar correo:", {
        message: emailError.message,
        code: emailError.code,
        responseCode: emailError.responseCode,
        response: emailError.response,
      });
      // No lanzamos error: la reserva queda confirmada igualmente
    }

    return res.status(201).json({
      ok: true,
      reservaId,
      emailEnviado,
      mensaje: emailEnviado
        ? "✅ Reserva confirmada y correo enviado."
        : "✅ Reserva confirmada, pero hubo un problema al enviar el correo.",
    });
  } catch (error) {
    console.error("❌ Error al reservar:", error);
    return res.status(500).json({ ok: false, mensaje: "❌ Error al realizar la reserva." });
  }
});

app.get("/reservas", async (req, res) => {
  const { escenario, fecha } = req.query;

  if (!escenario || !fecha) {
    return res.status(400).json({ error: "❌ Escenario y fecha son requeridos." });
  }

  const escenarioKey = keyFrom(escenario);
  const tableName = escenarioMap[escenarioKey];

  if (!tableName) {
    return res.status(400).json({ error: "❌ Escenario no válido." });
  }

  if (fecha.toString().trim() === "") {
    return res.status(400).json({ error: "❌ La fecha no puede estar vacía." });
  }

  try {
    const query = `SELECT hora FROM ${tableName} WHERE fecha = $1`;
    const result = await pool.query(query, [fecha]);
    res.json(result.rows.map((row) => row.hora));
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    res.status(500).json({ error: "❌ Error interno del servidor" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor en ejecución en http://localhost:${port}`);
});
