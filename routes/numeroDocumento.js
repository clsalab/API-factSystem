const express = require('express');
const { getItems, getItem, createItem,  deleteItem, updateItem, incrementarNumero, eliminarNumeroDocumento, restaurarNumeroDocumento } = require('../controllers/numeroDocumento');
const { validatorCreateItem, validatorGetItem } = require('../validators/numeroDocumento');
const router = express.Router();

// Crud

router.get('/', getItems);
router.get('/:id',validatorGetItem, getItem); // Resto de la ruta para obtener un solo item
router.post('/', validatorCreateItem, createItem);
router.put('/:id',validatorGetItem, validatorCreateItem, updateItem);
router.delete('/:id',validatorGetItem, deleteItem);
router.post('/incrementar', incrementarNumero);

// Ruta para eliminar (soft delete) un número
router.delete('/:id/eliminar', eliminarNumeroDocumento);

// Ruta para restaurar un número eliminado
router.patch('/:id/restaurar', restaurarNumeroDocumento);
module.exports = router