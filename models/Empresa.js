const pool = require('../db')

const Empresa = function (data) {
  this.data = data
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

module.exports = Empresa
