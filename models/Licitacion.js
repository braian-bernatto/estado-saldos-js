const pool = require('../db')

const Licitacion = function (data, adenda, activo) {
  this.data = data
  this.adenda = adenda
  this.activo = activo
}

Licitacion.allLicitaciones = async function () {
  let licitacionObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        'select * from licitacion natural join licitacion_tipo order by licitacion_id desc'
      )
      resultado.forEach(async licitacion => {
        //ver si tiene adenda
        let adenda = await pool.query(
          `select adenda_nro from licitacion natural join contrato natural join adenda where licitacion_id = ${licitacion.licitacion_id} order by licitacion_id desc`
        )
        adenda.length ? (adenda = true) : (adenda = false)

        //ver si tiene contratos activos
        let activo = await pool.query(
          `select count(contrato_activo) from contrato where contrato_activo = true and licitacion_id = ${licitacion.licitacion_id}`
        )

        parseInt(activo[0].count) > 0 ? (activo = true) : (activo = false)

        let item = new Licitacion(licitacion, adenda, activo)

        licitacionObj.push(item)
        x++

        if (x === resultado.length) {
          resolve(licitacionObj)
        }
      })

      if (!resultado.length) {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.allLicitacionesEnlaces = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        'select licitacion_id from licitacion order by licitacion_id'
      )

      if (!resultado.length) {
        reject()
      } else {
        resolve(resultado)
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.licitacionByID = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion natural join licitacion_tipo where licitacion_id = ${id}`
      )
      //ver si tiene adenda
      let adenda = await pool.query(
        `select adenda_nro from licitacion natural join contrato natural join codigo_contratacion natural join adenda where licitacion_id = ${id}`
      )
      adenda.length ? (adenda = true) : (adenda = false)

      //ver si tiene contratos activos
      let activo = await pool.query(
        `select count(contrato_activo) from contrato where contrato_activo = true and licitacion_id = ${id}`
      )
      parseInt(activo[0].count) > 0 ? (activo = true) : (activo = false)

      if (resultado.length) {
        let licitacion = new Licitacion(resultado, adenda, activo)
        resolve(licitacion)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.licitacionesByEstado = async function (estado) {
  let licitacionObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion natural join
        licitacion_tipo where licitacion_id ${
          estado === 'true' ? '' : 'not'
        } in (select distinct(licitacion_id) from contrato natural join 
        licitacion where contrato_activo = true) order by licitacion_id desc`
      )

      resultado.forEach(async licitacion => {
        //ver si tiene adenda
        let adenda = await pool.query(
          `select adenda_nro from licitacion natural join contrato natural join adenda where licitacion_id = ${licitacion.licitacion_id} order by licitacion_id desc`
        )
        adenda.length ? (adenda = true) : (adenda = false)

        //ver si tiene contratos activos
        let activo = await pool.query(
          `select count(contrato_activo) from contrato where contrato_activo = true and licitacion_id = ${licitacion.licitacion_id}`
        )
        parseInt(activo[0].count) > 0 ? (activo = true) : (activo = false)

        let item = new Licitacion(licitacion, adenda, activo)

        licitacionObj.push(item)
        x++

        x === resultado.length ? resolve(licitacionObj) : ''
      })

      if (!resultado.length) {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Licitacion.licitacionesSearch = async function (input) {
  let licitacionObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select * from licitacion natural join licitacion_tipo where licitacion_id in (select distinct licitacion_id from licitacion natural join licitacion_tipo
        natural join contrato natural join codigo_contratacion natural join empresa
        where 
        licitacion_descri || ' ' || 		   
        licitacion_id::text || ' ' ||
        licitacion_tipo_abreviatura || ' ' ||
			  licitacion_nro::text || '/' ||
			  licitacion_year::text || ' ' ||
        codigo_contratacion_id || ' ' ||
        contrato_nro::text || '/' ||
        contrato_year::text || ' ' ||
        licitacion_id::text || ' ' ||
        empresa_ruc || ' ' || 
        empresa_nombre_fantasia
        ilike '%${input}%'
        order by licitacion_id desc)`)

      resultado.forEach(async licitacion => {
        //ver si tiene adenda
        let adenda = await pool.query(
          `select adenda_nro from licitacion natural join contrato natural join adenda where licitacion_id = ${licitacion.licitacion_id} order by licitacion_id desc`
        )
        adenda.length ? (adenda = true) : (adenda = false)

        //ver si tiene contratos activos
        let activo = await pool.query(
          `select count(contrato_activo) from contrato where contrato_activo = true and licitacion_id = ${licitacion.licitacion_id}`
        )
        parseInt(activo[0].count) > 0 ? (activo = true) : (activo = false)

        let item = new Licitacion(licitacion, adenda, activo)

        licitacionObj.push(item)
        x++

        x === resultado.length ? resolve(licitacionObj) : ''
      })

      if (!resultado.length) {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Licitacion
