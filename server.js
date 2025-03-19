import express from "express";
import cors from "cors";
import pkg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import  nodemailer from "nodemailer";

dotenv.config(); // Cargar las variables de entorno

const port = process.env.PORT || 3000;
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

pool
  .connect()
  .then(() => {
    console.log("Conexión a PostgreSQL exitosa");
  })
  .catch((err) => {
    console.error("Error de conexión a PostgreSQL", err);
  });

  // Endpoint de prueba para verificar el estado del servidor
app.get('/', (req, res) => {
  res.status(200).json({
      success: true,
      message: '¡El backend está funcionando correctamente!',
  });
});


  app.post("/escenario", async (req, res) => {
    const { nombre, cedula, telefono, correo, fecha, hora, escenario } = req.body;
  
    // Lista de escenarios
    const tableName =
      escenario.toLowerCase() === "idem"
        ? "idem"
        : escenario.toLowerCase() === "villanueva"
        ? "villanueva"
        : escenario.toLowerCase() === "asunción"
        ? "asuncion"
        : escenario.toLowerCase() === "presbítero"
        ? "presbitero"
        : escenario.toLowerCase() === "fátima"
        ? "fatima"
        : escenario.toLowerCase() === "misericordia"
        ? "misericordia"
        : escenario.toLowerCase() === "machado"
        ? "machado"
        : escenario.toLowerCase() === "ciudadela"
        ? "ciudadela"
        : escenario.toLowerCase() === "pedrera"
        ? "pedrera"
        : escenario.toLowerCase() === "cristo rey"
        ? "cristo rey"
        : null;
  
    if (!tableName) {
      return res
        .status(400)
        .json({ mensaje: "El escenario seleccionado no es válido." });
    }
  
    try {
      // Verificar si el usuario ya tiene una reserva en la misma semana
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
        cedula,
        telefono,
        correo,
        startOfWeek.toISOString().split("T")[0],
        endOfWeek.toISOString().split("T")[0],
      ]);
  
      if (checkUserResult.rows.length > 0) {
        return res.status(400).json({
          mensaje: "Ya tienes una reserva en esta semana. No puedes realizar más de una reserva por semana.",
        });
      }
  
      // Verificar disponibilidad
      const checkQuery = `
        SELECT * FROM ${tableName}
        WHERE fecha = $1
        AND hora = $2
      `;
  
      const checkResult = await pool.query(checkQuery, [fecha, hora]);
  
      if (checkResult.rows.length > 0) {
        return res.status(400).json({
          mensaje: "El escenario ya está reservado en este horario. Intenta con otro horario.",
        });
      }
  
      // Insertar nueva reserva
      const insertQuery = `
        INSERT INTO ${tableName}
        (nombre, cedula, telefono, correo, fecha, hora, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
  
      await pool.query(insertQuery, [
        nombre,
        cedula,
        telefono,
        correo,
        fecha,
        hora,
        "reservado",
      ]);
  
  
      // Configurar Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
  
    // Configurar el contenido del correo con HTML
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: correo,
  subject: "🎉 Confirmación de tu Reserva 🎉",
  html: `
  <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
 <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
   <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px;">
        <img src="https://fluffy-tulumba-473481.netlify.app/logo.jpg"alt="Logo de la Empresa" style="width: 150px; margin-bottom: 20px;" />
        <h2 style="color: #1e197c;">¡Tu reserva ha sido confirmada! 🎉</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Nos complace informarte que tu reserva ha sido confirmada exitosamente. Aquí tienes los detalles:</p>

        <div class="details">
            <p><strong>📍 Escenario:</strong>${escenario}</p>
            <p><strong>📅 Fecha:</strong>  ${fecha}</p>
            <p><strong>⏰ Hora:</strong>${hora}</p>
        </div>

        <p>¡Gracias por confiar en nuestro servicio! Esperamos que disfrutes tu experiencia. Si tienes alguna duda, no dudes en contactarnos.</p>

    </div>

</body>
</html>
  `,
};

      // Enviar el correo
      await transporter.sendMail(mailOptions);
  
      res.json({ mensaje: "Reserva realizada con éxito y correo enviado." });
    } catch (error) {
      console.error("Error al realizar la reserva:", error.message);
      res
        .status(500)
        .json({
          mensaje: "Hubo un error al realizar la reserva.",
          error: error.message,
        });
    }
  });
  // Endpoint para obtener las reservas// Endpoint para obtener reservas desde la base de datos
  app.get("/reservas", async (req, res) => {
    const { escenario, fecha } = req.query;
  
    if (!escenario || !fecha) {
      return res.status(400).json({ error: "Faltan parámetros: escenario o fecha" });
    }
  
    // Determinar la tabla correspondiente
    const tableNameMapping = {
      idem: "idem",
      villanueva: "villanueva",
      asunción: "asuncion",
      presbítero: "presbitero",
      fátima: "fatima",
      misericordia: "misericordia",
      machado: "machado",
      ciudadela: "ciudadela",
      pedrera: "pedrera",
      tenis: "tenis",
    };
  
    const tableName = tableNameMapping[escenario.toLowerCase()] || null;
  
    if (!tableName) {
      return res.status(400).json({ error: `Escenario '${escenario}' no es válido.` });
    }
  
    try {
      // Consultar la tabla correspondiente en la base de datos
      const query = `
        SELECT hora 
        FROM ${tableName}
        WHERE fecha = $1
      `;
      const values = [fecha];
  
      const result = await pool.query(query, values);
  
      // Devolver las horas reservadas
      const horasReservadas = result.rows.map((row) => row.hora);
      res.json(horasReservadas);
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
