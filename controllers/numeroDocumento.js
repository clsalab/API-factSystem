const mongoose = require('mongoose');
const { matchedData } = require('express-validator');
const handleHttpError = require('../utils/handleError');
const { NumeroDocumentoModel }  = require('../models');

const getItems = async (req, res) => {
  try {

    const data = await NumeroDocumentoModel.find({});  // Aquí usamos la función find
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Numero Documento ***");
  }
};

const getItem = async (req, res) => {

  try {

    const data = await NumeroDocumentoModel.findById(req.params.id); // Busca la Numero Documento por ID
    if (!data) return res.status(404).send({ message: 'Numero Documento no encontrado' });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, "*** Error al consultar Numero Documento ***");
  }

};


const createItem = async (req, res) => {

  const body = matchedData(req)

  console.log(body); // Verifica que el cuerpo esté llegando correctamente

  try {
    const data = await NumeroDocumentoModel.create(body); // Crea la Numero Documento en la base de datos
    res.status(201).send({ message: 'Numero Documento creado con éxito', data: data });
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



    // Actualizar la Numero Documento
    const data = await NumeroDocumentoModel.findOneAndUpdate(
      { _id: id },  // Buscar por ID
      body,
      { new: true } // Retorna la Numero Documento actualizada
    );

    // Verificar si la Numero Documento existe
    if (!data) {
      return res.status(404).json({ message: "Numero Documento no encontrado" });
    }

    res.status(200).json({ message: "Numero Documento actualizado con éxito", data });

  } catch (e) {
    console.error("❌ Error en la actualización:", e);

    handleHttpError(res, "*** Error al actualizar Numero Documento ***");
  }
};




const deleteItem = async (req, res) => {
  try {
    // Obtener el ID desde la URL
    const { id } = req.params;
    console.log("📌 ID recibido para eliminar:", id);

    // Buscar y marcar como eliminado (soft delete)
    const data = await NumeroDocumentoModel.delete({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "❌ Numero Documento no encontrado" });
    }

    res.status(200).json({ message: "✅ Numero Documento eliminada correctamente (soft delete)", data });

  } catch (e) {
    console.error("❌ Error al eliminar Numero Documento:", e);
    res.status(500).json({ error: e.message });
  }
};

const incrementarNumero = async (req, res) => {
  try {
    const documento = await NumeroDocumentoModel.findOne();
    if (documento) {
      // Si existe el documento, incrementar el número
      documento.ultimoNumero += 1;
      await documento.save();
      res.status(200).json({ message: 'Número incrementado correctamente', data: documento });
    } else {
      // Si no existe, crear un nuevo documento
      const nuevoDocumento = new NumeroDocumentoModel({ ultimoNumero: 1 });
      await nuevoDocumento.save();
      res.status(201).json({ message: 'Nuevo número creado', data: nuevoDocumento });
    }
  } catch (error) {
    console.error('Error al incrementar el número:', error);
    res.status(500).json({ message: 'Error al incrementar el número', error });
  }
};

// Función para eliminar un número (soft delete)
const eliminarNumeroDocumento = async (req, res) => {
  try {
    const { id } = req.params;  // Suponiendo que pasas el ID como parámetro en la URL
    const documento = await NumeroDocumentoModel.findById(id);
    if (documento) {
      await documento.delete(); // Marca el documento como eliminado
      res.status(200).json({ message: 'Número eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Documento no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el número:', error);
    res.status(500).json({ message: 'Error al eliminar el número', error });
  }
};

// Función para restaurar un número eliminado
const restaurarNumeroDocumento = async (req, res) => {
  try {
    const { id } = req.params; // El ID del documento que quieres restaurar
    const documentoEliminado = await NumeroDocumentoModel.restore({ _id: id });
    if (documentoEliminado) {
      res.status(200).json({ message: 'Número restaurado correctamente' });
    } else {
      res.status(404).json({ message: 'Documento no encontrado o no eliminado' });
    }
  } catch (error) {
    console.error('Error al restaurar el número:', error);
    res.status(500).json({ message: 'Error al restaurar el número', error });
  }
};




module.exports = { getItems, getItem, createItem, updateItem, deleteItem,
  incrementarNumero,
  eliminarNumeroDocumento,
  restaurarNumeroDocumento,
};