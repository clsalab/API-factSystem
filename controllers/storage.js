
const { StorageModel } = require('../models'); // Asegúrate de que el modelo esté importado correctamente
const BASE_URL = process.env.BASE_URL;

const createItem = async (req, res) => {
  try {
    const { file } = req; // El archivo estará en req.file
    if (!file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Suponiendo que el archivo se ha subido correctamente,
    // la URL es la ruta del archivo guardado en el servidor.
    const fileUrl = `${BASE_URL}/${file.filename}`; // La URL completa del archivo subido

    // Guardamos la información del archivo en la base de datos
    const data = await StorageModel.create({
      filename: file.filename,
      url: fileUrl, // Incluimos la URL del archivo
    });

    res.status(201).send({ data });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error al guardar el archivo' });
  }
};

// ✅ Obtener todos los archivos (R - Read All)
const getItems = async (req, res) => {
  try {
    const data = await StorageModel.find({});
    res.send({ data });

  } catch (error) {
    console.error("❌ Error al obtener los archivos:", error);
    res.status(500).send({ error: "Error al obtener los archivos" });
  }
};

// ✅ Obtener un archivo por ID (R - Read One)
const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await StorageModel.findById(id);

    if (!data) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    res.send({ data });

  } catch (error) {
    console.error("❌ Error al obtener el archivo:", error);
    res.status(500).send({ error: "Error al obtener el archivo" });
  }
};

// ✅ Actualizar un archivo (U - Update)
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename } = req.body;

    const data = await StorageModel.findByIdAndUpdate(
      id,
      { filename },
      { new: true } // Para devolver el objeto actualizado
    );

    if (!data) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    res.send({ message: "Archivo actualizado con éxito", data });

  } catch (error) {
    console.error("❌ Error al actualizar el archivo:", error);
    res.status(500).send({ error: "Error al actualizar el archivo" });
  }
};

// ✅ Eliminar un archivo (D - Delete)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await StorageModel.delete({ _id: id });

    if (!data) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    res.send({ message: "Archivo eliminado con éxito", data });

  } catch (error) {
    console.error("❌ Error al eliminar el archivo:", error);
    res.status(500).send({ error: "Error al eliminar el archivo" });
  }
};

module.exports = { createItem, getItems, getItem, updateItem, deleteItem };
