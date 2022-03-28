const pool = require('../db')

const CodigoContratacion = function (data) {
  this.data = data
}

CodigoContratacion.allCodigoContratacion = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from codigo_contratacion natural join codigo_rubro order by 1`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

CodigoContratacion.codigoContratacionById = async function ({
  contrato,
  year,
  tipoContrato
}) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from codigo_contratacion natural join codigo_rubro natural join moneda where contrato_nro = ${contrato} and contrato_year = ${year} and tipo_contrato_id = ${tipoContrato} order by 1 desc, rubro_id asc`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = CodigoContratacion
