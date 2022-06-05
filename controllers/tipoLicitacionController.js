const TipoLicitacion = require('../models/TipoLicitacion')
const { validationResult } = require('express-validator')

exports.apiGetTipoLicitaciones = async function (req, res) {
  try {
    let tipoLicitaciones = await TipoLicitacion.allTipoLicitaciones()
    res.json(tipoLicitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckTipoLicitacion = async function (req, res) {
  try {
    let respuesta = await TipoLicitacion.checkTipoLicitacion(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddTipoLicitacion = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoLicitacion(req.body).addTipoLicitacion()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateTipoLicitacion = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new TipoLicitacion(req.body).updateTipoLicitacion()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteTipoLicitacion = async function (req, res) {
  try {
    let respuesta = await TipoLicitacion.deleteTipoLicitacion(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
