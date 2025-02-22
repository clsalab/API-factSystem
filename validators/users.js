const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorCreateItem = [
  check('nombreCompleto').exists().notEmpty(),
  check('correo').exists().notEmpty(),
  check('idRol').exists().notEmpty().isMongoId(),
  check('clave').exists().notEmpty(),
  check('idMenuRol').exists().notEmpty().isMongoId(),
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