const express = require('express');
const fs = require('fs');
const router = express.Router();

const PATH_ROUTES = __dirname;

const removeExtension = (fileName) => {
  return fileName.split('.')[0];
}

const a = fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExtension(file);
    if (name !== 'index') {
      // Corregir el uso de las comillas invertidas para interpolar el valor de `name`
      console.log(`Cargando ruta ${name}`);

      // Corregir la interpolación de la ruta de `require` también
      router.use(`/${name}`, require(`./${file}`));
    }
});



module.exports = router;
