const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/detallesVentas');
const { validatorCreateItem, validatorGetItem } = require('../validators/detallesVentas');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para detalles de ventas

// Obtener todos los detalles de ventas - Solo accesible para admin, user, y vendedor
router.get('/', authMiddleware, cherolRol(["admin", "user", "vendedor","supervisor"]), getItems);

// Obtener un detalle de venta específico por ID
router.get('/:id', authMiddleware, validatorGetItem, getItem);  // Agregar el middleware de validación

// Crear un nuevo detalle de venta - Solo accesible para admin
router.post('/', authMiddleware, cherolRol(["admin","supervisor"]), validatorCreateItem, createItem);

// Actualizar un detalle de venta - Accesible solo para admin
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un detalle de venta - Accesible solo para admin
router.delete('/:id', authMiddleware, cherolRol(["admin","supervisor"]), validatorGetItem, deleteItem);

module.exports = router;
