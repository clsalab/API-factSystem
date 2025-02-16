const { validationResult } = require('express-validator');


const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    const errors = err.array();
    res.status(403).json({ errors });
  }

};

module.exports = validateResults;