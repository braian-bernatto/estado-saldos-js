const Rubro = require('../models/Rubro')

exports.apiGetRubros = async function (req, res) {
  try {
    let rubros = await Rubro.allRubros()
    res.json(rubros)
  } catch (error) {
    res.status(500).send('Error')
  }
}
