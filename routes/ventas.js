const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/ventas');
const { validatorCreateItem, validatorGetItem } = require('../validators/ventas');
const router = express.Router();

// Crud

router.get('/', getItems);
router.get('/:id',validatorGetItem, getItem);
router.post('/',validatorCreateItem, createItem);
router.put('/:id',validatorGetItem, updateItem);
router.delete('/id',validatorGetItem, deleteItem);


module.exports = router