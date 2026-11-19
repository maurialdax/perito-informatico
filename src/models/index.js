const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');

// Integridad referencial: users.role_id -> roles.id
// - allowNull: false  -> todo usuario debe tener rol
// - RESTRICT          -> no se puede borrar un rol que tenga usuarios
// - CASCADE           -> si cambia el id del rol, se actualiza en users
const opcionesFK = {
  foreignKey: { name: 'role_id', allowNull: false },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
};

User.belongsTo(Role, { ...opcionesFK, as: 'role' });
Role.hasMany(User, { ...opcionesFK, as: 'users' });

module.exports = { sequelize, Role, User };
