const Licitacion = require('../models/Licitacion')


exports.apiGetLicitaciones = async function (req, res) {
  try {
    let licitaciones = await Licitacion.allLicitaciones()
    res.json(licitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionByID = async function (req, res) {
  try {
    let licitacion = await Licitacion.licitacionByID(req.params.id)
    res.json(licitacion)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionesByEstado = async function (req, res) {
  try {
    let licitacionEstado = await Licitacion.licitacionesByEstado(req.params.estado)
    res.json(licitacionEstado)
  } catch (error) {
    res.status(500).send('Error')
  }
}