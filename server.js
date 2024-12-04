import express from 'express';

const app = express();

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando con HTTP!');
});

const PORT = 3000;

// Levantar el servidor con HTTP
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
