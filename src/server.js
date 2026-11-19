require('dotenv').config({ quiet: true });

const app = require('./app');
const { sequelize } = require('./models');
const { asegurarRoles } = require('./seeds/seedRoles');
const logger = require('./utils/logger');

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate(); // comprueba que la conexión a la base funciona
    await sequelize.sync(); // crea las tablas si no existen (no borra datos)
    await asegurarRoles(); // garantiza que existan ADMIN, FORENSIC_INSPECTOR y AUDITOR

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`Base de datos: ${sequelize.getDialect()}`);
    });
  } catch (err) {
    logger.errorCritico(err);
    process.exit(1);
  }
}

iniciar();
