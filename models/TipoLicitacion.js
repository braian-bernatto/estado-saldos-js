const pool = require('../db')

const TipoLicitacion = function (data) {
  this.data = data
  this.errors = []
}

TipoLicitacion.allTipoLicitaciones = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion_tipo order by licitacion_tipo_abreviatura`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

TipoLicitacion.checkTipoLicitacion = async function ({ tipo }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion_tipo where licitacion_tipo_abreviatura ilike '${tipo}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
TipoLicitacion.prototype.addTipoLicitacion = async function () {
  const { siglas, descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO licitacion_tipo (licitacion_tipo_abreviatura, licitacion_tipo_nombre)
            VALUES ('${siglas}', '${descripcion}')`
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

TipoLicitacion.prototype.updateTipoLicitacion = async function () {
  const { id, siglas, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE licitacion_tipo 
          SET licitacion_tipo_abreviatura= '${siglas}',  licitacion_tipo_nombre='${descripcion}' WHERE licitacion_tipo_id = ${id}`
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

TipoLicitacion.deleteTipoLicitacion = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `delete from licitacion_tipo where licitacion_tipo_id = ${id}`
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = TipoLicitacion
