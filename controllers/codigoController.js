const CodigoContratacion = require('../models/CodigoContratacion')
const { validationResult } = require('express-validator')

exports.apiGetCodigos = async function (req, res) {
  try {
    let codigos = await CodigoContratacion.allCodigoContratacion()
    res.json(codigos)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetCodigoById = async function (req, res) {
  try {
    let codigos = await CodigoContratacion.codigoContratacionById(req.params)
    res.json(codigos)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiAddCodigo = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let codigo = await new CodigoContratacion(req.body).addCodigo()
    res.json(codigo)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateCodigo = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let codigo = await new CodigoContratacion(req.body).updateCodigo()
    res.json(codigo)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteCodigo = async function (req, res) {
  try {
    let respuesta = await CodigoContratacion.deleteCodigo(req.params.id)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
