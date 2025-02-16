const customHeader =(req,res, next) => {
  next();
}

module.exports = customHeader;