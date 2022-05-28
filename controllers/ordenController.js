const Orden = require('../models/Orden')

exports.apiGetOrdenes = async function (req, res) {
  try {
    let ordenes = await Orden.ordenesByContrato(req.params.id, req.params.nro)
    res.json(ordenes)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiCheckOrdenNro = async function (req, res) {
  try {
    let respuesta = await Orden.checkOrdenUtilizado(
      req.params.nro,
      req.params.tipo,
      req.params.year
    )
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiGetOrdenesEnlaces = async function (req, res) {
  try {
    let ordenes = await Orden.ordenesEnlaces()
    res.json(ordenes)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddOrden = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let orden = await new Orden(req.body).addOrden()
    res.json(orden)
  } catch (error) {
    res.status(500).send('Error')
  }
}
