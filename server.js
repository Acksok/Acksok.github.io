 const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors'); // ← Añade esta línea
const app = express();
const port = 3000;

// Compresión y caché
app.use(compression());
app.use(express.static(path.join(__dirname, 'src'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.png')) {
      res.set('Cache-Control', 'public, max-age=31536000');
    }
  }
}))

// Resto de la configuración...

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'src')));

// Endpoint para productos
app.get('/products', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'src', 'products.json'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});