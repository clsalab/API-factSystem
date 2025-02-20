const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError'); // Asegúrate de que esta ruta sea correcta

const { UsersModel } = require('../models');

// Obtener todos los usuarios
const getItems = async (req, res) => {
  try {
    const data = await UsersModel.findAllData();  // Obtener todos los usuarios

    console.log('Datos obtenidos:', data); // Log para verificar la respuesta

    res.send({ data });
  } catch (error) {
    console.error('Error al consultar Users:', error); // Log detallado
    handleHttpError(res, "*** Error al consultar Users ***", 500);
  }
};

// Obtener un usuario específico por ID
const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recibido para buscar:', id);

    const data = await UsersModel.findById(id); // Buscar usuario por ID

    if (!data) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    res.send({ data });
  } catch (error) {
    console.error('Error al consultar Usuario:', error);
    handleHttpError(res, "*** Error al consultar Usuario ***", 500);
  }
};

// Crear un nuevo usuario
const createItem = async (req, res) => {
  const body = matchedData(req);  // Obtener el cuerpo de la solicitud

  console.log(body);  // Log para verificar el cuerpo recibido

  try {
    // Validar que los campos obligatorios estén presentes
    if (!body.nombreCompleto || !body.correo || !body.clave) {
      return res.status(400).json({ error: "Faltan datos obligatorios (nombre, correo, clave)" });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await UsersModel.findOne({ correo: body.correo });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    // Crear el nuevo usuario
    const data = await UsersModel.create(body);

    // Respuesta exitosa
    res.status(201).send({
      message: "Usuario creado con éxito",
      data: data
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    handleHttpError(res, "*** Error al crear el usuario ***", 500, error.stack);
  }
};

// Actualizar un usuario existente
const updateItem = async (req, res) => {
  try {
    // Obtener ID desde la URL y los datos del body
    const { id } = req.params;
    const body = req.body;

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);

    // Verificar si el usuario existe antes de actualizar
    const user = await UsersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar el usuario
    const data = await UsersModel.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }  // Retorna el usuario actualizado
    );

    res.status(200).json({ message: "Usuario actualizado con éxito", data });
  } catch (e) {
    console.error("❌ Error en la actualización:", e);
    handleHttpError(res, "*** Error al actualizar Usuario ***", 500, e.stack);
  }
};

// Eliminar un usuario (soft delete)
const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Verificar si el usuario existe antes de eliminar
    const user = await UsersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Realizar el soft delete (marcar como eliminado)
    const data = await UsersModel.findOneAndUpdate(
      { _id: id },
      { deletedAt: new Date() },  // Marcar como eliminado
      { new: true }
    );

    res.status(200).json({ message: "✅ Usuario eliminado correctamente (soft delete)", data });
  } catch (e) {
    console.error("❌ Error al eliminar Usuario:", e);
    handleHttpError(res, "*** Error al eliminar Usuario ***", 500, e.stack);
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
