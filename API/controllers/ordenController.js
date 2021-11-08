const Orden = require('../models/Orden')

exports.apiGetOrdenes = async function (req, res) {
  try {
    let ordenes = await Orden.ordenesByContrato(req.params.id, req.params.nro)
    res.json(ordenes)
  } catch (error) {
    res.status(500).send('Error')
  }
}