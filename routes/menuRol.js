const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/menuRol');
const { validatorCreateItem, validatorGetItem } = require('../validators/menuRol');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para MenuRol

// Obtener todos los menuRoles - Solo accesible para admin, user, vendedor
router.get('/', authMiddleware, cherolRol(["admin", "user", "vendedor"]), getItems);

// Obtener un solo menuRol - Cualquier usuario autenticado
router.get('/:id', authMiddleware, validatorGetItem, getItem);

// Crear un nuevo menuRol - Solo accesible para admin
router.post('/', authMiddleware, cherolRol("admin"), validatorCreateItem, createItem);

// Actualizar un menuRol - Solo accesible para admin
router.put('/:id', authMiddleware, validatorGetItem, validatorCreateItem, updateItem);

// Eliminar un menuRol - Solo accesible para admin
router.delete('/:id', authMiddleware, cherolRol("admin"), validatorGetItem, deleteItem);

module.exports = router;
