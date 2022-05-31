const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const Str = function (data) {
  this.data = data
  this.errors = []
}

Str.checkNroUtilizado = async function ({ nro, year }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from str where str_nro = ${nro} and str_year = ${year}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}

Str.prototype.addStr = async function () {
  const { nro, year, fecha, fechaDeposito, moneda, facturas } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `INSERT INTO str(str_nro, str_year, str_fecha, str_fecha_deposito, moneda_id)    
            VALUES (${nro}, ${year}, '${fecha}', ${
              fechaDeposito ? "'" + fechaDeposito + "'" : null
            }, ${moneda})`
          )
          if (Array.isArray(facturas)) {
            const cs = new pgp.helpers.ColumnSet(
              [
                'factura_nro',
                'factura_timbrado',
                'str_monto',
                'str_nro',
                'str_year'
              ],
              {
                table: 'str_detalle'
              }
            )

            // data input values:
            const values = facturas.map(factura => {
              console.log(factura)
              const facturaObj = {
                factura_nro: factura.facturaNro,
                factura_timbrado: factura.timbrado,
                str_monto: parseFloat(factura.monto),
                str_nro: nro,
                str_year: year
              }
              return facturaObj
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

Str.prototype.updateContrato = async function () {
  const {
    licitacion_id,
    activo,
    cumplimiento,
    nro,
    tipo,
    year,
    moneda,
    empresa,
    fecha_firma,
    fecha_vencimiento,
    lotes,
    monto_minimo,
    monto_maximo
  } = this.data
  const eliminadosArray = this.data.eliminados ? this.data.eliminados : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `UPDATE contrato
          SET contrato_firma='${fecha_firma}', contrato_vencimiento='${
              cumplimiento ? 'CUMPLIMIENTO' : fecha_vencimiento
            }', licitacion_id=${licitacion_id}, empresa_id=${empresa}, moneda_id=${moneda}, contrato_activo=${activo}, tipo_contrato_id=${tipo}
          WHERE contrato_nro=${nro} and contrato_year=${year} and tipo_contrato_id=${tipo}`
          )
          if (lotes === false) {
            await t.query(
              `UPDATE contrato_detalle
            SET contrato_minimo=${
              monto_minimo ? monto_minimo : null
            }, contrato_maximo=${monto_maximo}
            WHERE contrato_nro=${nro} and contrato_year=${year} and tipo_contrato_id=${tipo}`
            )
          }
          if (Array.isArray(lotes)) {
            const csUpdate = new pgp.helpers.ColumnSet(
              ['contrato_lote_id', 'lote_descri', 'lote_minimo', 'lote_maximo'],
              {
                table: 'contrato_lote'
              }
            )

            // si se agregan nuevos lotes al contrato se insertan
            const csInsert = new pgp.helpers.ColumnSet(
              [
                'contrato_lote_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'lote_descri',
                'lote_minimo',
                'lote_maximo'
              ],
              {
                table: 'contrato_lote'
              }
            )

            // data input values:
            let facturaObj
            const values = lotes.map(lote => {
              facturaObj = {
                contrato_nro: nro,
                contrato_year: year,
                tipo_contrato_id: tipo,
                contrato_lote_id: lote.nro,
                lote_descri: lote.nombre,
                lote_minimo: lote.minimo,
                lote_maximo: lote.maximo
              }
              lote.hasOwnProperty('newLote')
                ? (facturaObj.newLote = true)
                : facturaObj
              return facturaObj
            })

            const newLotes = values.filter(lote =>
              lote.hasOwnProperty('newLote')
            )
            const lotesActualizar = values.filter(
              lote => !lote.hasOwnProperty('newLote')
            )

            const condition = pgp.as.format(
              ' WHERE t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.contrato_lote_id=v.contrato_lote_id',
              facturaObj
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
                return lote.nro
              })
              await t.none(
                `delete from contrato_lote where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} and contrato_lote_id in ($1:list)`,
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

Str.deleteStr = function ({ nro, year }) {
  return new Promise(async (resolve, reject) => {
    try {
      pool.task(async t => {
        let result = await t.query(
          `delete from str_detalle where str_nro = ${nro} and str_year = ${year} RETURNING str_nro`
        )
        if (result.length) {
          result = await t.query(
            `delete from str where str_nro = ${nro} and str_year = ${year} RETURNING str_nro`
          )
        }
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Str
