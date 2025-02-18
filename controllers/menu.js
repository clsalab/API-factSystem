const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { MenuModel }  = require('../models');

const getItems = async (req, res) => {
  try {

    const data = await MenuModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Menu ***");
  }
};

const getItem = async (req, res) => {

  try {

    const data = await MenuModel.findById(req.params.id); // Busca la Menu por ID
    if (!data) return res.status(404).send({ message: 'Menu no encontrada' });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Menu ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await MenuModel.create(body); // Crea la Menu en la base de datos
    res.status(201).send({ message: 'Menu creado con éxito', data: data });
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



    // Actualizar la Menu
    const data = await MenuModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la Menu actualizada
    );

    // Verificar si la Menu existe
    if (!data) {
      return res.status(404).json({ message: "Menu no encontrado" });
    }

    res.status(200).json({ message: "Menu actualizado con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Menu ***");
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await MenuModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Menu no encontrado" });
    }

    res.status(200).json({ message: "✅ Menu eliminado correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar Menu:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};