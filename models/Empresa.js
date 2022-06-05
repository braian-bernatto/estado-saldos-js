const pool = require('../db')

const Empresa = function (data) {
  this.data = data
  this.errors = []
}

Empresa.allEmpresas = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from empresa order by empresa_nombre_fantasia`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Empresa.checkRuc = async function ({ ruc }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from empresa where empresa_ruc ilike '${ruc}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Empresa.prototype.addEmpresa = async function () {
  const { ruc, nombre_fantasia, representante, telefono, direccion, email } =
    this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO empresa(
            empresa_ruc, empresa_nombre_fantasia, empresa_representante, empresa_telef, empresa_dir, empresa_correo)
            VALUES ('${ruc}', '${nombre_fantasia}', ${
            representante ? "'" + representante + "'" : null
          }, ${telefono ? "'" + telefono + "'" : null}, ${
            direccion ? "'" + direccion + "'" : null
          }, ${email ? "'" + email + "'" : null})`
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

Empresa.prototype.updateEmpresa = async function () {
  const {
    id,
    ruc,
    nombre_fantasia,
    representante,
    telefono,
    direccion,
    email
  } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE empresa 
          SET empresa_ruc= ${
            ruc ? "'" + ruc + "'" : null
          }, empresa_nombre_fantasia= ${
            nombre_fantasia ? "'" + nombre_fantasia + "'" : null
          }, empresa_representante= ${
            representante ? "'" + representante + "'" : null
          }, empresa_telef= ${
            telefono ? "'" + telefono + "'" : null
          }, empresa_dir= ${
            direccion ? "'" + direccion + "'" : null
          }, empresa_correo= ${email ? "'" + email + "'" : null}    
          WHERE empresa_id = ${id}`
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

Empresa.deleteEmpresa = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from empresa where empresa_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Empresa
