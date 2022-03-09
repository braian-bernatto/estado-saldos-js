const pool = require('../db')

const Contrato = function (data, adenda) {
  this.data = data
  this.adenda = adenda
}

Contrato.allContratos = async function (licitacionID) {
  let contratoObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select * from licitacion natural join licitacion_tipo
      natural join contrato natural join codigo_contratacion natural join
      empresa where licitacion_id = ${licitacionID} and codigo_contratacion_id
	    not in (select codigo_contratacion_id from adenda
      natural join contrato natural join adenda_cc where
      licitacion_id =  ${licitacionID} ) order by contrato.contrato_nro`)

      resultado.forEach(async contrato => {
        let adenda = await pool.query(
          `select adenda_nro from contrato natural join adenda where licitacion_id = ${licitacionID} and contrato_nro = ${contrato.contrato_nro}`
        )

        adenda.length ? (adenda = true) : (adenda = false)

        let item = new Contrato(contrato, adenda)

        contratoObj.push(item)
        x++

        if (x === resultado.length) {
          resolve(contratoObj)
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

Contrato.allContratosEnlaces = async function (licitacionID) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select distinct(contrato_nro) from contrato order by 1`
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

Contrato.contratoByNro = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select * from licitacion natural join licitacion_tipo
      natural join contrato natural join codigo_contratacion natural join
      empresa where licitacion_id = ${licitacionID} and 
      contrato_nro = ${contratoNro} and
      codigo_contratacion_id
	    not in (select codigo_contratacion_id from adenda
      natural join contrato natural join adenda_cc where
      licitacion_id =  ${licitacionID} ) order by contrato.contrato_nro`)

      let adenda = await pool.query(
        `select adenda_nro from contrato natural join adenda where licitacion_id = ${licitacionID} and contrato_nro = ${resultado[0].contrato_nro}`
      )

      adenda.length ? (adenda = true) : (adenda = false)

      if (resultado.length) {
        let contrato = new Contrato(resultado, adenda)
        resolve(contrato)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.contratosByEstado = async function (licitacionID, estado) {
  let contratoObj = []
  let x = 0

  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select * from licitacion natural join  licitacion_tipo natural join contrato natural 
      join codigo_contratacion natural join
      empresa where licitacion_id = ${licitacionID} and 
      contrato_activo = ${estado} and
      codigo_contratacion_id
	    not in (select codigo_contratacion_id from adenda
      natural join contrato natural join adenda_cc where
      licitacion_id =  ${licitacionID} ) order by contrato.contrato_nro`)

      resultado.forEach(async contrato => {
        let adenda = await pool.query(
          `select adenda_nro from contrato natural join adenda where licitacion_id = ${licitacionID} and contrato_nro = ${contrato.contrato_nro}`
        )

        adenda.length ? (adenda = true) : (adenda = false)

        let item = new Contrato(contrato, adenda)

        contratoObj.push(item)
        x++

        if (x === resultado.length) {
          resolve(contratoObj)
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

Contrato.contratosBySearch = async function (licitacionID, input) {
  let contratoObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`select * from licitacion natural join licitacion_tipo natural join contrato natural join codigo_contratacion natural join empresa where licitacion_id = ${licitacionID} and 
        codigo_contratacion_id || ' ' ||
        contrato_nro::text || '/' ||
        contrato_year::text || ' ' ||
        empresa_ruc || ' ' || 
        empresa_nombre_fantasia
        ilike '%${input}%'
        order by contrato_nro`)

      resultado.forEach(async contrato => {
        let adenda = await pool.query(
          `select adenda_nro from contrato natural join adenda where licitacion_id = ${licitacionID} and contrato_nro = ${contrato.contrato_nro}`
        )

        adenda.length ? (adenda = true) : (adenda = false)

        let item = new Contrato(contrato, adenda)

        contratoObj.push(item)
        x++

        x === resultado.length ? resolve(contratoObj) : ''
      })

      if (!resultado.length) {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.contratoResumen = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      // adjudicacion normal
      let resultado = await pool.query(
        `select * from contrato natural join contrato_detalle natural join codigo_contratacion natural join moneda where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} and codigo_contratacion_id not in(select distinct(codigo_contratacion_id) from adenda_cc natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro})`
      )

      // adjudicacion por lote
      if (!resultado.length) {
        resultado =
          await pool.query(`select * from contrato natural join contrato_lote natural join codigo_contratacion natural join moneda
      where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} and codigo_contratacion_id not in(select distinct(codigo_contratacion_id) from adenda_cc natural join contrato natural join adenda_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro})`)
      }

      // monto total emitido en ordenes
      let totalOrdenes =
        await pool.query(`select sum(orden_monto) as orden_emitido from orden natural join orden_tipo natural join contrato
      where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`)

      totalOrdenes.length ? '' : (totalOrdenes = 0)

      // monto total facturado
      let totalFacturado = await pool.query(
        `select sum(factura_monto) - (select coalesce(total_nota_credito, 0) as total_nota_credito from (select sum(nota_monto) as total_nota_credito from nota_credito natural join factura natural join contrato where licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}) as total_nota_credito) as total_factura from factura natural join licitacion natural join contrato where licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}`
      )

      totalFacturado.length ? '' : (totalFacturado = 0)

      // monto facturado con str
      let totalFacturadoSTR = await pool.query(
        `select sum(str_monto * factura_menos_credito / suma_str) as total_factura_str from (
          select factura_nro, factura_monto, str_monto, suma_str, factura_monto - coalesce(total_nota_credito, 0) as factura_menos_credito from (
          select factura_nro, total_nota_credito from factura left join (select factura_nro, sum(nota_monto) as total_nota_credito from nota_credito natural join factura natural join contrato
          where licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro} group by factura_nro) as credito using(factura_nro) natural join contrato where
          licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}) as credito natural join (select factura_nro, factura_monto, str_monto, suma_str from str_detalle natural join
          factura natural join contrato natural join (select factura_nro, factura_monto, sum(str_monto)
          as suma_str from str_detalle natural join factura natural join
          contrato where licitacion_id = ${licitacionID} and contrato_nro =
          ${contratoNro} group by factura_nro, factura_monto) as suma where
          licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}) as listado) as superquery
          `
      )

      totalFacturadoSTR.length ? '' : (totalFacturadoSTR = 0)

      // detalle de adenda
      let adenda = await this.verAdenda(licitacionID, contratoNro)

      if (resultado.length && totalOrdenes.length && totalFacturado.length) {
        let contrato = new Contrato(resultado, adenda)
        contrato.montos = totalOrdenes
        contrato.montos.push(totalFacturado[0])
        contrato.montos.push(totalFacturadoSTR[0])
        resolve(contrato)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.verAdenda = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      // monto total de la adenda
      let ampliacion = await pool.query(
        `select * from codigo_contratacion natural join adenda_cc natural join contrato natural join codigo_rubro where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )

      // adenda con lotes
      let lotes = await pool.query(
        `select * from adenda_lote natural join adenda_cc natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )

      ampliacion.length ? '' : (ampliacion = false)
      lotes.length ? '' : (lotes = false)

      // adenda disminucion
      let disminucion = await pool.query(
        `select * from adenda_lote natural join adenda_disminucion natural join adenda natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )

      if (!disminucion.length) {
        disminucion = await pool.query(
          `select * from adenda natural join adenda_disminucion natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
        )
      }

      disminucion.length ? '' : (disminucion = false)

      // si no hay ningun tipo de adenda se envia un false
      if (ampliacion.length || lotes.length || disminucion.length) {
        let adenda = [{ ampliacion }, { lotes }, { disminucion }]
        resolve(adenda)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Contrato
