
const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const { UsersModel } = require('../models');
const handleHttpError = require('../utils/handleError');
const { tokenSign } = require('../utils/handleJwt');
const { compare } = require('bcrypt');

const getItems = async (req, res) => {
  try {

    const data = await UsersModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Categoria ***");
  }
};

const login = async (req, res) => {
  try {
    req = matchedData(req); // Filtra los datos correctamente
    const user = await UsersModel.findOne({ correo: req.correo }).select('+clave'); // Incluye explícitamente 'clave'

    if (!user) return res.status(404).send({ message: 'Usuario no existe' });

    const hashedPassword = user.clave;

    // Compara la contraseña proporcionada con la almacenada
    const check = await compare(req.clave, hashedPassword);

    if (!check) return res.status(401).send({ message: 'Contraseña incorrecta' });

    // Generar el token, esperando la resolución de la promesa
    const token = await tokenSign(user);
    user.set('clave', undefined, {strict: true});
    const data = {
      token: token,
      user: user
    };

    res.status(200).json({ message: "Sesión iniciada con éxito", data });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    handleHttpError(res, "*** Error al iniciar sesión ***");
  }
};



const registerUser = async (req, res) => {
  try {
    const cleanData = matchedData(req); // Filtra los datos correctamente
    const existingUser = await UsersModel.findOne({ correo: cleanData.correo });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const dataUser = await UsersModel.create(cleanData); // Crea el usuario (la contraseña se encripta automáticamente)
    dataUser.set('clave', undefined, {strict:false}); //


    const data = {
      token: await tokenSign(dataUser),
      user: dataUser
    }
    res.status(201).json({ message: "Usuario registrado con éxito", data });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    handleHttpError(res, "*** Error al registrar usuario ***");
  }
};




const updateItem = async (req, res) => {
  try {
    // Obtener ID de la URL y datos del body
    const { id } = req.params; // Tomar el ID desde la URL
    const body = req.body; // Tomar los datos a actualizar

    console.log("📌 ID recibido:", id);
    console.log("📌 Datos a actualizar:", body);



    // Actualizar la categoría
    const data = await UsersModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la categoría actualizada
    );

    // Verificar si la categoría existe
    if (!data) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría actualizada con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Categoría ***");
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
      return res.status(404).json({ message: "❌ Categoría no encontrada" });
    }

    res.status(200).json({ message: "✅ Categoría eliminada correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar categoría:", e);
    res.status(500).json({ error: e.message });
  }
};




module.exports = { getItems, registerUser, login , updateItem, deleteItem};