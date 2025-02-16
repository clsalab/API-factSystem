const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
  check('idVentas').exists().notEmpty().isMongoId(),
  check('idProducto').exists().notEmpty().isMongoId(),
  check('cantidad').exists().notEmpty(),
  check('precioUnitario').exists().notEmpty(),
  check('total').exists().notEmpty(),

  (req, res, next) => {
    return validateResults(req, res, next)
  }
];
const validatorGetItem = [
  check('id').exists().notEmpty().isMongoId(),

  (req, res, next) => {
    return validateResults(req, res, next)
  }
];
module.exports = { validatorCreateItem, validatorGetItem };