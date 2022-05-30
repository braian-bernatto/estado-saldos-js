const Factura = require('../models/Factura')
const { validationResult } = require('express-validator')

exports.apiGetFacturas = async function (req, res) {
  try {
    let facturas = await Factura.allFacturasByContrato(
      req.params.id,
      req.params.nro
    )
    res.json(facturas)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckFacturaNro = async function (req, res) {
  try {
    let respuesta = await Factura.checkNroUtilizado(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddFactura = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let factura = await new Factura(req.body).addFactura()
    res.json(factura)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateFactura = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let factura = await new Factura(req.body).updateFactura()
    res.json(factura)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteFactura = async function (req, res) {
  try {
    let respuesta = await Factura.deleteFactura(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
