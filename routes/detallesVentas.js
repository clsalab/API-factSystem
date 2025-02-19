const express = require('express');
const { getItems, getItem, createItem,  deleteItem, updateItem } = require('../controllers/detallesVentas');
const { validatorCreateItem, validatorGetItem } = require('../validators/detallesVentas');
const authMiddleware = require('../middleware/sesion');
const cherolRol = require('../middleware/rol');
const router = express.Router();

// Crud

router.get('/', authMiddleware,cherolRol(["admin", "user", "vendedor"]), getItems);
router.get('/:id',validatorGetItem, getItem); // Resto de la ruta para obtener un solo item
router.post('/', validatorCreateItem, createItem);
router.put('/:id',validatorGetItem, validatorCreateItem, updateItem);
router.delete('/:id',validatorGetItem, deleteItem);


module.exports = router