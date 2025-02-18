// middleware/sesion.js
const { handleHttpError } = require('../utils/handleError'); // Asegúrate de que la importación esté correcta
const { tokenVerify } = require('../utils/handleJwt');
const { UsersModel } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Verificar si el encabezado 'Authorization' está presente
    if (!authHeader) {
      handleHttpError(res, "*** No tienes una sesión iniciada ***", 401);
      return;
    }

    // Verificar que el encabezado tiene el formato correcto
    const token = authHeader.split(" ")[1];
    console.log("Token recibido:", token);  // Imprime el token para verificar que tiene el formato adecuado

    if (!token) {
      handleHttpError(res, "*** Token no proporcionado ***", 401);
      return;
    }

    // Verifica el token usando tokenVerify
    const dataToken = await tokenVerify(token);
    console.log("Token decodificado:", dataToken);  // Verifica el contenido del token decodificado

    if (!dataToken || !dataToken.id) {
      handleHttpError(res, "*** Token no válido ***", 401);
      return;
    }

    // Aquí estaba el error: el bloque estaba cerrado antes de tiempo
    const user = await UsersModel.findById(dataToken.id);
    req.user = user;

    // Si todo es correcto, continuamos con la siguiente capa
    next();
  } catch (e) {
    handleHttpError(res, "*** Error en el middleware de autenticación ***", 401);
    console.error(e);
  }
};

module.exports = authMiddleware;
