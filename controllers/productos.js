const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { ProductosModel } = require('../models');

const getItems = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado

    const data = await ProductosModel.findAllData();  // Obtener todos los productos
    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Productos ***");
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado

    const data = await ProductosModel.findOneData(req.params.id); // Buscar el producto por ID
    if (!data) return res.status(404).send({ message: 'Producto no encontrado' });

    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Producto ***");
  }
};

const createItem = async (req, res) => {
  const body = matchedData(req);  // Extraer los datos validados del cuerpo
  const user = req.user;  // Obtén el usuario autenticado
  console.log(`Usuario autenticado: ${user.id}`);

  console.log(body);  // Verifica que el cuerpo esté llegando correctamente

  try {
    // Crear el producto, asociando al usuario como creador
    const data = await ProductosModel.create({
      ...body,
      createdBy: user.id,  // Asocia el usuario que crea el producto
    });

    res.status(201).send({ message: 'Producto creado con éxito', data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al crear Producto ***");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;  // Obtener ID desde la URL
    const body = req.body;  // Obtener los datos a actualizar
    const user = req.user;  // Obtén el usuario autenticado

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);
    console.log(`Usuario autenticado: ${user.id}`);

    // Actualizar el producto, asociando al usuario como el que realiza la actualización
    const data = await ProductosModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      {
        ...body,
        updatedBy: user.id,  // Asocia el usuario que actualiza el producto
      },
      { new: true }  // Retorna el producto actualizado
    );

    if (!data) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto actualizado con éxito", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error en la actualización:", e);
    handleHttpError(res, "*** Error al actualizar Producto ***");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;  // Obtener el ID desde la URL
    const user = req.user;  // Obtén el usuario autenticado

    // Eliminar el producto (soft delete), asociando al usuario que elimina
    const data = await ProductosModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Producto no encontrado" });
    }

    res.status(200).json({ message: "✅ Producto eliminado correctamente (soft delete)", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error al eliminar Producto:", e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
