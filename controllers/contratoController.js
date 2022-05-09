const Contrato = require('../models/Contrato')
const { validationResult } = require('express-validator')

exports.apiGetContratos = async function (req, res) {
  try {
    let contratos = await Contrato.allContratos(req.params.id)
    let contratosOrdenado = ordenarResultado(contratos)
    res.json(contratosOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetContratosEnlaces = async function (req, res) {
  try {
    let contratos = await Contrato.allContratosEnlaces(req.params.id)
    res.json(contratos)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetContrato = async function (req, res) {
  try {
    let contrato = await Contrato.contratoByNro(req.params.id, req.params.nro)
    res.json(contrato)
  } catch (error) {}
}

exports.apiGetContratoByEstado = async function (req, res) {
  try {
    let contratos = await Contrato.contratosByEstado(
      req.params.id,
      req.params.estado
    )
    let contratosOrdenado = ordenarResultado(contratos)
    res.json(contratosOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetContratosBySearch = async function (req, res) {
  try {
    let contratos = await Contrato.contratosBySearch(
      req.params.id,
      req.params.input
    )
    let contratosOrdenado = ordenarResultado(contratos)
    res.json(contratosOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetContratoResumen = async function (req, res) {
  try {
    let contrato = await Contrato.contratoResumen(req.params.id, req.params.nro)
    res.json(contrato)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiFinalizarContrato = async function (req, res) {
  try {
    let respuesta = await Contrato.finalizarContrato(
      req.params.id,
      req.params.nro,
      req.params.estado
    )
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiAddContrato = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let contrato = await new Contrato(req.body).addContrato()
    res.json(contrato)
  } catch (error) {
    res.status(500).send('Error')
  }
}

function ordenarResultado(datos) {
  return datos.sort(function (a, b) {
    return a.data.contrato_nro - b.data.contrato_nro
  })
}
