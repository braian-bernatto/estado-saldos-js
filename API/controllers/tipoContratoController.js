const TipoContrato = require('../models/TipoContrato')

exports.apiGetTipoContratos = async function (req, res) {
  try {
    let tipoContratos = await TipoContrato.allTipoContratos()
    res.json(tipoContratos)
  } catch (error) {
    res.status(500).send('Error')
  }
}
