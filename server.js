const express = require('express');
const cors = require('cors');
const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'https://acksok.github.io', // Tu dominio de GitHub Pages
  'http://localhost:3000'     // Desarrollo local
];

// Configuración avanzada de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ruta de productos
app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: "Tabla Clásica", price: 45.99 },
    // ... más productos
  ]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor CORS-ready en puerto ${PORT}`);
});