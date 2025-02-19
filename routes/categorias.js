const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/categorias');
const { validatorCreateItem, validatorGetItem } = require('../validators/categoria');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// CRUD para categorías

router.get('/', authMiddleware,cherolRol(["admin", "user"]), getItems);  // Middleware de autenticación
router.get('/:id', authMiddleware, validatorGetItem, getItem);  // Obtener un solo item
router.post('/', authMiddleware, cherolRol("admin"), validatorCreateItem, createItem);  // Solo 'admin' puede crear
router.put('/:id', validatorGetItem, validatorCreateItem, updateItem);  // Actualizar una categoría
router.delete('/:id', validatorGetItem, deleteItem);  // Eliminar una categoría

module.exports = router;
