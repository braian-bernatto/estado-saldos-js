const Nivel = require('../models/Nivel')

exports.apiGetNiveles = async function (req, res) {
  try {
    let niveles = await Nivel.allNiveles()
    res.json(niveles)
  } catch (error) {
    res.status(500).send('Error')
  }
}
