const pool = require('../db')

const NotaCredito = function (data) {
  this.data = data
}

NotaCredito.allNotasCreditoByContrato = async function (
  licitacionID,
  contratoNro
) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from nota_credito natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by nota_fecha desc, nota_nro desc`
      )

      if (resultado.length) {
        const years = resultado.reduce((year, item) => {
          let onlyYear = new Date(item.nota_fecha).getFullYear()
          if (!year.includes(onlyYear)) {
            year.push(onlyYear)
          }
          return year
        }, [])

        const resultadoAgrupado = []

        years.forEach(year => {
          const listado = resultado.filter(nota => {
            let onlyYear = new Date(nota.nota_fecha).getFullYear()
            if (onlyYear === year) {
              return nota
            }
          })
          resultadoAgrupado.push(listado)
        })
        resolve(resultadoAgrupado)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = NotaCredito
