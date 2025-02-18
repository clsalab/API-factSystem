const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/categorias');
const { validatorCreateItem, validatorGetItem } = require('../validators/categoria');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// Crud

// Rutas para las categorías
router.get('/',authMiddleware, getItems);
router.get('/:id',validatorGetItem, getItem); // Resto de la ruta para obtener un solo item
router.post('/', authMiddleware,cherolRol("admin"), validatorCreateItem, createItem);
router.put('/:id',validatorGetItem, validatorCreateItem, updateItem);
router.delete('/:id',validatorGetItem, deleteItem);



module.exports = router