const NotaCredito = require('../models/NotaCredito')
const { validationResult } = require('express-validator')

exports.apiGetNotasCredito = async function (req, res) {
  try {
    let notas = await NotaCredito.allNotasCreditoByContrato(
      req.params.id,
      req.params.nro
    )
    res.json(notas)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckNotaCreditoNro = async function (req, res) {
  try {
    let respuesta = await NotaCredito.checkNroUtilizado(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddNotaCredito = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let notas = await new NotaCredito(req.body).addNotaCredito()
    res.json(notas)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateNotaCredito = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let notas = await new NotaCredito(req.body).updateNotaCredito()
    res.json(notas)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteNotaCredito = async function (req, res) {
  try {
    let respuesta = await NotaCredito.deleteNotaCredito(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
