const Moneda = require('../models/Moneda')

exports.apiGetMonedas = async function (req, res) {
  try {
    let monedas = await Moneda.allMonedas()
    res.json(monedas)
  } catch (error) {
    res.status(500).send('Error')
  }
}
