// Script de carga inicial: crea las tablas, los roles y usuarios de prueba.
// Se ejecuta con: npm run seed

require('dotenv').config({ quiet: true });

const { sequelize, Role, User } = require('../models');
const { asegurarRoles } = require('./seedRoles');

const USUARIOS_DE_PRUEBA = [
  { username: 'admin.garcia', rol: 'ADMIN' },
  { username: 'perito.lopez', rol: 'FORENSIC_INSPECTOR' },
  { username: 'perito.martinez', rol: 'FORENSIC_INSPECTOR' },
  { username: 'auditor.fernandez', rol: 'AUDITOR' },
];

async function seed() {
  try {
    await sequelize.sync();
    await asegurarRoles();

    for (const datos of USUARIOS_DE_PRUEBA) {
      const rol = await Role.findOne({ where: { nombre_rol: datos.rol } });

      // findOrCreate evita duplicar si el seed se ejecuta más de una vez
      const [user, creado] = await User.findOrCreate({
        where: { username: datos.username },
        defaults: { role_id: rol.id },
      });

      console.log(`${creado ? 'Creado ' : 'Ya existe'}: ${user.username} (${datos.rol})`);
    }

    console.log('Seed finalizado.');
  } catch (err) {
    console.error('Error ejecutando el seed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
