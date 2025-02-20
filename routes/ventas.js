const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/ventas');
const { validatorCreateItem, validatorGetItem } = require('../validators/ventas');
const authMiddleware = require('../middleware/sesion');  // Middleware de autenticación
const cherolRol = require('../middleware/rol');  // Middleware de roles
const router = express.Router();

// CRUD para ventas

// Obtener todas las ventas (solo accesible por admin y vendedor)
router.get('/', authMiddleware, cherolRol(["admin", "vendedor"]), getItems);

// Obtener una venta por ID (solo accesible por admin, vendedor o el usuario que la creó)
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear una nueva venta (solo accesible por admin y vendedor)
router.post('/', authMiddleware, cherolRol(["admin", "vendedor"]), validatorCreateItem, createItem);

// Actualizar una venta por ID (solo accesible por admin o vendedor)
router.put('/:id', authMiddleware, validatorGetItem, updateItem);

// Eliminar una venta por ID (solo accesible por admin y vendedor)
router.delete('/:id', authMiddleware, cherolRol(["admin", "vendedor"]), validatorGetItem, deleteItem);

module.exports = router;
