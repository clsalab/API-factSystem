const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { VentasModel } = require('../models');

const getItems = async (req, res) => {
  try {
    const user = req.user;  // Obtener el usuario de req.user
    const data = await VentasModel.find({});  // Aquí usamos la función find para obtener todas las ventas

    res.send({ data, user });  // Enviar los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Ventas ***");
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;  // Obtener el usuario de req.user
    const data = await VentasModel.findById(req.params.id); // Busca la venta por ID

    if (!data) {
      return res.status(404).send({ message: 'Venta no encontrada' });
    }

    res.send({ data, user });  // Enviar los datos junto con el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Ventas ***");
  }
};

const createItem = async (req, res) => {
  const body = matchedData(req);  // Extraer los datos validados del cuerpo

  console.log(body);  // Verifica que el cuerpo esté llegando correctamente

  try {
    const user = req.user;  // Obtener el usuario de req.user
    // Asegurarse de que el usuario tiene un rol (opcional, puedes ajustar esto según tu lógica)
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    // Crear la venta en la base de datos
    const data = await VentasModel.create({
      ...body,
      userId: user._id,  // Asociar la venta con el usuario autenticado
    });

    res.status(201).send({ message: 'Venta creada con éxito', data, user });  // Responder con los datos y el usuario
  } catch (error) {
    handleHttpError(res, "*** Error al crear la venta ***");
  }
};

const updateItem = async (req, res) => {
  try {
    const user = req.user;  // Obtener el usuario de req.user
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const { id } = req.params;  // Obtener el ID desde la URL
    const body = req.body;  // Obtener los datos a actualizar

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);

    // Actualizar la venta
    const data = await VentasModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true }  // Retorna la venta actualizada
    );

    // Verificar si la venta existe
    if (!data) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.status(200).json({ message: "Venta actualizada con éxito", data, user });  // Responder con los datos y el usuario
  } catch (e) {
    console.error("❌ Error en la actualización:", e);
    handleHttpError(res, "*** Error al actualizar Ventas ***");
  }
};

const deleteItem = async (req, res) => {
  try {
    const user = req.user;  // Obtener el usuario de req.user
    if (!user || !user.idRol) {
      return res.status(400).send({ message: 'El usuario no tiene un rol asignado' });
    }

    const { id } = req.params;  // Obtener el ID desde la URL
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar la venta a eliminar
    const data = await VentasModel.findOne({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Realizar un soft delete usando el método proporcionado por mongoose-delete
    await data.delete();  // Esto marcará el documento como eliminado (soft delete)

    res.status(200).json({ message: "Venta eliminada correctamente (soft delete)", data, user });  // Responder con los datos y el usuario
  } catch (e) {
    console.error("❌ Error al eliminar Venta:", e);
    res.status(500).json({ error: e.message });
  }
};


module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
