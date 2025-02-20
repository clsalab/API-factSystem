const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/productos');
const { validatorCreateItem, validatorGetItem } = require('../validators/productos');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para Productos

// Obtener todos los productos - Accesible para admin, user y vendedor
router.get('/', authMiddleware, cherolRol(["admin", "user", "vendedor"]), getItems);

// Obtener un solo producto - Cualquier usuario autenticado
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear un nuevo producto - Solo accesible para admin
router.post('/', authMiddleware, cherolRol("admin"), validatorCreateItem, createItem);

// Actualizar un producto - Solo accesible para admin
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un producto - Solo accesible para admin
router.delete('/:id', authMiddleware, cherolRol("admin"), validatorGetItem, deleteItem);

module.exports = router;
