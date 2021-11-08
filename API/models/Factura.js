const pool = require('../db')

const Factura = function (data) {
  this.data = data
}

Factura.allFacturasByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject)=>{
    try {
      let resultado = await pool.query(`select f.factura_nro, f.factura_fecha, f.factura_monto, f.factura_timbrado, s.str_nro, s.str_year, s.str_fecha, s.str_monto from factura f left join str_detalle sd natural join str s 
     on f.factura_nro = sd.factura_nro and f.factura_timbrado = sd.factura_timbrado inner join contrato con on f.contrato_nro = con.contrato_nro where con.licitacion_id = ${licitacionID} and con.contrato_nro = ${contratoNro}`)

      resultado.length? resolve(resultado) : reject()
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Factura