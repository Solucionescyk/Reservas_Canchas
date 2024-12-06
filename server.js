import express from "express";
import cors from "cors";
import pkg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";

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
    res.json({ mensaje: "Reserva realizada con éxito." });
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

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
