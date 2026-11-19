const express = require('express');
const morgan = require('morgan');
const peritosRoutes = require('./routes/peritos.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Morgan: una línea por cada petición HTTP (sin colores, los colores los pone Chalk)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Permite leer el body en formato JSON
app.use(express.json());

app.use('/api/v1/peritos', peritosRoutes);

// Siempre al final: ruta inexistente y manejador de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
