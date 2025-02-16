const express = require('express');
const { getItems, getItem, createItem,  deleteItem } = require('../controllers/ventas');
const { validatorCreateItem, validatorGetItem } = require('../validators/ventas');
const router = express.Router();

// Crud

router.get('/', getItems);
router.get('/', getItem);
router.post('/',validatorCreateItem, createItem);
router.delete('/', deleteItem);


module.exports = router