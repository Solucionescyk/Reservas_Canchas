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
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });

pool.connect()
  .then(() => console.log("✅ Conexión a PostgreSQL exitosa"))
  .catch(err => console.error("❌ Error de conexión a PostgreSQL", err));

// Mapeo de escenarios a nombres de tabla
const escenarioMap = {
  idem: "idem",
  villanueva: "villanueva",
  asuncion: "asuncion",
  "asunción": "asuncion",
  presbitero: "presbitero",
  "presbítero": "presbitero",
  fatima: "fatima",
  "fátima": "fatima",
  misericordia: "misericordia",
  machado: "machado",
  ciudadela: "ciudadela",
  pedrera: "pedrera",
  cristorey: "CristoRey"
};

// Endpoint de prueba
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '✅ Backend en funcionamiento' });
});

// POST para realizar una reserva
app.post("/escenario", async (req, res) => {
  const { nombre, cedula, telefono, correo, fecha, hora, escenario } = req.body;
  const escenarioNormalizado = escenario?.trim().toLowerCase().replace(/\s+/g, "");
  const tableName = escenarioMap[escenarioNormalizado];

  if (!tableName) {
    return res.status(400).json({ mensaje: "❌ Escenario no válido." });
  }

  try {
    const startOfWeek = new Date(fecha);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const checkUserQuery = `
      SELECT * FROM ${tableName}
      WHERE (cedula = $1 OR telefono = $2 OR correo = $3)
      AND fecha BETWEEN $4 AND $5
    `;
    const checkUserResult = await pool.query(checkUserQuery, [
      cedula, telefono, correo,
      startOfWeek.toISOString().split("T")[0],
      endOfWeek.toISOString().split("T")[0]
    ]);

    if (checkUserResult.rows.length > 0) {
      return res.status(400).json({ mensaje: "❌ Solo se permite una reserva por semana." });
    }

    const checkQuery = `SELECT * FROM ${tableName} WHERE fecha = $1 AND hora = $2`;
    const checkResult = await pool.query(checkQuery, [fecha, hora]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ mensaje: "❌ Horario no disponible." });
    }

    const insertQuery = `
      INSERT INTO ${tableName} (nombre, cedula, telefono, correo, fecha, hora, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'reservado')
    `;
    await pool.query(insertQuery, [nombre, cedula, telefono, correo, fecha, hora]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
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
        </div>
      </body>
      </html>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ mensaje: "✅ Reserva confirmada y correo enviado." });
  } catch (error) {
    console.error("❌ Error al reservar:", error.message);
    res.status(500).json({ mensaje: "❌ Error al realizar la reserva." });
  }
});

// GET para obtener reservas de un escenario en una fecha específica
app.get("/reservas", async (req, res) => {
  const { escenario, fecha } = req.query;
  const escenarioNormalizado = escenario?.trim().toLowerCase().replace(/\s+/g, "");
  const tableName = escenarioMap[escenarioNormalizado];

  if (!escenario || !fecha || !tableName) {
    return res.status(400).json({ error: "❌ Parámetros incorrectos." });
  }

  try {
    const query = `SELECT hora FROM ${tableName} WHERE fecha = $1`;
    const result = await pool.query(query, [fecha]);
    res.json(result.rows.map(row => row.hora));
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    res.status(500).json({ error: "❌ Error interno del servidor" });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor en ejecución en http://localhost:${port}`);
});
