const { handleHttpError } = require('../utils/handleError');
const { RolModel } = require('../models');  // Asegúrate de que este modelo esté bien importado

// Middleware para verificar rol
const cherolRol = (requiredRoles) => async (req, res, next) => {
  try {
    const user = req.user;  // Obtén el usuario desde la request (presumiblemente lo asignaste desde el middleware de autenticación)

    // Asegurarse de que el usuario esté definido
    if (!user) {
      return handleHttpError(res, "*** Usuario no encontrado ***", 404);
    }

    // Usar populate para obtener los detalles del rol
    await user.populate({
      path: 'idRol',  // Este campo debe estar correctamente referenciado
      model: RolModel,  // El modelo de Rol que estás utilizando
      select: 'nombre'  // Solo seleccionamos el campo 'nombre' del rol
    });

    // Verifica si el nombre del rol está en el array de roles requeridos
    if (!requiredRoles.includes(user.idRol.nombre)) {
      return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
    }

    // Si el rol coincide, pasa al siguiente middleware
    next();

  } catch (error) {
    console.error("❌ Error al verificar rol:", error);
    handleHttpError(res, "*** Error al verificar rol ***", 500);
  }
}

module.exports = cherolRol;
