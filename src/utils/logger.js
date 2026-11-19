// Mensajes de consola con Chalk.
// Cada tipo de evento tiene su propio color para poder distinguirlos de un vistazo:
//   cyan   -> se creó un perito
//   yellow -> error de validación / error del cliente (4xx)
//   red    -> error crítico (500) con el stack

const chalk = require('chalk');

function peritoCreado(perito) {
  console.log(
    chalk.cyan(
      `[CREADO] Nuevo perito registrado -> ` +
        `id: ${perito.id} | username: ${perito.username} | ` +
        `rol: ${perito.role} (role_id: ${perito.role_id}) | ` +
        `active: ${perito.active} | created_at: ${new Date(perito.created_at).toISOString()}`
    )
  );
}

// Etiqueta según el código HTTP del error del cliente
const ETIQUETAS = { 400: 'VALIDACION', 404: 'NO ENCONTRADO', 409: 'CONFLICTO' };

function errorValidacion(status, mensaje, campo) {
  const etiqueta = ETIQUETAS[status] || 'ERROR CLIENTE';
  const detalleCampo = campo ? `Campo fallido: ${campo} | ` : '';
  console.log(chalk.yellow(`[${etiqueta}] (${status}) ${detalleCampo}${mensaje}`));
}

function errorCritico(err) {
  console.error(chalk.red(`[ERROR 500] ${err.message}`));
  console.error(chalk.red(err.stack));
}

module.exports = { peritoCreado, errorValidacion, errorCritico };
