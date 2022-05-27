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

Orden.prototype.addOrden = async function () {
  const {
    contrato_nro,
    contrato_year,
    tipo_contrato_id,
    fecha_emision,
    fecha_recepcion,
    estado,
    lotes,
    monto,
    nro,
    year,
    observacion,
    rubro_id,
    tipo
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `INSERT INTO orden(
              orden_nro, orden_year, orden_tipo_id, orden_monto, orden_emision, orden_recepcion, orden_observacion, orden_estado, rubro_id, contrato_nro, contrato_year, tipo_contrato_id)
            VALUES (${nro}, ${year}, ${tipo}, ${monto},'${fecha_emision}', ${
              fecha_recepcion ? "'" + fecha_recepcion + "'" : null
            }', '${observacion}', '${estado}', ${rubro_id}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id})`
          )

          if (Array.isArray(lotes)) {
            const cs = new pgp.helpers.ColumnSet(
              [
                'orden_nro',
                'orden_year',
                'orden_tipo_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'contrato_lote_id',
                'orden_monto'
              ],
              {
                table: 'orden_lote'
              }
            )

            // data input values:
            const values = lotes.map(lote => {
              const loteObj = {
                orden_nro: nro,
                orden_nro: year,
                orden_tipo_id: tipo,
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                contrato_lote_id: lote.lote_id,
                orden_monto: lote.monto
              }
              return loteObj
            })

            // generating a multi-row insert query:
            const query = pgp.helpers.insert(values, cs)

            // executing the query:
            await t.none(query)
          }
          resolve(resultado)
        })
      } catch (error) {
        this.errors.push('Please try again later...')
        console.log(error.message)
        reject(this.errors)
      }
    } else {
      reject(this.errors)
    }
  })
}

module.exports = Orden
