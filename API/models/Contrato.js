const pool = require("../db")

const Contrato = function(data, adenda){
  this.data = data
  this.adenda = adenda
}

Contrato.allContratos = async function (licitacionID) {
  let contratoObj = []
  let x = 0
  return new Promise ( async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from licitacion natural join licitacion_tipo
      natural join contrato natural join codigo_contratacion natural join
      empresa where licitacion_id = ${licitacionID} and codigo_contratacion_id
	    not in (select codigo_contratacion_id from adenda
      natural join contrato natural join adenda_cc where
      licitacion_id =  ${licitacionID} ) order by contrato.contrato_nro`) 

          resultado.forEach(async contrato => {          
         
            let adenda = await pool.query(`select adenda_nro from contrato natural join adenda where licitacion_id = ${licitacionID} and contrato_nro = ${contrato.contrato_nro}`)

            adenda.length ? adenda = true : adenda = false
  
            let item = new Contrato(contrato, adenda)
  
            contratoObj.push(item)
            x++ 
            
            if (x === resultado.length) {
              resolve(contratoObj)            
            }
        })              

        if(!resultado.length){
          reject()
        }
        
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Contrato