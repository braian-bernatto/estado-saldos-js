const pool = require('../db')

const Licitacion = function (data, adenda, activo) {
  this.data = data
  this.adenda = adenda
  this.activo = activo
  this.errors = []
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

Licitacion.checkIdUtilizado = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from licitacion where licitacion_id = ${id}`
      )
      resultado.length ? resolve(false) : resolve(true)
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

      if (!resultado.length) {
        resultado =
          await pool.query(`select * from licitacion natural join licitacion_tipo where licitacion_id in (select distinct licitacion_id from licitacion natural join licitacion_tipo
        natural join contrato natural join empresa
        where 
        licitacion_descri || ' ' || 		   
        licitacion_id::text || ' ' ||
        licitacion_tipo_abreviatura || ' ' ||
			  licitacion_nro::text || '/' ||
			  licitacion_year::text || ' ' ||
        contrato_nro::text || '/' ||
        contrato_year::text || ' ' ||
        licitacion_id::text || ' ' ||
        empresa_ruc || ' ' || 
        empresa_nombre_fantasia
        ilike '%${input}%'
        order by licitacion_id desc)`)
      }

      if (!resultado.length) {
        resultado =
          await pool.query(`select * from licitacion natural join licitacion_tipo where licitacion_id in (select distinct licitacion_id from licitacion natural join licitacion_tipo
        where 
        licitacion_descri || ' ' || 		   
        licitacion_id::text || ' ' ||
        licitacion_tipo_abreviatura || ' ' ||
			  licitacion_nro::text || '/' ||
			  licitacion_year::text || ' ' ||
        licitacion_id::text
        ilike '%${input}%'
        order by licitacion_id desc)`)
      }

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

Licitacion.prototype.addLicitacion = async function () {
  const { id, tipo_id, nro, year, descripcion } = this.data
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO licitacion(
            licitacion_id, licitacion_tipo_id, licitacion_nro, licitacion_year, licitacion_descri)
            VALUES (${id}, ${tipo_id}, ${nro}, ${year}, '${descripcion}')`
        )
        resolve(resultado)
      } catch (error) {
        this.errors.push('Please try again later...')
        console.log(error.message)
        reject(this.errors)
      }
    } else {
      reject(this.errors)
    }
  })
}

Licitacion.prototype.updateLicitacion = async function () {
  const { id, tipo_id, nro, year, descripcion } = this.data
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE licitacion
          SET licitacion_tipo_id=${tipo_id}, licitacion_nro=${nro}, licitacion_year=${year}, licitacion_descri='${descripcion}'
          WHERE licitacion_id=${id}`
        )
        resolve(resultado)
      } catch (error) {
        this.errors.push('Please try again later...')
        console.log(error.message)
        reject(this.errors)
      }
    } else {
      reject(this.errors)
    }
  })
}

Licitacion.deleteLicitacion = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `delete from licitacion where licitacion_id = ${id} Returning licitacion_id`
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Licitacion
