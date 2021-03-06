const pool = require('../db')

const Moneda = function (data) {
  this.data = data
  this.errors = []
}

Moneda.allMonedas = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from moneda order by moneda_descri`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

Moneda.checkMoneda = async function ({ nombre }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from moneda where moneda_descri ilike '${nombre}'`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
Moneda.prototype.addMoneda = async function () {
  const { simbolo, descripcion } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO moneda (moneda_simbolo, moneda_descri)
            VALUES ('${simbolo}', '${descripcion}')`
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

Moneda.prototype.updateMoneda = async function () {
  const { id, simbolo, descripcion } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE moneda 
          SET moneda_simbolo= '${simbolo}', moneda_descri='${descripcion}' WHERE moneda_id = ${id}`
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

Moneda.deleteMoneda = function ({ id }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`delete from moneda where moneda_id = ${id}`)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Moneda
