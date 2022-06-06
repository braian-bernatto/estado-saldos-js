const pool = require('../db')

const Rubro = function (data) {
  this.data = data
  this.errors = []
}

Rubro.allRubros = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from rubro order by rubro_id`)
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Rubro.checkRubro = async function ({ nro }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from rubro where rubro_id = ${nro}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Rubro.prototype.addRubro = async function () {
  const { id, nivel_id, descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO rubro (rubro_id, nivel_id, rubro_descri)
            VALUES (${id}, ${nivel_id},'${descripcion}')`
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

Rubro.prototype.updateRubro = async function () {
  const { id, nivel_id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE rubro 
          SET rubro_descri= '${descripcion}', nivel_id= ${nivel_id} WHERE rubro_id = ${id}`
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

Rubro.deleteRubro = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from rubro where rubro_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Rubro
