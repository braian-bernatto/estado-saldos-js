const pool = require('../db')

const TipoOrden = function (data) {
  this.data = data
  this.errors = []
}

TipoOrden.allTipoOrdenes = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from orden_tipo order by orden_tipo_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

TipoOrden.checkTipoOrden = async function ({ tipo }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from orden_tipo where orden_tipo_descri ilike '${tipo}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
TipoOrden.prototype.addTipoOrden = async function () {
  const { descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO orden_tipo (orden_tipo_descri)
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

TipoOrden.prototype.updateTipoOrden = async function () {
  const { id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE orden_tipo 
          SET orden_tipo_descri= '${descripcion}' WHERE orden_tipo_id = ${id}`
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

TipoOrden.deleteTipoOrden = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from orden_tipo where orden_tipo_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = TipoOrden
