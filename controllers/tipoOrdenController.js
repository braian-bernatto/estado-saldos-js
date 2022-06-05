const TipoOrden = require('../models/TipoOrden')
const { validationResult } = require('express-validator')

exports.apiGetTipoOrdenes = async function (req, res) {
  try {
    let tipoOrdenes = await TipoOrden.allTipoOrdenes()
    res.json(tipoOrdenes)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckTipoOrden = async function (req, res) {
  try {
    let respuesta = await TipoOrden.checkTipoOrden(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddTipoOrden = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoOrden(req.body).addTipoOrden()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateTipoOrden = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoOrden(req.body).updateTipoOrden()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteTipoOrden = async function (req, res) {
  try {
    let respuesta = await TipoOrden.deleteTipoOrden(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
