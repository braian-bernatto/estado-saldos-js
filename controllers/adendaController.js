const Adenda = require('../models/Adenda')
const { validationResult } = require('express-validator')

exports.apiCheckAdendaNro = async function (req, res) {
  try {
    let respuesta = await Adenda.checkNroUtilizado(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddAdenda = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let adenda = await new Adenda(req.body).addAdenda()
    res.json(adenda)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateAdenda = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let adenda = await new Adenda(req.body).updateAdenda()
    res.json(adenda)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteAdenda = async function (req, res) {
  try {
    let respuesta = await Adenda.deleteAdenda(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
