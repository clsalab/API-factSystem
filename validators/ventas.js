const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
  check('numeroDocumento').exists().notEmpty(),
  check('tipoPago').exists().notEmpty(),
  check('total').exists().notEmpty(),
  check('precio').exists().notEmpty(),
  check('esActivo').exists().notEmpty(),
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