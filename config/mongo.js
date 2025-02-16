require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
  const DB_URI = process.env.DB_URI;
  try {
    await mongoose.connect(DB_URI); // Sin las opciones obsoletas
    console.log('****CONEXION A LA DB MONGO****');
  } catch (err) {
    console.error(`****ERROR DE CONEXION DB MONGO: ${err.message}****`);
    process.exit(1);
  }
};

module.exports = dbConnect;
