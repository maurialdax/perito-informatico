const createError = require('http-errors');
const logger = require('../utils/logger');

// Se ejecuta cuando ninguna ruta coincide -> genera un 404 y lo pasa al manejador de errores.
function notFound(req, res, next) {
  next(createError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// Manejador central de errores (Express lo reconoce porque tiene 4 parámetros).
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // JSON mal formado en el body (lo detecta express.json)
  if (err.type === 'entity.parse.failed') {
    err = createError(400, 'El cuerpo de la petición no es un JSON válido', { field: 'body' });
  }

  const status = err.status || err.statusCode || 500;

  // Error crítico: se muestra el stack en la consola y al cliente solo un mensaje genérico
  if (status >= 500) {
    logger.errorCritico(err);
    return res.status(500).json({
      error: { status: 500, message: 'Error interno del servidor' },
    });
  }

  // Error del cliente (400, 404, 409, ...)
  logger.errorValidacion(status, err.message, err.field);

  const cuerpo = { status, message: err.message };
  if (err.field) {
    cuerpo.field = err.field;
  }
  res.status(status).json({ error: cuerpo });
}

module.exports = { notFound, errorHandler };
