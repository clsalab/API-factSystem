const express = require('express');
const { validatorRegisterItem, validatorLogin } = require('../validators/auth');
const { login, registerUser } = require('../controllers/auth');
const router = express.Router();


router.post('/login',validatorLogin, login);
router.post('/register',validatorRegisterItem, registerUser);

module.exports = router;