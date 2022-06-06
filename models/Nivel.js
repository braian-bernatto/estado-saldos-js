const pool = require('../db')

const Nivel = function (data) {
  this.data = data
  this.errors = []
}

Nivel.allNiveles = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from nivel order by nivel_id`)
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Nivel.checkNivel = async function ({ nro }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from nivel where nivel_id = ${nro}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Nivel.prototype.addNivel = async function () {
  const { id, descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO nivel (nivel_id, nivel_descri)
            VALUES (${id},'${descripcion}')`
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

Nivel.prototype.updateNivel = async function () {
  const { id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE nivel 
          SET nivel_descri= '${descripcion}' WHERE nivel_id = ${id}`
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

Nivel.deleteNivel = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from nivel where nivel_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Nivel
