// Conexión dinámica a la base de datos.
// Según DB_DIALECT (en el archivo .env) se usa SQLite (desarrollo) o PostgreSQL (producción).
// El resto del proyecto (modelos y controladores) no cambia: solo importa "sequelize" desde acá.

const path = require('path');
const { Sequelize } = require('sequelize');

require('dotenv').config({ quiet: true });

const dialect = (process.env.DB_DIALECT || 'sqlite').toLowerCase();

let sequelize;

if (dialect === 'sqlite') {
  // El archivo .db se guarda en la raíz del proyecto por defecto.
  const storage = path.resolve(process.cwd(), process.env.DB_STORAGE || 'forensics.db');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false,
  });
} else if (dialect === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
} else {
  throw new Error(`DB_DIALECT inválido: "${dialect}". Valores permitidos: sqlite, postgres`);
}

module.exports = sequelize;
