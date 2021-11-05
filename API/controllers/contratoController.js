const Contrato = require('../models/Contrato')

exports.apiGetContratos = async function (req, res) {
  try {
    let contratos = await Contrato.allContratos(req.params.id)
    let contratosOrdenado = ordenarResultado(contratos)

    res.json(contratosOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

function ordenarResultado(datos) {  
  return datos.sort(function(a, b){
    return a.data.contrato_nro - b.data.contrato_nro
  })
}
