const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { MenuRolModel }  = require('../models');

const getItems = async (req, res) => {
  try {

    const data = await MenuRolModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Categoria ***");
  }
};

const getItem = async (req, res) => {

  try {

    const data = await MenuRolModel.findById(req.params.id); // Busca la categoría por ID
    if (!data) return res.status(404).send({ message: 'Categoría no encontrada' });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Categoría ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await MenuRolModel.create(body); // Crea la categoría en la base de datos
    res.status(201).send({ message: 'Categoría creada con éxito', data: data });
  } catch (error) {
    handleHttpError(res, "*** Error create Items ***");
  }
};


const updateItem = async (req, res) => {
  try {
    // Obtener ID de la URL y datos del body
    const { id } = req.params; // Tomar el ID desde la URL
    const body = req.body; // Tomar los datos a actualizar

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);



    // Actualizar la categoría
    const data = await MenuRolModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la categoría actualizada
    );

    // Verificar si la categoría existe
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría actualizada con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Categoría ***");
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await MenuRolModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Categoría no encontrada" });
    }

    res.status(200).json({ message: "✅ Categoría eliminada correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar categoría:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};