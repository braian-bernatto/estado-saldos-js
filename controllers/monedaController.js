const Moneda = require('../models/Moneda')
const { validationResult } = require('express-validator')

exports.apiGetMonedas = async function (req, res) {
  try {
    let monedas = await Moneda.allMonedas()
    res.json(monedas)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckMoneda = async function (req, res) {
  try {
    let respuesta = await Moneda.checkMoneda(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddMoneda = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Moneda(req.body).addMoneda()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateMoneda = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Moneda(req.body).updateMoneda()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteMoneda = async function (req, res) {
  try {
    let respuesta = await Moneda.deleteMoneda(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
