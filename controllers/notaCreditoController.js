const NotaCredito = require('../models/NotaCredito')

exports.apiGetNotasCredito = async function (req, res) {
  try {
    let notas = await NotaCredito.allNotasCreditoByContrato(
      req.params.id,
      req.params.nro
    )
    res.json(notas)
  } catch (error) {
    res.status(500).send('Error')
  }
}
