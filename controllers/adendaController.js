const Adenda = require('../models/Adenda')
const { validationResult } = require('express-validator')

exports.apiCheckAdendaNro = async function (req, res) {
  try {
    let respuesta = await Adenda.checkNroUtilizado(
      req.params.nroAdenda,
      req.params.nroContrato,
      req.params.tipo,
      req.params.year
    )
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

exports.apiUpdateContrato = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let contrato = await new Contrato(req.body).updateContrato()
    res.json(contrato)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteContrato = async function (req, res) {
  try {
    let respuesta = await Contrato.deleteContrato(
      req.params.nro,
      req.params.year,
      req.params.tipo
    )
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
