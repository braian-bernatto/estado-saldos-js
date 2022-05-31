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

Str.prototype.updateStr = async function () {
  const { nro, year, fecha, fechaDeposito, moneda, facturas } = this.data
  const eliminadosArray = this.data.eliminados ? this.data.eliminados : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `UPDATE str SET str_fecha='${fecha}', str_fecha_deposito=${
              fechaDeposito ? "'" + fechaDeposito + "'" : null
            }, moneda_id=${moneda} WHERE str_nro=${nro} and str_year=${year}`
          )
          if (Array.isArray(facturas)) {
            const csUpdate = new pgp.helpers.ColumnSet(['str_monto'], {
              table: 'str_detalle'
            })

            // si se agregan nuevos lotes al contrato se insertan
            const csInsert = new pgp.helpers.ColumnSet(
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
            let facturaObj
            const values = facturas.map(factura => {
              facturaObj = {
                factura_nro: factura.facturaNro,
                factura_timbrado: factura.timbrado,
                str_monto: parseFloat(factura.monto),
                str_nro: nro,
                str_year: year
              }
              factura.hasOwnProperty('newFactura')
                ? (facturaObj.newFactura = true)
                : facturaObj
              return facturaObj
            })

            const newFacturas = values.filter(factura =>
              factura.hasOwnProperty('newFactura')
            )
            const facturasActualizar = values.filter(
              factura => !factura.hasOwnProperty('newFactura')
            )

            const condition = pgp.as.format(
              ' WHERE t.str_nro=${str_nro} and t.str_year=${str_year} and t.factura_nro=${factura_nro} and t.factura_timbrado=${factura_timbrado}',
              facturaObj
            )

            // si se agregaron facturas nuevas se insertan en la bd
            if (newFacturas.length > 0) {
              // generating a multi-row insert query:
              const queryInsert = pgp.helpers.insert(newFacturas, csInsert)
              // executing the query:
              await t.none(queryInsert)
            }

            // generating a multi-row insert query:
            if (facturasActualizar.length > 0) {
              const queryUpdate =
                pgp.helpers.update(facturasActualizar, csUpdate) + condition
              // executing the query:
              await t.none(queryUpdate)
            }

            //si se eliminan facturas
            if (eliminadosArray.length > 0) {
              const ids = eliminadosArray.map(factura => {
                return {
                  factura_nro: factura.facturaNro,
                  factura_timbrado: factura.timbrado
                }
              })
              const values = pgp.helpers.values(ids, [
                'factura_nro',
                'factura_timbrado'
              ])
              await t.none(
                `delete from str_detalle where str_nro = ${nro} and str_year = ${year} and (factura_nro, factura_timbrado) in ($1:raw)`,
                [values]
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
