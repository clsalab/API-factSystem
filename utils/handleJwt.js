const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;



const tokenSign = async (user) => {
  if (!user._id || !user.nombreCompleto || !user.idRol) {
    throw new Error("Faltan datos esenciales para generar el token");
  }
  const sign = jwt.sign(
    {
      id: user._id,
      username: user.nombreCompleto,
      roles: user.idRol,
    },
    JWT_SECRET,
    { expiresIn: '1h' }  // Aquí se maneja la expiración directamente
  );

  return sign;
};


const tokenVerify = async (tokenJwt) => {
  try {
    const decoded = await jwt.verify(tokenJwt, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    if (error.name === 'TokenExpiredError') {
      console.error("El token ha expirado");
    }
    return null;  // Devuelve null si el token es inválido o expirado
  }
}


// Este archivo contiene las funciones para generar y verificar tokens JWT.

module.exports = { tokenSign, tokenVerify };