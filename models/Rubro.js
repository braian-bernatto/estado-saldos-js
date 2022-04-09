const pool = require('../db')

const Rubro = function (data) {
  this.data = data
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

module.exports = Rubro
