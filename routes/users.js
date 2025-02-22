const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/users');
const { validatorCreateItem, validatorGetItem } = require('../validators/users');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para usuarios

// Obtener todos los usuarios - Solo accesible para admins
router.get('/', authMiddleware, cherolRol(["admin","user"]), getItems);

// Obtener un solo usuario - Accesible para usuarios autenticados
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear un nuevo usuario - Solo accesible para admins
router.post('/', authMiddleware, cherolRol("admin"), validatorCreateItem, createItem);

// Actualizar un usuario - Solo accesible para admins
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un usuario - Solo accesible para admins
router.delete('/:id', authMiddleware, cherolRol("admin"), validatorGetItem, deleteItem);

module.exports = router;
