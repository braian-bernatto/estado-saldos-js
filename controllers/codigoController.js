const CodigoContratacion = require('../models/CodigoContratacion')

exports.apiGetCodigos = async function (req, res) {
  try {
    let codigos = await CodigoContratacion.allCodigoContratacion()
    res.json(codigos)
  } catch (error) {
    res.status(500).send('Error')
  }
}
exports.apiGetCodigoById = async function (req, res) {
  try {
    let codigos = await CodigoContratacion.codigoContratacionById(req.params)
    res.json(codigos)
  } catch (error) {
    res.status(500).send('Error')
  }
}
