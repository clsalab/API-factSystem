const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = async (user) => {
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
    return null;
  }

}

module.exports = { tokenSign, tokenVerify };