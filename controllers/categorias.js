const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const { handleHttpError } = require('../utils/handleError');
const { CategoriasModel, RolModel } = require('../models');  // Asegúrate de que el modelo Categorias esté importado correctamente

// Obtener nombre del rol asociado al usuario
const getRoleName = async (idRol) => {
  try {
    const rol = await RolModel.findById(idRol);
    if (rol) {
      return rol.nombre;
    } else {
      throw new Error('Rol no encontrado');
    }
  } catch (error) {
    throw new Error('Error al obtener el nombre del rol');
  }
};

const getItems = async (req, res) => {
  try {
    const user = req.user;  // Usuario
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const idRol = user.idRol;  // El idRol del usuario
    const rolNombre = await getRoleName(idRol); // Obtener nombre del rol

    // Obtener las categorías
    const data = await CategoriasModel.find({});
    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'No hay categorías disponibles' });
    }

    // Enviar respuesta con los datos y el nombre del rol
    res.send({ data, user, rolNombre });  // Incluimos el nombre del rol en la respuesta
  } catch (error) {
    console.error("Error al consultar Categoría:", error);
    handleHttpError(res, "*** Error al consultar Categoría ***", 500);
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario

    // Verificar si el usuario tiene un rol asignado
    console.log("Usuario desde req.user:", user);  // Verificar que user esté definido
    const idRol = user ? user.idRol : null;  // Cambié la comprobación a un operador ternario para evitar errores

    if (!idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    // Obtener nombre del rol
    const rolNombre = await getRoleName(idRol);

    // Buscar categoría por ID
    const data = await CategoriasModel.findById(req.params.id);
    if (!data) return res.status(404).send({ message: 'Categoría no encontrada' });

    // Responder con los datos, incluyendo el nombre del rol
    res.send({ data, user, rolNombre });

  } catch (error) {
    console.error("Error al consultar Categoría:", error);
    handleHttpError(res, "*** Error al consultar Categoría ***", 500);
  }
};



const createItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const idRol = user.idRol;  // El idRol del usuario
    const rolNombre = await getRoleName(idRol); // Obtener nombre del rol

    const body = matchedData(req);
    console.log(body); // Verifica que el cuerpo esté llegando correctamente

    const data = await CategoriasModel.create(body); // Crea la categoría
    res.status(201).send({ message: 'Categoría creada con éxito', data, user, rolNombre });
  } catch (error) {
    console.error("Error al crear Categoría:", error);
    handleHttpError(res, "*** Error al crear Categoría ***", 500);
  }
};

const updateItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const idRol = user.idRol;  // El idRol del usuario
    const rolNombre = await getRoleName(idRol); // Obtener nombre del rol

    // Obtener ID y datos del body
    const { id } = req.params;
    const body = req.body;

    // Actualizar la categoría
    const data = await CategoriasModel.findOneAndUpdate({ _id: id }, body, { new: true });
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría actualizada con éxito", data, user, rolNombre });
  } catch (e) {
    console.error("Error al actualizar Categoría:", e);
    handleHttpError(res, "*** Error al actualizar Categoría ***", 500);
  }
};

const deleteItem = async (req, res) => {
  try {
    const user = req.user;  // Usuario
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const idRol = user.idRol;  // El idRol del usuario
    const rolNombre = await getRoleName(idRol); // Obtener nombre del rol

    // Obtener ID desde la URL
    const { id } = req.params;

    // Eliminar la categoría
    const data = await CategoriasModel.deleteOne({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría eliminada correctamente", data, user, rolNombre });
  } catch (e) {
    console.error("Error al eliminar Categoría:", e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
