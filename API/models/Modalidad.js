const pool = require('../db')

const Modalidad = function (data) {
  this.data = data
}

Modalidad.allModalidades = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from modalidad order by modalidad_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Modalidad
