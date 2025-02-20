const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { RolModel } = require('../models');

const getItems = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado
    console.log(`Usuario autenticado: ${user.id}`);

    const data = await RolModel.find({});  // Obtener todos los roles
    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Rol ***");
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado
    console.log(`Usuario autenticado: ${user.id}`);

    const data = await RolModel.findById(req.params.id);  // Buscar rol por ID
    if (!data) return res.status(404).send({ message: 'Rol no encontrado' });

    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Rol ***");
  }
};

const createItem = async (req, res) => {
  const body = matchedData(req);  // Extraer los datos validados del cuerpo
  const user = req.user;  // Obtén el usuario autenticado
  console.log(`Usuario autenticado: ${user.id}`);

  console.log(body);  // Verifica que el cuerpo esté llegando correctamente

  try {
    // Crear el rol, asociando al usuario como creador
    const data = await RolModel.create({
      ...body,
      createdBy: user.id,  // Asocia el usuario que crea el rol
    });

    res.status(201).send({ message: 'Rol creado con éxito', data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al crear Rol ***");
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

    // Actualizar el rol, asociando al usuario como el que realiza la actualización
    const data = await RolModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      {
        ...body,
        updatedBy: user.id,  // Asocia el usuario que actualiza el rol
      },
      { new: true }  // Retorna el rol actualizado
    );

    if (!data) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.status(200).json({ message: "Rol actualizado con éxito", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error en la actualización:", e);
    handleHttpError(res, "*** Error al actualizar Rol ***");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;  // Obtener el ID desde la URL
    const user = req.user;  // Obtén el usuario autenticado

    console.log("📌 ID recibido para eliminar:", id);
    console.log(`Usuario autenticado: ${user.id}`);

    // Eliminar el rol (soft delete), asociando al usuario que elimina
    const data = await RolModel.delete({ _id: id, deletedBy: user.id });

    if (!data) {
      return res.status(404).json({ message: "❌ Rol no encontrado" });
    }

    res.status(200).json({ message: "✅ Rol eliminado correctamente (soft delete)", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error al eliminar Rol:", e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
