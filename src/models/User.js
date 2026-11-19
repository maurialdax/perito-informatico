const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla "users": (id, username, role_id, active, created_at)
// La columna role_id (clave foránea) se agrega en models/index.js con la asociación.
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    // Soft delete: nunca se borra la fila, solo se pasa active a false.
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at', // Sequelize completa la fecha automáticamente al crear
    updatedAt: false,
  }
);

module.exports = User;
