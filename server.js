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
        : escenario.toLowerCase() === "tenis"
        ? "tenis"
        : null;
  
    if (!tableName) {
      return res
        .status(400)
        .json({ mensaje: "El escenario seleccionado no es válido." });
    }
  
    try {
      // Verificar disponibilidad
      const checkQuery = `
        SELECT * FROM ${tableName}
        WHERE fecha = $1
        AND hora = $2
      `;
  
      const checkResult = await pool.query(checkQuery, [fecha, hora]);
  
      if (checkResult.rows.length > 0) {
        return res
          .status(400)
          .json({
            mensaje:
              "El escenario ya está reservado en este horario. Intenta con otro horario.",
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
  
      // Configurar el contenido del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correo,
        subject: "Confirmación de Reserva",
        text: `
          Hola ${nombre},
  
          Tu reserva ha sido confirmada exitosamente.
  
          Detalles de la reserva:
          - Escenario: ${escenario}
          - Fecha: ${fecha}
          - Hora: ${hora}
  
          Gracias por confiar en nuestro servicio.
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
