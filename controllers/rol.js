const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { RolModel }  = require('../models');

const getItems = async (req, res) => {
  try {

    const data = await RolModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Rol ***");
  }
};

const getItem = async (req, res) => {

  try {

    const data = await RolModel.findById(req.params.id); // Busca la Rol por ID
    if (!data) return res.status(404).send({ message: 'Rol no encontrado' });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Rol ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

   // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await RolModel.create(body); // Crea la Rol en la base de datos
    res.status(201).send({ message: 'Rol creado con éxito', data: data });
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



    // Actualizar la Rol
    const data = await RolModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la Rol actualizada
    );

    // Verificar si la Rol existe
    if (!data) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ message: "Rol actualizado con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Rol ***");
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await RolModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Rol no encontrado" });
    }

    res.status(200).json({ message: "✅ Rol eliminado correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar Rol:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};