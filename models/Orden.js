const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const Orden = function (data) {
  this.data = data
  this.errors = []
}

Orden.ordenesByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      // orden con lote
      let resultado = await pool.query(
        `select * from orden_lote natural join orden natural join orden_tipo natural join moneda natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by orden_year desc, contrato_lote_id desc`
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
        const resultadoOrdenado = resultadoAgrupado.map(listado =>
          listado
            .sort((a, b) =>
              a.orden_nro.localeCompare(b.orden_nro, 'en', { numeric: true })
            )
            .reverse()
        )

        // monto total emitido en ordenes
        let totalOrdenes = await pool.query(
          `select sum(orden_monto) as orden_emitido from orden natural join orden_tipo natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
        )

        let orden = new Orden(resultadoOrdenado)

        totalOrdenes.length ? '' : (totalOrdenes = 0)

        orden.totalEmitido = totalOrdenes[0].orden_emitido

        resolve(orden)
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
        `select * from orden where orden_nro ilike '${nro}' and orden_tipo_id = ${tipo} and orden_year = ${year}`
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
            VALUES ('${nro}', ${year}, ${tipo}, ${monto},'${fecha_emision}', ${
              fecha_recepcion ? "'" + fecha_recepcion + "'" : null
            }, ${observacion ? "'" + observacion + "'" : null}, ${
              estado ? "'" + estado + "'" : null
            }, ${rubro_id}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id})`
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
                'orden_lote_monto'
              ],
              {
                table: 'orden_lote'
              }
            )

            // data input values:
            const values = lotes.map(lote => {
              const loteObj = {
                orden_nro: nro,
                orden_year: year,
                orden_tipo_id: tipo,
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                contrato_lote_id: lote.lote_id,
                orden_lote_monto: lote.monto
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

Orden.prototype.updateOrden = async function () {
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
    tipo,
    observacion,
    rubro_id
  } = this.data
  const eliminadosArray = this.data.eliminados ? this.data.eliminados : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `UPDATE orden
            SET orden_monto=${monto}, orden_emision='${fecha_emision}', orden_recepcion=${
              fecha_recepcion ? "'" + fecha_recepcion + "'" : null
            }, orden_observacion=${
              observacion ? "'" + observacion + "'" : null
            }, orden_estado=${
              estado ? "'" + estado + "'" : null
            }, rubro_id=${rubro_id}
          WHERE orden_nro ilike '${nro}' and orden_year = ${year} and orden_tipo_id = ${tipo} and contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id} `
          )

          if (Array.isArray(lotes)) {
            const csUpdate = new pgp.helpers.ColumnSet(
              ['orden_lote_monto', 'contrato_lote_id'],
              {
                table: 'orden_lote'
              }
            )

            // si se agregan nuevos lotes al contrato se insertan
            const csInsert = new pgp.helpers.ColumnSet(
              [
                'orden_nro',
                'orden_year',
                'orden_tipo_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'contrato_lote_id',
                'orden_lote_monto'
              ],
              {
                table: 'orden_lote'
              }
            )

            // data input values:
            let loteObj
            const values = lotes.map(lote => {
              loteObj = {
                orden_nro: nro,
                orden_year: year,
                orden_tipo_id: tipo,
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                contrato_lote_id: lote.lote_id,
                orden_lote_monto: lote.monto
              }
              lote.hasOwnProperty('newLote')
                ? (loteObj.newLote = true)
                : loteObj
              return loteObj
            })

            const newLotes = values.filter(lote =>
              lote.hasOwnProperty('newLote')
            )
            const lotesActualizar = values.filter(
              lote => !lote.hasOwnProperty('newLote')
            )

            const condition = pgp.as.format(
              ` WHERE t.orden_nro ilike '${nro}' and t.orden_year=${year} and t.orden_tipo_id=${tipo} and t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.contrato_lote_id=v.contrato_lote_id`,
              loteObj
            )

            // si se agregaron lotes nuevos se insertan en la bd
            if (newLotes.length > 0) {
              // generating a multi-row insert query:
              const queryInsert = pgp.helpers.insert(newLotes, csInsert)
              // executing the query:
              await t.none(queryInsert)
            }

            // generating a multi-row insert query:
            if (lotesActualizar.length > 0) {
              const queryUpdate =
                pgp.helpers.update(lotesActualizar, csUpdate) + condition
              // executing the query:
              await t.none(queryUpdate)
            }

            //si se eliminan lotes del contrato
            if (eliminadosArray.length > 0) {
              const ids = eliminadosArray.map(lote => {
                return lote.lote_id
              })
              await t.none(
                `delete from orden_lote where orden_nro ilike '${nro}' and orden_year = ${year} and orden_tipo_id = ${tipo} and contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id} and contrato_lote_id in ($1:list)`,
                [ids]
              )
            }
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

Orden.deleteOrden = function ({
  nroContrato,
  contratoYear,
  contratoTipo,
  nroOrden,
  ordenYear,
  ordenTipo
}) {
  return new Promise(async (resolve, reject) => {
    try {
      pool.task(async t => {
        let lotes = await t.query(
          `delete from orden_lote where orden_nro ilike '${nroOrden}' and orden_year = ${ordenYear} and orden_tipo_id = ${ordenTipo} and contrato_nro = ${nroContrato} and contrato_year = ${contratoYear} and tipo_contrato_id = ${contratoTipo} RETURNING contrato_nro`
        )
        let result = await t.query(
          `delete from orden where orden_nro ilike '${nroOrden}' and orden_year = ${ordenYear} and orden_tipo_id = ${ordenTipo} and contrato_nro = ${nroContrato} and contrato_year = ${contratoYear} and tipo_contrato_id = ${contratoTipo} RETURNING contrato_nro`
        )
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Orden
