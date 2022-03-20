const pool = require('../db')

const TipoLicitacion = function (data) {
  this.data = data
}

TipoLicitacion.allTipoLicitaciones = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion_tipo order by licitacion_tipo_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = TipoLicitacion
