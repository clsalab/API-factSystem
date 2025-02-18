const { handleHttpError } = require('../utils/handleError');
const { UsersModel } = require('../models');  // Asegúrate de que este modelo esté bien importado

// Middleware para verificar rol
const cherolRol = (requiredRole) => async (req, res, next) => {
  try {
    const user = req.user;

    // Asegurarse de que el usuario esté definido
    if (!user) {
      return handleHttpError(res, "*** Usuario no encontrado ***", 404);
    }

    // Usar populate para obtener los detalles del rol
    await user.populate('idRol');  // Eliminamos execPopulate y solo usamos populate ahora

    // Imprimir el objeto user y su rol para depuración
    console.log("User after populate:", user);
    console.log("User role:", user.idRol);

    // Verifica si el nombre del rol coincide con el rol requerido
    // Suponiendo que el rol tiene un campo 'nombre' (ajústalo si es necesario)
    if (user.idRol.nombre !== requiredRole) {
      return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
    }

    // Si el rol coincide, pasa al siguiente middleware
    next();

  } catch (error) {
    console.error(error);
    handleHttpError(res, "*** Error al verificar rol ***", 500);
  }
}

module.exports = cherolRol;
