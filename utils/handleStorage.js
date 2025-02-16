const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Asegúrate de que la carpeta 'storage' exista
const storagePath = path.join(__dirname, '..', 'storage');
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);  // Si no existe, la crea
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath); // Usa la ruta correctamente
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = `file-${Date.now()}.${ext}`;
    cb(null, filename);
  }
});

// Configurar multer con el almacenamiento definido
const upload = multer({ storage: storage });

module.exports = upload;
