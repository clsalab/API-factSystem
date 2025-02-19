const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { DetallesVentasModel }  = require('../models');

const getItems = async (req, res) => {
  try {
    const user = req.user
    const data = await DetallesVentasModel.findAllData();  // Aquí usamos la función find
    console.log('Datos obtenidos:', data); // Log para verificar la respuesta

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Detalles Ventas ***", 500);
  }
};

const getItem = async (req, res) => {

  try {
    const user = req.user
    const data = await DetallesVentasModel.findOneData(req.params.id); // Busca la Detalles Ventas por ID
    if (!data) return res.status(404).send({ message: 'Detalles Ventas no encontrado' });
    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Detalles Ventas ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await DetallesVentasModel.create(body); // Crea la Detalles Ventas en la base de datos
    res.status(201).send({ message: 'Detalles Ventas creada con éxito', data: data });
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



    // Actualizar la Detalles Ventas
    const data = await DetallesVentasModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la Detalles Ventas actualizada
    );

    // Verificar si la Detalles Ventas existe
    if (!data) {
      return res.status(404).json({ message: "Detalles Ventas no encontrado" });
    }

    res.status(200).json({ message: "Detalles Ventas actualizada con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Detalles Ventas ***");
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await DetallesVentasModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Detalles Ventas no encontrado" });
    }

    res.status(200).json({ message: "✅ Detalles Ventas eliminada correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar Detalles Ventas:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};