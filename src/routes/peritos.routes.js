const { Router } = require('express');
const controller = require('../controllers/peritos.controller');

const router = Router();

// Se montan bajo /api/v1/peritos (ver app.js)
router.post('/', controller.crearPerito); // body JSON: { username, role_id }
router.get('/', controller.listarPeritos); // query param: ?role=ADMIN
router.get('/:id', controller.obtenerPerito); // route param: :id
router.delete('/:id', controller.eliminarPerito); // route param: :id

module.exports = router;
