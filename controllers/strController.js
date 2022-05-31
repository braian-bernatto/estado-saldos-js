const Str = require('../models/Str')
const { validationResult } = require('express-validator')

exports.apiCheckStrNro = async function (req, res) {
  try {
    let respuesta = await Str.checkNroUtilizado(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiAddStr = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let str = await new Str(req.body).addStr()
    res.json(str)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateStr = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let str = await new Str(req.body).updateStr()
    res.json(str)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteStr = async function (req, res) {
  try {
    let respuesta = await Str.deleteStr(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

function ordenarResultado(datos) {
  return datos.sort(function (a, b) {
    return a.data.contrato_nro - b.data.contrato_nro
  })
}
