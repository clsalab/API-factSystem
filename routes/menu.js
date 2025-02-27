const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/menu');
const { validatorCreateItem, validatorGetItem } = require('../validators/menu');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para Menu

// Obtener todos los menús - Puede ser accesible para admin, user, y vendedor
router.get('/', authMiddleware, cherolRol(["admin", "user", "vendedor","supervisor"]), getItems);

// Obtener un solo menú - Accesible para cualquier usuario autenticado
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear un nuevo menú - Solo accesible para admin
router.post('/', authMiddleware, cherolRol(["admin","supervisor"]), validatorCreateItem, createItem);

// Actualizar un menú - Solo accesible para admin
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un menú - Solo accesible para admin
router.delete('/:id', authMiddleware, cherolRol(["admin","supervisor"]), validatorGetItem, deleteItem);

module.exports = router;
