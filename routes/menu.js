const express = require('express');
const { getItems, getItem, createItem, deleteItem, updateItem } = require('../controllers/menu');
const { validatorCreateItem, validatorGetItem } = require('../validators/menu');
const router = express.Router();

// Crud

router.get('/', getItems);
router.get('/:id',validatorGetItem, getItem); // Resto de la ruta para obtener un solo item
router.post('/', validatorCreateItem, createItem);
router.put('/:id',validatorGetItem, validatorCreateItem, updateItem);
router.delete('/:id',validatorGetItem, deleteItem);


module.exports = router