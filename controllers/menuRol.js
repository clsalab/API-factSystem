const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { MenuRolModel }  = require('../models');

const getItems = async (req, res) => {
  try {

    const data = await MenuRolModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar MenuRol ***");
  }
};

const getItem = async (req, res) => {

  try {

    const data = await MenuRolModel.findById(req.params.id); // Busca la MenuRol por ID
    if (!data) return res.status(404).send({ message: 'MenuRol no encontrado' });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar MenuRol ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await MenuRolModel.create(body); // Crea la MenuRol en la base de datos
    res.status(201).send({ message: 'MenuRol creado con éxito', data: data });
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



    // Actualizar la MenuRol
    const data = await MenuRolModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la MenuRol actualizada
    );

    // Verificar si la MenuRol existe
    if (!data) {
      return res.status(404).json({ message: "MenuRol no encontrado" });
    }

    res.status(200).json({ message: "MenuRol actualizado con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar MenuRol ***");
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
      return res.status(404).json({ message: "❌ MenuRol no encontrado" });
    }

    res.status(200).json({ message: "✅ MenuRol eliminado correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar MenuRol:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};