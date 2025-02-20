// middleware/sesion.js
const { handleHttpError } = require('../utils/handleError');
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
    const dataToken = await tokenVerify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", dataToken);  // Verifica el contenido del token decodificado

    if (!dataToken || !dataToken.id) {
      handleHttpError(res, "*** Token no válido ***", 401);
      return;
    }

    // Buscar al usuario y usar populate para obtener el rol
    const user = await UsersModel.findById(dataToken.id).populate('idRol', 'nombre'); // Aquí se usa populate
    if (!user) {
      handleHttpError(res, "*** Usuario no encontrado ***", 404);
      return;
    }

    // Añadir el usuario al objeto request para que esté disponible en las siguientes capas
    req.user = user;

    // Si todo es correcto, continuamos con la siguiente capa
    next();
  } catch (e) {
    handleHttpError(res, "*** Error en el middleware de autenticación ***", 401);
    console.error(e);
  }
};

module.exports = authMiddleware;
