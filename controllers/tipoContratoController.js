const TipoContrato = require('../models/TipoContrato')
const { validationResult } = require('express-validator')

exports.apiGetTipoContratos = async function (req, res) {
  try {
    let tipoContratos = await TipoContrato.allTipoContratos()
    res.json(tipoContratos)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckTipoContrato = async function (req, res) {
  try {
    let respuesta = await TipoContrato.checkTipoContrato(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddTipoContrato = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoContrato(req.body).addTipoContrato()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateTipoContrato = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoContrato(req.body).updateTipoContrato()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteTipoContrato = async function (req, res) {
  try {
    let respuesta = await TipoContrato.deleteTipoContrato(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
