const pool = require('../db')

const Orden = function (data) {
  this.data = data
}

Orden.ordenesByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      // orden con lote
      let resultado = await pool.query(
        `select * from orden_lote natural join orden_tipo natural join moneda natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by orden_year desc`
      )

      // orden sin lote
      if (!resultado.length) {
        resultado =
          await pool.query(`select * from orden natural join orden_tipo natural join moneda natural join contrato 
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
          listado
            .sort((a, b) =>
              a.orden_nro.localeCompare(b.orden_nro, 'en', { numeric: true })
            )
            .reverse()
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

Orden.checkOrdenUtilizado = async function (nro, tipo, year) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from orden where orden_nro ilike '%${nro}%' and orden_tipo_id = ${tipo} and orden_year = ${year}`
      )
      resultado.length ? resolve(false) : resolve(true)
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
