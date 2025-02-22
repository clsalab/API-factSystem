const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { CategoriasModel } = require('../models');  // Asegúrate de que el modelo Categorias esté importado correctamente



const getItems = async (req, res) => {
  try {
    const user = req.user

    const data = await CategoriasModel.find({});  // Aquí usamos la función find
    console.log('Datos obtenidos:', data); // Log para verificar la respuesta

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar las Categorias ***", 500);
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario



    // Buscar categoría por ID
    const data = await CategoriasModel.findById(req.params.id);
    if (!data) return res.status(404).send({ message: 'Categoría no encontrada' });

    // Responder con los datos, incluyendo el nombre del rol
    res.send({ data, user });

  } catch (error) {
    console.error("Error al consultar Categoría:", error);
    handleHttpError(res, "*** Error al consultar Categoría ***", 500);
  }
};



const createItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario

    const body = matchedData(req);
    console.log(body); // Verifica que el cuerpo esté llegando correctamente

    const data = await CategoriasModel.create(body); // Crea la categoría
    res.status(201).send({ message: 'Categoría creada con éxito', data, user });
  } catch (error) {
    console.error("Error al crear Categoría:", error);
    handleHttpError(res, "*** Error al crear Categoría ***", 500);
  }
};

const updateItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario

    // Obtener ID y datos del body
    const { id } = req.params;
    const body = req.body;

    // Actualizar la categoría
    const data = await CategoriasModel.findOneAndUpdate({ _id: id }, body, { new: true });
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría actualizada con éxito", data, user });
  } catch (e) {
    console.error("Error al actualizar Categoría:", e);
    handleHttpError(res, "*** Error al actualizar Categoría ***", 500);
  }
};


const deleteItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario

    // Obtener ID desde la URL
    const { id } = req.params;

    // Eliminar la categoría
    const data = await CategoriasModel.delete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría eliminada correctamente", data, user});
  } catch (e) {
    console.error("Error al eliminar Categoría:", e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
