const pool = require("../db")

const Licitacion = function (data, requestedID) {
  this.data = this.data
  this.errors = []
  this.requestedID = requestedID
}

Licitacion.allLicitaciones = async function () {
  return new Promise ( async (resolve, reject) => {
    try {
      const resultado = await pool.query('select * from licitacion')    
      if(resultado.length){
        resolve(resultado)
      }else{
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.LicitacionByID = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const resultado = await pool.query(`select * from licitacion where licitacion_id = ${id}`)
      if(resultado.length){
        resolve(resultado)
      }else{
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}


module.exports = Licitacion