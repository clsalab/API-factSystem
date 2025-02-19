const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError'); // Verifica que la ruta sea correcta

const { UsersModel }  = require('../models');

const getItems = async (req, res) => {
  try {
    const data = await UsersModel.findAllData();  // Aquí usamos la función find

    console.log('Datos obtenidos:', data); // Log para verificar la respuesta

    res.send({ data });
  } catch (error) {
    console.error('Error al consultar Users:', error); // Log de error detallado
    handleHttpError(res, "*** Error al consultar Users ***", 500);
  }
};


const getItem = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('ID recibido para buscar:', id);  // Agrega este log para verificar el ID recibido

    const data = await UsersModel.findOneData(id); // Busca el usuario por ID

    if (!data) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    res.send({ data });
  } catch (error) {
    console.error('Error al consultar Usuario:', error);
    handleHttpError(res, "*** Error al consultar Usuario ***", 500);
  }
};





const createItem = async (req, res) => {
  const body = matchedData(req); // Se obtiene el cuerpo de la solicitud

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    // Validación adicional (si es necesario)
    if (!body.nombreCompleto || !body.correo || !body.clave) {
      return res.status(400).json({ error: "Faltan datos obligatorios (nombre, correo, clave)" });
    }

    // Crear el nuevo usuario en la base de datos
    const data = await UsersModel.create(body);

    // Respuesta exitosa
    res.status(201).send({
      message: "Usuario creado con éxito",
      data: data
    });
  } catch (error) {
    // Manejo de errores más detallado
    console.error("Error al crear el usuario:", error.message);
    handleHttpError(res, "*** Error al crear el usuario ***", 500);
  }
};



const updateItem = async (req, res) => {
  try {
    // Obtener ID de la URL y datos del body
    const { id } = req.params; // Tomar el ID desde la URL
    const body = req.body; // Tomar los datos a actualizar

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);



    // Actualizar la Users
    const data = await UsersModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la Users actualizado
    );

    // Verificar si la Users existe
    if (!data) {
      return res.status(404).json({ message: "Users no encontrado" });
    }

    res.status(200).json({ message: "Users actualizado con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Users ***", 500);
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await UsersModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Users no encontrado" });
    }

    res.status(200).json({ message: "✅ Users eliminada correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar Users:", e);
    handleHttpError(res, "*** Error al eliminar User ***", 500, error.stack);
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem};