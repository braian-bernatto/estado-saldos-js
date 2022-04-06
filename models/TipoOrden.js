const pool = require('../db')

const TipoOrden = function (data) {
  this.data = data
}

TipoOrden.allTipoOrdenes = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from orden_tipo order by orden_tipo_id`
      )
      resultado.length ? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = TipoOrden
