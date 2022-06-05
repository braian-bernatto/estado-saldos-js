const pool = require('../db')

const TipoContrato = function (data) {
  this.data = data
  this.errors = []
}

TipoContrato.allTipoContratos = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from tipo_contrato order by tipo_contrato_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

TipoContrato.checkTipoContrato = async function ({ tipo }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from tipo_contrato where tipo_contrato_descri ilike '${tipo}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
TipoContrato.prototype.addTipoContrato = async function () {
  const { descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO tipo_contrato (tipo_contrato_descri)
            VALUES ('${descripcion}')`
        )
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

TipoContrato.prototype.updateTipoContrato = async function () {
  const { id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE tipo_contrato 
          SET tipo_contrato_descri= '${descripcion}' WHERE tipo_contrato_id = ${id}`
        )
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

TipoContrato.deleteTipoContrato = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `delete from tipo_contrato where tipo_contrato_id = ${id}`
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = TipoContrato
