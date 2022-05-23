const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const Adenda = function (data) {
  this.data = data
  this.errors = []
}

Adenda.checkNroUtilizado = async function ({
  nroAdenda,
  nroContrato,
  tipo,
  year
}) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from adenda where adenda_nro = ${nroAdenda} and contrato_nro = ${nroContrato} and tipo_contrato_id = ${tipo} and contrato_year = ${year}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}

Adenda.finalizarContrato = async function (licitacionID, contratoNro, estado) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `update contrato set contrato_activo = ${estado} where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )
      resolve({ msg: 'Actualizado con éxito' })
    } catch (error) {
      console.log(error)
    }
  })
}

Adenda.prototype.addAdenda = async function () {
  const {
    contrato_nro,
    contrato_year,
    tipo_contrato_id,
    nro,
    fecha_firma,
    fecha_ampliada,
    lotes,
    rubros,
    codigo,
    disminucion,
    observaciones,
    monto
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `INSERT INTO ADENDA(ADENDA_NRO,
            CONTRATO_NRO,
            CONTRATO_YEAR,
            TIPO_CONTRATO_ID,
            ADENDA_FIRMA,
            ADENDA_FECHA,   
            ADENDA_OBSERVACION)   
            VALUES (${nro}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id}, '${fecha_firma}', ${
              fecha_ampliada ? "'" + fecha_ampliada + "'" : null
            }, ${observaciones ? "'" + observaciones + "'" : null})`
          )
          if (monto) {
            if (disminucion) {
              await t.query(
                `INSERT INTO adenda_disminucion(
                  adenda_nro, contrato_nro, contrato_year, tipo_contrato_id, adenda_disminucion_monto)   
                VALUES (${nro}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id}, ${monto})`
              )

              const cs = new pgp.helpers.ColumnSet(
                [
                  'rubro_id',
                  'adenda_nro',
                  'contrato_nro',
                  'contrato_year',
                  'tipo_contrato_id',
                  'adenda_rubro_monto'
                ],
                {
                  table: 'adenda_disminucion_cc'
                }
              )

              // data input values:
              const values = rubros.map(rubro => {
                const rubroObj = {
                  adenda_nro: nro,
                  contrato_nro: contrato_nro,
                  contrato_year: contrato_year,
                  tipo_contrato_id: tipo_contrato_id,
                  rubro_id: rubro.nro,
                  adenda_rubro_monto: rubro.monto
                }
                return rubroObj
              })

              // generating a multi-row insert query:
              const query = pgp.helpers.insert(values, cs)

              // executing the query:
              await t.none(query)
            } else {
              await t.query(
                `INSERT INTO ADENDA_CC(CODIGO_CONTRATACION_ID,
                ADENDA_NRO,
                CONTRATO_NRO,
                CONTRATO_YEAR,
                TIPO_CONTRATO_ID,
                ADENDA_MONTO)
                VALUES ('${codigo}', ${nro}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id}, ${monto})`
              )
            }
          }

          if (Array.isArray(lotes)) {
            const cs = new pgp.helpers.ColumnSet(
              [
                'adenda_nro',
                'contrato_lote_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'adenda_lote_monto'
              ],
              {
                table: 'adenda_lote'
              }
            )

            // data input values:
            const values = lotes.map(lote => {
              const loteObj = {
                adenda_nro: nro,
                contrato_lote_id: lote.lote_id,
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                adenda_lote_monto: lote.monto
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

Adenda.prototype.updateAdenda = async function () {
  const {
    contrato_nro,
    contrato_year,
    tipo_contrato_id,
    nro,
    fecha_firma,
    fecha_ampliada,
    lotes,
    rubros,
    codigo,
    disminucion,
    observaciones,
    monto
  } = this.data

  const lotesEliminadosArray = this.data.lotesEliminados
    ? this.data.lotesEliminados
    : []
  const rubrosEliminadosArray = this.data.rubrosEliminados
    ? this.data.rubrosEliminados
    : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          if (disminucion) {
            await t.any(
              `UPDATE adenda_disminucion
              SET adenda_disminucion_monto=${monto} WHERE adenda_nro = ${nro} and  contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id}`
            )

            const csUpdate = new pgp.helpers.ColumnSet(
              [
                'rubro_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'adenda_rubro_monto'
              ],
              {
                table: 'adenda_disminucion_cc'
              }
            )
            // si se agregan nuevos rubros
            const csInsert = new pgp.helpers.ColumnSet(
              [
                'rubro_id',
                'adenda_nro',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'adenda_rubro_monto'
              ],
              {
                table: 'adenda_disminucion_cc'
              }
            )

            // data input values:
            let rubroObj
            const values = rubros.map(rubro => {
              rubroObj = {
                adenda_nro: nro,
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                rubro_id: rubro.nro,
                adenda_rubro_monto: rubro.monto
              }
              rubro.hasOwnProperty('newRubro')
                ? (rubroObj.newRubro = true)
                : rubroObj
              return rubroObj
            })

            const newRubros = values.filter(rubro =>
              rubro.hasOwnProperty('newRubro')
            )
            const rubrosActualizar = values.filter(
              rubro => !rubro.hasOwnProperty('newRubro')
            )

            const condition = pgp.as.format(
              ` WHERE t.adenda_nro=${nro} and t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.rubro_id=v.rubro_id`,
              rubroObj
            )

            // si se agregaron rubros nuevos se insertan en la bd
            if (newRubros.length > 0) {
              // generating a multi-row insert query:
              const queryInsert = pgp.helpers.insert(newRubros, csInsert)
              // executing the query:
              await t.none(queryInsert)
            }

            // generating a multi-row insert query:
            if (rubrosActualizar.length > 0) {
              const queryUpdate =
                pgp.helpers.update(rubrosActualizar, csUpdate) + condition
              // executing the query:
              await t.none(queryUpdate)
            }

            //si se eliminan rubros
            if (rubrosEliminadosArray.length > 0) {
              const ids = rubrosEliminadosArray.map(rubro => {
                return rubro.nro
              })
              await t.none(
                `delete from adenda_disminucion_cc where adenda_nro=${nro} and contrato_nro=${contrato_nro} and contrato_year=${contrato_year} and tipo_contrato_id=${tipo_contrato_id} and rubro_id in ($1:list)`,
                [ids]
              )
            }
          } else {
            // si es adenda de ampliacion
            await t.any(
              `UPDATE adenda_cc
              SET adenda_monto=${monto} WHERE codigo_contratacion_id ilike '%${codigo}%' and adenda_nro = ${nro} and  contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id}`
            )
          }

          if (Array.isArray(lotes)) {
            const csUpdate = new pgp.helpers.ColumnSet(
              ['contrato_lote_id', 'adenda_lote_monto'],
              {
                table: 'adenda_lote'
              }
            )

            // si se agregan nuevos lotes
            const csInsert = new pgp.helpers.ColumnSet(
              [
                'contrato_lote_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'adenda_nro',
                'adenda_lote_monto'
              ],
              {
                table: 'adenda_lote'
              }
            )

            // data input values:
            let loteObj
            const values = lotes.map(lote => {
              loteObj = {
                contrato_nro: contrato_nro,
                contrato_year: contrato_year,
                tipo_contrato_id: tipo_contrato_id,
                adenda_nro: nro,
                contrato_lote_id: lote.lote_id,
                adenda_lote_monto: lote.monto
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
              ` WHERE t.adenda_nro=${nro} and t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.contrato_lote_id=v.contrato_lote_id`,
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
            if (lotesEliminadosArray.length > 0) {
              const ids = lotesEliminadosArray.map(lote => {
                return lote.lote_id
              })
              await t.none(
                `delete from adenda_lote where adenda_nro = ${nro} and contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id} and contrato_lote_id in ($1:list)`,
                [ids]
              )
            }
          }

          let resultado = await t.query(
            `UPDATE adenda
            SET adenda_firma='${fecha_firma}', adenda_fecha=${
              fecha_ampliada ? "'" + fecha_ampliada + "'" : null
            }, adenda_observacion='${observaciones}' WHERE adenda_nro = ${nro} and  contrato_nro = ${contrato_nro} and contrato_year = ${contrato_year} and tipo_contrato_id = ${tipo_contrato_id} returning adenda_nro`
          )

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

Adenda.deleteAdenda = function ({ nroAdenda, nroContrato, year, tipo }) {
  return new Promise(async (resolve, reject) => {
    try {
      pool.task(async t => {
        await t.none(
          `delete from adenda_disminucion_cc where adenda_nro = ${nroAdenda} and  contrato_nro = ${nroContrato} and contrato_year = ${year} and tipo_contrato_id = ${tipo}`
        )
        await t.none(
          `delete from adenda_disminucion where adenda_nro = ${nroAdenda} and  contrato_nro = ${nroContrato} and contrato_year = ${year} and tipo_contrato_id = ${tipo}`
        )
        await t.none(
          `delete from adenda_lote where adenda_nro = ${nroAdenda} and  contrato_nro = ${nroContrato} and contrato_year = ${year} and tipo_contrato_id = ${tipo}`
        )
        await t.none(
          `delete from adenda_cc where adenda_nro = ${nroAdenda} and  contrato_nro = ${nroContrato} and contrato_year = ${year} and tipo_contrato_id = ${tipo}`
        )
        return await t.one(
          `delete from adenda where adenda_nro = ${nroAdenda} and  contrato_nro = ${nroContrato} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING adenda_nro`
        )
      })
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = Adenda
