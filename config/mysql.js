const { Sequelize } = require('sequelize');

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const dbConnectMysql = async () => {  // Cambié "Connet" a "Connect"
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos MySQL');
  } catch (e) {
    console.log('MYSQL Error de Conexión', e);
  }
};

module.exports = { sequelize, dbConnectMysql };  // También cambié aquí el nombre de la función
