const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const Adenda = function (data) {
  this.data = data
  this.errors = []
}

Adenda.checkNroUtilizado = async function (nroAdenda, nroContrato, tipo, year) {
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
        let resultado = await pool.query(
          `INSERT INTO ADENDA(ADENDA_NRO,
            CONTRATO_NRO,
            CONTRATO_YEAR,
            TIPO_CONTRATO_ID,
            ADENDA_FIRMA,
            ADENDA_FECHA,   
            ADENDA_OBSERVACION)   
            VALUES (${nro}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id}, '${fecha_firma}', ${
            fecha_ampliada ? "'" + fecha_ampliada + "'" : null
          }, '${observaciones ? "'" + observaciones + "'" : null}')`
        )
        if (monto) {
          if (disminucion) {
            const cs = new pgp.helpers.ColumnSet(
              [
                'adenda_nro',
                'rubro_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'adenda_disminucion_monto'
              ],
              {
                table: 'adenda_disminucion'
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
                adenda_disminucion_monto: rubro.monto
              }
              return rubroObj
            })

            // generating a multi-row insert query:
            const query = pgp.helpers.insert(values, cs)

            // executing the query:
            await pool.none(query)
          } else {
            await pool.query(
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
          await pool.none(query)
        }
        resolve(resultado)
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

Adenda.prototype.updateContrato = async function () {
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
        let resultado = await pool.query(
          `UPDATE contrato
          SET contrato_firma='${fecha_firma}', contrato_vencimiento='${
            cumplimiento ? 'CUMPLIMIENTO' : fecha_vencimiento
          }', licitacion_id=${licitacion_id}, empresa_id=${empresa}, moneda_id=${moneda}, contrato_activo=${activo}, tipo_contrato_id=${tipo}
          WHERE contrato_nro=${nro} and contrato_year=${year} and tipo_contrato_id=${tipo}    `
        )
        if (lotes === false) {
          await pool.query(
            `UPDATE contrato_detalle
            SET contrato_minimo=${monto_minimo}, contrato_maximo=${monto_maximo}
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
          let loteObj
          const values = lotes.map(lote => {
            loteObj = {
              contrato_nro: nro,
              contrato_year: year,
              tipo_contrato_id: tipo,
              contrato_lote_id: lote.nro,
              lote_descri: lote.nombre,
              lote_minimo: lote.minimo,
              lote_maximo: lote.maximo
            }
            lote.hasOwnProperty('newLote') ? (loteObj.newLote = true) : loteObj
            return loteObj
          })

          const newLotes = values.filter(lote => lote.hasOwnProperty('newLote'))
          const lotesActualizar = values.filter(
            lote => !lote.hasOwnProperty('newLote')
          )

          const condition = pgp.as.format(
            ' WHERE t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.contrato_lote_id=v.contrato_lote_id',
            loteObj
          )

          // si se agregaron lotes nuevos se insertan en la bd
          if (newLotes.length > 0) {
            // generating a multi-row insert query:
            const queryInsert = pgp.helpers.insert(newLotes, csInsert)
            // executing the query:
            await pool.none(queryInsert)
          }

          // generating a multi-row insert query:
          const queryUpdate =
            pgp.helpers.update(lotesActualizar, csUpdate) + condition
          // executing the query:
          await pool.none(queryUpdate)

          //si se eliminan lotes del contrato
          if (eliminadosArray.length > 0) {
            const ids = eliminadosArray.map(lote => {
              return lote.nro
            })
            await pool.none(
              `delete from contrato_lote where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} and contrato_lote_id in ($1:list)`,
              [ids]
            )
          }
        }
        resolve(resultado)
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

Adenda.deleteContrato = function (nro, year, tipo) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.query(
        `delete from contrato_detalle where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
      )
      if (!result.length) {
        result = await pool.query(
          `delete from contrato_lote where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
        )
      }
      if (result.length) {
        result = await pool.query(
          `delete from contrato where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
        )
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Adenda
