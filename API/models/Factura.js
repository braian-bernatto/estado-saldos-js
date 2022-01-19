const pool = require('../db')

const Factura = function (data) {
  this.data = data
}

Factura.allFacturasByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select f.factura_nro, f.factura_fecha, f.factura_monto, f.factura_timbrado, s.str_nro, s.str_year, s.str_fecha, s.str_monto from factura f left join str_detalle sd natural join str s 
     on f.factura_nro = sd.factura_nro and f.factura_timbrado = sd.factura_timbrado inner join contrato con on f.contrato_nro = con.contrato_nro where con.licitacion_id = ${licitacionID} and con.contrato_nro = ${contratoNro} order by factura_fecha desc, factura_nro desc`)

      // resultado.length ? resolve(resultado) : reject()

      if (resultado.length) {
        const years = resultado.reduce((year, item) => {
          let onlyYear = new Date(item.factura_fecha).getFullYear()
          if (!year.includes(onlyYear)) {
            year.push(onlyYear)
          }
          return year
        }, [])

        const resultadoAgrupado = []

        years.forEach(year => {
          const listado = resultado.filter(factura => {
            let onlyYear = new Date(factura.factura_fecha).getFullYear()
            if (onlyYear === year) {
              return factura
            }
          })
          resultadoAgrupado.push(listado)
        })
        resolve(resultadoAgrupado)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Factura
