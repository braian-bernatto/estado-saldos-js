const Factura = require("../models/Factura")

exports.apiGetFacturas = async function (req, res) {
  try {
    let facturas = await Factura.allFacturasByContrato(req.params.id, req.params.nro)
    res.json(facturas)
  } catch (error) {
    res.status(500).send('Error')
  }
}