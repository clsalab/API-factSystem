const ENGINE_DB = process.env.ENGINE_DB;

const getProperties = () => {
  const data = {
    nosql: {
      id: '_id',
    },
    mysql: {
      id: 'id',
    },
  };
  return data[ENGINE_DB] || data;
};

// Exportar tanto la función como el objeto que contiene las propiedades.
module.exports = { getProperties, propertiesKey: getProperties() };
