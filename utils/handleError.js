// utils/handleError.js
const handleHttpError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    error: message,
  });
};

module.exports = { handleHttpError };
