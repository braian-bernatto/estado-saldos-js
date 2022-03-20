const TipoLicitacion = require('../models/TipoLicitacion')

exports.apiGetTipoLicitaciones = async function (req, res) {
  try {
    let tipoLicitaciones = await TipoLicitacion.allTipoLicitaciones()
    res.json(tipoLicitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}
