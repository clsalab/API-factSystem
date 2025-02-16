
const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../utils/handleStorage');
const { createItem, deleteItem, updateItem, getItems, getItem } = require('../controllers/storage');
const { validatorGetItem } = require('../validators/storage');
const router = express.Router();



// Ruta para cargar un archivo
router.post('/', upload.single('myfile'), createItem);

// Ruta de prueba (sin archivos)
router.get('/', getItems);
router.get('/:id',validatorGetItem, getItem);

router.put('/:id',validatorGetItem, updateItem);
router.delete('/:id',validatorGetItem, deleteItem);

module.exports = router;
