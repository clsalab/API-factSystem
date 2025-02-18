require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morganBody = require('morgan-body');
const loggerStream = require('./utils/handleLogger');
const dbConnectionNoSql = require('./config/mongo');
const { dbConnectMysql } = require('./config/mysql');  // Asegúrate de importar la función correctamente

const app = express();
const ENGINE_DB = process.env.ENGINE_DB;
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

// Morgan Body
morganBody(app, {
  noColors: true,
  stream: loggerStream,
  skip: function(req, res) {
    return res.statusCode < 400;  // Skip logging for status codes >= 400
  }
});

const port = process.env.PORT || 3000;

// Routes
app.use("/api", require("./routes"));

const startServer = async () => {
  try {
    if (ENGINE_DB === 'nosql') {
      await dbConnectionNoSql();  // Espera a que se conecte a NoSQL
    } else {
      await dbConnectMysql();  // Espera a que se conecte a MySQL
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);  // Detén la ejecución si no se puede conectar a la base de datos
  }
};

startServer();  // Llama a la función para iniciar el servidor
