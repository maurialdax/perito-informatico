const createError = require('http-errors');
const { UniqueConstraintError } = require('sequelize');
const { User, Role } = require('../models');
const logger = require('../utils/logger');
const { parseId } = require('../utils/validators');

// JOIN con roles. required: false => LEFT JOIN (trae el usuario aunque no tenga rol).
const incluirRol = {
  model: Role,
  as: 'role',
  attributes: ['id', 'nombre_rol'],
  required: false,
};

// Arma la respuesta JSON que ve el cliente (incluye el nombre del rol).
function aRespuesta(user) {
  return {
    id: user.id,
    username: user.username,
    role_id: user.role_id,
    role: user.role ? user.role.nombre_rol : null,
    active: user.active,
    created_at: user.created_at,
  };
}

// POST /api/v1/peritos
async function crearPerito(req, res, next) {
  try {
    const { username, role_id } = req.body || {};

    // Validación: username no vacío
    if (typeof username !== 'string' || username.trim() === '') {
      throw createError(400, 'El username no puede estar vacío', { field: 'username' });
    }
    const nombre = username.trim();
    if (nombre.length > 50) {
      throw createError(400, 'El username no puede superar los 50 caracteres', {
        field: 'username',
      });
    }

    // Validación: role_id debe ser un número y existir en la tabla roles
    const roleId = parseId(role_id);
    if (roleId === null) {
      throw createError(400, 'role_id debe ser un número entero positivo', {
        field: 'role_id',
      });
    }
    const rol = await Role.findByPk(roleId);
    if (!rol) {
      throw createError(400, `El rol con id ${roleId} no existe`, { field: 'role_id' });
    }

    // Username duplicado -> 409 Conflict
    const existente = await User.findOne({ where: { username: nombre } });
    if (existente) {
      throw createError(409, `El username "${nombre}" ya existe`, { field: 'username' });
    }

    const nuevo = await User.create({ username: nombre, role_id: roleId });

    // Se vuelve a leer con el JOIN para devolver también el nombre del rol
    const creado = await User.findByPk(nuevo.id, { include: [incluirRol] });
    const respuesta = aRespuesta(creado);

    logger.peritoCreado(respuesta);
    res.status(201).json(respuesta);
  } catch (err) {
    // Por si dos peticiones simultáneas pasan el chequeo anterior: lo frena la restricción UNIQUE
    if (err instanceof UniqueConstraintError) {
      return next(createError(409, 'El username ya existe', { field: 'username' }));
    }
    next(err);
  }
}

// DELETE /api/v1/peritos/:id  (baja lógica)
async function eliminarPerito(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      throw createError(400, 'El id debe ser un número entero positivo', { field: 'id' });
    }

    const perito = await User.findByPk(id);

    // Si no existe (o ya estaba dado de baja) -> 404
    if (!perito || !perito.active) {
      throw createError(404, `No existe un perito activo con id ${id}`);
    }

    // Soft delete: solo se cambia active. La fila NO se borra del archivo .db
    await perito.update({ active: false });

    res.status(200).json({ message: `Perito ${id} dado de baja correctamente` });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/peritos  (?role=ADMIN opcional)
async function listarPeritos(req, res, next) {
  try {
    const where = { active: true };
    const { role } = req.query;

    if (role !== undefined) {
      if (typeof role !== 'string' || role.trim() === '') {
        throw createError(400, 'El parámetro role no puede estar vacío', { field: 'role' });
      }

      const nombreRol = role.trim().toUpperCase();
      const rol = await Role.findOne({ where: { nombre_rol: nombreRol } });
      if (!rol) {
        throw createError(400, `El rol "${role}" no existe`, { field: 'role' });
      }

      // Filtro sobre la tabla unida, manteniendo el LEFT JOIN
      where['$role.nombre_rol$'] = nombreRol;
    }

    const peritos = await User.findAll({
      where,
      include: [incluirRol],
      order: [['id', 'ASC']],
    });

    res.status(200).json({ total: peritos.length, data: peritos.map(aRespuesta) });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/peritos/:id
async function obtenerPerito(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      throw createError(400, 'El id debe ser un número entero positivo', { field: 'id' });
    }

    // Solo devuelve usuarios activos: si no existe o está dado de baja -> 404
    const perito = await User.findOne({
      where: { id, active: true },
      include: [incluirRol],
    });

    if (!perito) {
      throw createError(404, `No existe un perito activo con id ${id}`);
    }

    res.status(200).json(aRespuesta(perito));
  } catch (err) {
    next(err);
  }
}

module.exports = { crearPerito, eliminarPerito, listarPeritos, obtenerPerito };
