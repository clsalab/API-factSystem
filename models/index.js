

const models = {
  CategoriasModel: require('./nosql/categorias'),
  ProductosModel: require('./nosql/productos'),
  RolModel: require('./nosql/rol'),
  MenuModel: require('./nosql/menu'),
  MenuRolModel: require('./nosql/menuRol'),
  UsersModel: require('./nosql/users'),
  VentasModel: require('./nosql/ventas'),
  DetallesVentasModel: require('./nosql/detallesVetas'),
  NumeroDocumentoModel: require('./nosql/numeroDocumento'),
  StorageModel: require('./nosql/storage')
};

module.exports = models;
