const pool = require("../db")

const Licitacion = function (data,adenda) {
  this.data = data
  this.adenda = adenda
}

Licitacion.allLicitaciones = async function () {
  let licitacionObj = []
  let x = 0
  return new Promise ( async (resolve, reject) => {
    try {
      let resultado = await pool.query('select * from licitacion natural join licitacion_tipo order by licitacion_id') 
          resultado.forEach(async licitacion => {          
         
            let adenda = await pool.query(`select adenda_nro from licitacion natural join contrato natural join adenda where licitacion_id = ${licitacion.licitacion_id} order by licitacion_id`)

            adenda.length ? adenda = true : adenda = false
  
            let item = new Licitacion(licitacion, adenda)
  
            licitacionObj.push(item)
            x++ 
            
            if (x === resultado.length) {
              resolve(licitacionObj)            
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

Licitacion.licitacionByID = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from licitacion where licitacion_id = ${id}`)
      let adenda = await pool.query(`select adenda_nro from licitacion natural join contrato natural join codigo_contratacion natural join adenda where licitacion_id = ${id}`)
      adenda.length ? adenda = true : adenda = false
      if(resultado.length){
        let licitacion = new Licitacion(resultado, adenda)
        resolve(licitacion)
      }else{
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.licitacionesByEstado = async function (estado) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`select * from licitacion where licitacion_activo = ${estado}`)    
      resultado.length? resolve(resultado) : reject()
    } catch (error) {
      console.log(error);
    }
  })
}




module.exports = Licitacion