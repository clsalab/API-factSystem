const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorRegisterItem = [
  check('nombreCompleto').exists().notEmpty(),
  check('correo').exists().notEmpty().isEmail(),
  check('idRol').exists().notEmpty().isMongoId(),
  check('clave').exists().notEmpty().isLength({min:3, max:15}),
  check('esActivo').exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
];

const validatorLogin = [
  check('correo').exists().notEmpty().isEmail(),
  check('clave').exists().notEmpty().isLength({min:3, max:15}),

  (req, res, next) => {
    return validateResults(req, res, next)
  }
];



module.exports = { validatorRegisterItem, validatorLogin };