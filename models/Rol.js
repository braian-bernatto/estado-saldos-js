const pool = require('../db')

const Rol = function (data) {
  this.data = data
  this.errors = []
}

Rol.allRoles = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from rol order by rol_id`)
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Rol.checkRol = async function ({ nro }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from rol where rol_nombre ilike '${nro}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Rol.prototype.addRol = async function () {
  const { descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO rol (rol_nombre)
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

Rol.prototype.updateRol = async function () {
  const { id, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE rol 
          SET rol_nombre= '${descripcion}' WHERE rol_id = ${id}`
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

Rol.deleteRol = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from rol where rol_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Rol
