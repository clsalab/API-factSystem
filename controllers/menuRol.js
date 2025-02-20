const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { MenuRolModel } = require('../models');

const getItems = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado
    console.log(`Usuario autenticado: ${user.id}`);  // Puedes usar esto para auditoría

    const data = await MenuRolModel.findAllData();
    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar MenuRol ***");
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Obtén el usuario autenticado
    console.log(`Usuario autenticado: ${user.id}`);

    const data = await MenuRolModel.findOneData(req.params.id); // Busca la MenuRol por ID
    if (!data) return res.status(404).send({ message: 'MenuRol no encontrado' });

    res.send({ data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar MenuRol ***");
  }
};

const createItem = async (req, res) => {
  const body = matchedData(req);
  const user = req.user;  // Obtén el usuario autenticado
  console.log(`Usuario autenticado: ${user.id}`);

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await MenuRolModel.create({
      ...body,
      createdBy: user.id,  // Asocia el usuario que crea el ítem
    });

    res.status(201).send({ message: 'MenuRol creado con éxito', data, user });  // Devolver los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al crear MenuRol ***");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const user = req.user;  // Obtén el usuario autenticado

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);
    console.log(`Usuario autenticado: ${user.id}`);

    const data = await MenuRolModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      {
        ...body,
        updatedBy: user.id,  // Asocia el usuario que actualiza el ítem
      },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "MenuRol no encontrado" });
    }

    res.status(200).json({ message: "MenuRol actualizado con éxito", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error en la actualización:", e);
    handleHttpError(res, "*** Error al actualizar MenuRol ***");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;  // Obtén el usuario autenticado

    // Eliminar el item de manera "soft delete" y asociar al usuario que lo elimina
    const data = await MenuRolModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ MenuRol no encontrado" });
    }

    res.status(200).json({ message: "✅ MenuRol eliminado correctamente (soft delete)", data, user });  // Devolver los datos junto con el usuario
  } catch (e) {
    console.error("❌ Error al eliminar MenuRol:", e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
