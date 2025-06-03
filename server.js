import express from "express"
import cors from "cors"
import pkg from "pg"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()

const port = process.env.PORT || 3000
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(bodyParser.json())

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL })

pool
  .connect()
  .then(() => console.log("✅ Conexión a PostgreSQL exitosa"))
  .catch((err) => console.error("❌ Error de conexión a PostgreSQL", err))

const escenarioMap = {
  idem: "idem",
  villanueva: "villanueva",
  asuncion: "asuncion",
  asunción: "asuncion",
  presbitero: "presbitero",
  presbítero: "presbitero",
  fatima: "fatima",
  fátima: "fatima",
  misericordia: "misericordia",
  machado: "machado",
  ciudadela: "ciudadela",
  pedrera: "pedrera",
  cristorey: "CristoRey",
}

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "✅ Backend en funcionamiento" })
})

app.post("/escenario", async (req, res) => {
  const { nombre, cedula, telefono, correo, fecha, hora, escenario } = req.body
  const escenarioNormalizado = escenario?.trim().toLowerCase().replace(/\s+/g, "")
  const tableName = escenarioMap[escenarioNormalizado]

  if (!tableName) {
    return res.status(400).json({ mensaje: "❌ Escenario no válido." })
  }

  try {
    const startOfWeek = new Date(fecha)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const startWeekStr = startOfWeek.toISOString().split("T")[0]
    const endWeekStr = endOfWeek.toISOString().split("T")[0]

    const checkQueries = Object.values(escenarioMap).map(
      (table) => `
      SELECT COUNT(*) FROM ${table}
      WHERE (cedula = $1 OR telefono = $2 OR correo = $3)
      AND fecha BETWEEN $4 AND $5
    `,
    )

    const fullCheckQuery = checkQueries.join(" UNION ALL ")
    const checkResult = await pool.query(fullCheckQuery, [cedula, telefono, correo, startWeekStr, endWeekStr])
    const totalReservas = checkResult.rows.reduce((acc, row) => acc + Number.parseInt(row.count, 10), 0)

    if (totalReservas > 0) {
      return res.status(400).json({ mensaje: "❌ Solo se permite una reserva por semana en cualquier cancha." })
    }

    const checkQuery = `SELECT * FROM ${tableName} WHERE fecha = $1 AND hora = $2`
    const checkResultTable = await pool.query(checkQuery, [fecha, hora])

    if (checkResultTable.rows.length > 0) {
      return res.status(400).json({ mensaje: "❌ Horario no disponible." })
    }

    const insertQuery = `
      INSERT INTO ${tableName} (nombre, cedula, telefono, correo, fecha, hora, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'reservado')
    `
    await pool.query(insertQuery, [nombre, cedula, telefono, correo, fecha, hora])

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

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
      </html>`,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log("✅ Correo enviado exitosamente a:", correo)
      res.json({ mensaje: "✅ Reserva confirmada y correo enviado." })
    } catch (emailError) {
      console.error("❌ Error al enviar correo:", emailError.message)
      // Aún así confirma la reserva, solo falla el correo
      res.json({ mensaje: "✅ Reserva confirmada, pero hubo un problema al enviar el correo." })
    }
  } catch (error) {
    console.error("❌ Error al reservar:", error.message)
    res.status(500).json({ mensaje: "❌ Error al realizar la reserva." })
  }
})

app.get("/reservas", async (req, res) => {
  const { escenario, fecha } = req.query
  const escenarioNormalizado = escenario?.trim().toLowerCase().replace(/\s+/g, "")
  const tableName = escenarioMap[escenarioNormalizado]

  if (!escenario || !fecha || !tableName) {
    console.error("❌ Parámetros faltantes:", { escenario, fecha, tableName })
    return res.status(400).json({ error: "❌ Escenario y fecha son requeridos." })
  }

  if (fecha.trim() === "") {
    return res.status(400).json({ error: "❌ La fecha no puede estar vacía." })
  }

  try {
    const query = `SELECT hora FROM ${tableName} WHERE fecha = $1`
    const result = await pool.query(query, [fecha])
    res.json(result.rows.map((row) => row.hora))
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error)
    res.status(500).json({ error: "❌ Error interno del servidor" })
  }
})

app.listen(port, () => {
  console.log(`🚀 Servidor en ejecución en http://localhost:${port}`)
})
