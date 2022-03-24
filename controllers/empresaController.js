const Empresa = require('../models/Empresa')

exports.apiGetEmpresas = async function (req, res) {
  try {
    let empresas = await Empresa.allEmpresas()
    res.json(empresas)
  } catch (error) {
    res.status(500).send('Error')
  }
}
