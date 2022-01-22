const pool = require('../db')

const Orden = function (data) {
  this.data = data
}

Orden.ordenesByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      // orden con lote
      let resultado = await pool.query(
        `select orden_year, orden_nro, orden_monto, lote_descri, orden_tipo_descri from orden_lote natural join orden_tipo natural join moneda natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by orden_year desc`
      )

      // orden sin lote
      if (!resultado.length) {
        resultado =
          await pool.query(`select orden_year, orden_nro, orden_monto, orden_tipo_descri from orden natural join orden_tipo natural join moneda natural join contrato 
        where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by orden_year desc`)
      }

      if (resultado.length) {
        const years = resultado.reduce((year, item) => {
          if (!year.includes(item.orden_year)) {
            year.push(item.orden_year)
          }
          return year
        }, [])

        // agrupar por años
        const resultadoAgrupado = []

        years.forEach(year => {
          const listado = resultado.filter(
            orden => orden.orden_year === parseInt(year)
          )
          resultadoAgrupado.push(listado)
        })

        // ordenar por numero de orden
        const resutlatoOrdenado = resultadoAgrupado.map(listado =>
          listado.sort(function comparar(a, b) {
            return a.orden_nro - b.orden_nro
          })
        )
        resolve(resutlatoOrdenado)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}
Orden.ordenesEnlaces = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      // orden con lote
      let resultado = await pool.query(
        `select distinct(orden_nro) from orden order by 1`
      )

      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Orden
