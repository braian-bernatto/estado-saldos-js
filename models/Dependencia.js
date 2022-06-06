const pool = require('../db')

const Dependencia = function (data) {
  this.data = data
  this.errors = []
}

Dependencia.allDependencias = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from dependencia order by dependencia_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Dependencia.checkDependencia = async function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from dependencia where dependencia_id ilike '${id}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Dependencia.prototype.addDependencia = async function () {
  const { id, descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO dependencia (dependencia_id, dependencia_descri)
            VALUES ('${id}','${descripcion}')`
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

Dependencia.prototype.updateDependencia = async function () {
  const { id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE dependencia 
          SET dependencia_descri= '${descripcion}' WHERE dependencia_id = '${id}'`
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

Dependencia.deleteDependencia = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from dependencia where dependencia_id = '${id}'`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Dependencia
