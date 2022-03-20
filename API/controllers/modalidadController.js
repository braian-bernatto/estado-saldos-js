const Modalidad = require('../models/Modalidad')

exports.apiGetModalidades = async function (req, res) {
  try {
    let modalidades = await Modalidad.allModalidades()
    res.json(modalidades)
  } catch (error) {
    res.status(500).send('Error')
  }
}
