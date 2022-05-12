const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const CodigoContratacion = function (data) {
  this.data = data
  this.errors = []
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

CodigoContratacion.prototype.addCodigo = async function () {
  const {
    contrato_nro,
    contrato_year,
    id,
    moneda,
    observaciones,
    rubros,
    tipo_contrato_id
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO codigo_contratacion(
            codigo_contratacion_id, codigo_contratacion_observacion, moneda_id, contrato_nro, contrato_year, tipo_contrato_id)
            VALUES ('${id}', '${observaciones}', ${moneda}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id})`
        )

        const cs = new pgp.helpers.ColumnSet(
          ['codigo_contratacion_id', 'rubro_id', 'codigo_contratacion_monto'],
          {
            table: 'codigo_rubro'
          }
        )

        // data input values:
        const values = rubros.map(rubro => {
          const rubroObj = {
            codigo_contratacion_id: id,
            rubro_id: rubro.nro,
            codigo_contratacion_monto: rubro.monto
          }
          return rubroObj
        })

        // generating a multi-row insert query:
        const query = pgp.helpers.insert(values, cs)

        // executing the query:
        await pool.none(query)

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

CodigoContratacion.prototype.updateCodigo = async function () {
  const { id, moneda, observaciones, rubros } = this.data
  const eliminadosArray = this.data.eliminados ? this.data.eliminados : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE codigo_contratacion
          SET codigo_contratacion_observacion='${observaciones}', moneda_id=${moneda} WHERE codigo_contratacion_id='${id}'`
        )

        const csUpdate = new pgp.helpers.ColumnSet(
          ['rubro_id', 'codigo_contratacion_monto'],
          {
            table: 'codigo_rubro'
          }
        )

        // si se agregan nuevos lotes al contrato se insertan
        const csInsert = new pgp.helpers.ColumnSet(
          ['codigo_contratacion_id', 'rubro_id', 'codigo_contratacion_monto'],
          {
            table: 'codigo_rubro'
          }
        )

        // data input values:
        let rubroObj
        const values = rubros.map(rubro => {
          rubroObj = {
            codigo_contratacion_id: id,
            rubro_id: rubro.nro,
            codigo_contratacion_monto: rubro.monto
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
          ` WHERE t.codigo_contratacion_id='${id}' and t.rubro_id=v.rubro_id`,
          rubroObj
        )

        // si se agregaron lotes nuevos se insertan en la bd
        if (newRubros.length > 0) {
          // generating a multi-row insert query:
          const queryInsert = pgp.helpers.insert(newRubros, csInsert)
          // executing the query:
          await pool.none(queryInsert)
        }

        // generating a multi-row insert query:
        const queryUpdate =
          pgp.helpers.update(rubrosActualizar, csUpdate) + condition
        // executing the query:
        await pool.none(queryUpdate)

        //si se eliminan lotes del contrato
        if (eliminadosArray.length > 0) {
          const ids = eliminadosArray.map(rubro => {
            return rubro.nro
          })
          await pool.none(
            `delete from codigo_rubro where codigo_contratacion_id ='${id}' and rubro_id in ($1:list)`,
            [ids]
          )
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

CodigoContratacion.deleteCodigo = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.query(
        `delete from codigo_rubro where codigo_contratacion_id = '${id}' RETURNING codigo_contratacion_id`
      )
      if (result.length) {
        result = await pool.query(
          `delete from codigo_contratacion where codigo_contratacion_id = '${id}' RETURNING codigo_contratacion_id`
        )
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = CodigoContratacion
