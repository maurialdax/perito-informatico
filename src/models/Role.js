const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla "roles": (id, nombre_rol)
const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'roles',
    timestamps: false, // la tabla roles no necesita created_at / updated_at
  }
);

module.exports = Role;
