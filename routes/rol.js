const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/rol');
const { validatorCreateItem, validatorGetItem } = require('../validators/rol');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para Roles

// Obtener todos los roles - Solo accesible para admin
router.get('/', authMiddleware, cherolRol("admin"), getItems);

// Obtener un solo rol - Cualquier usuario autenticado
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear un nuevo rol - Solo accesible para admin
router.post('/', authMiddleware, cherolRol("admin"), validatorCreateItem, createItem);

// Actualizar un rol - Solo accesible para admin
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un rol - Solo accesible para admin
router.delete('/:id', authMiddleware, cherolRol("admin"), validatorGetItem, deleteItem);

module.exports = router;
