const pool = require('../db')

const Moneda = function (data) {
  this.data = data
}

Moneda.allMonedas = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from moneda order by 1`)
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Moneda
