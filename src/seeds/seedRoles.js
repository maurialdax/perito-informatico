const { Role } = require('../models');

const ROLES = ['ADMIN', 'FORENSIC_INSPECTOR', 'AUDITOR'];

// Crea los roles requeridos si todavía no existen (no duplica si ya están).
async function asegurarRoles() {
  for (const nombre of ROLES) {
    await Role.findOrCreate({ where: { nombre_rol: nombre } });
  }
}

module.exports = { ROLES, asegurarRoles };
