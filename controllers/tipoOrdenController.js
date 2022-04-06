const TipoOrden = require('../models/TipoOrden')

exports.apiGetTipoOrdenes = async function (req, res) {
  try {
    let tipoOrdenes = await TipoOrden.allTipoOrdenes()
    res.json(tipoOrdenes)
  } catch (error) {
    res.status(500).send('Error')
  }
}
