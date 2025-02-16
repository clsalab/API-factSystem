const handleHttpError = (res, message = "Algo salió mal", code = 500) => {
  res.status(code).json({ error: message });
};

module.exports = handleHttpError;



