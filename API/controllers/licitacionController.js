const Licitacion = require('../models/Licitacion')


exports.apiGetLicitaciones = async function (req, res) {
  try {
    const licitaciones = await Licitacion.allLicitaciones()
    res.json(licitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacion = async function (req, res) {
  try {
    const licitacion = await Licitacion.LicitacionByID(req.params.id)
    res.json(licitacion)
  } catch (error) {
    res.status(500).send('Error')
  }
}