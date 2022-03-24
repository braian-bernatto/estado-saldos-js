const pool = require('../db')

const TipoContrato = function (data) {
  this.data = data
}

TipoContrato.allTipoContratos = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from tipo_contrato order by tipo_contrato_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = TipoContrato
