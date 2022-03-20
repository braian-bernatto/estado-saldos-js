const pool = require('../db')

const Nivel = function (data) {
  this.data = data
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

module.exports = Nivel
