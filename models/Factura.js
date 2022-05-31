const pool = require('../db')

const Factura = function (data) {
  this.data = data
  this.errors = []
}

Factura.allFacturasByContrato = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select f.factura_nro, f.factura_fecha, f.factura_monto, (SELECT FACTURA.FACTURA_MONTO - SUM(STR_MONTO) AS RESTANTE_FACTURA
        FROM FACTURA
        NATURAL JOIN STR_DETALLE
        WHERE FACTURA_NRO = F.FACTURA_NRO AND FACTURA_TIMBRADO = 
	 F.FACTURA_TIMBRADO GROUP BY FACTURA.FACTURA_MONTO) AS FACTURA_SALDO,f.factura_timbrado, f.factura_timbrado_vencimiento, s.str_nro, s.str_year, s.str_fecha, s.str_fecha_deposito,sd.str_monto, m.moneda_id, m.moneda_descri, m.moneda_simbolo from factura f left join str_detalle sd natural join str s natural join moneda m on f.factura_nro = sd.factura_nro and f.factura_timbrado = sd.factura_timbrado inner join contrato con on f.contrato_nro = con.contrato_nro and f.contrato_year = con.contrato_year and f.tipo_contrato_id = con.tipo_contrato_id where con.licitacion_id = ${licitacionID} and con.contrato_nro = ${contratoNro} order by factura_fecha desc, factura_nro desc, str_year desc, str_nro desc`
      )

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

        // monto total facturado
        let totalFacturado = await pool.query(
          `select sum(factura_monto) - (select coalesce(total_nota_credito, 0) as total_nota_credito from (select sum(nota_monto) as total_nota_credito from nota_credito natural join factura natural join contrato where licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}) as total_nota_credito) as total_factura from factura natural join licitacion natural join contrato where licitacion_id = ${licitacionID} and contrato_nro =  ${contratoNro}`
        )

        let facturas = new Factura(resultadoAgrupado)

        totalFacturado.length ? '' : (totalFacturado = 0)

        facturas.totalFacturado = totalFacturado[0].total_factura

        resolve(facturas)
      } else {
        reject()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Factura.checkNroUtilizado = async function ({ nro, timbrado }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from factura where factura_nro ilike '${nro}' and factura_timbrado = ${timbrado}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}

Factura.checkFacturaSaldo = async function ({ nro, timbrado }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `SELECT FACTURA.FACTURA_MONTO - SUM(STR_MONTO) AS RESTANTE_FACTURA
        FROM FACTURA
        NATURAL JOIN STR_DETALLE
        WHERE FACTURA_NRO = '${nro}' AND FACTURA_TIMBRADO = ${timbrado} GROUP BY FACTURA.FACTURA_MONTO`
      )
      resolve(resultado)
    } catch (error) {
      console.log(error)
    }
  })
}

Factura.prototype.addFactura = async function () {
  const {
    contrato_nro,
    contrato_year,
    tipo_contrato_id,
    fecha,
    timbrado,
    vencimientoTimbrado,
    monto,
    nro
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO factura(
              factura_nro, factura_timbrado, factura_fecha, factura_monto, contrato_nro, contrato_year, tipo_contrato_id, factura_timbrado_vencimiento)
            VALUES ('${nro}', ${timbrado}, '${fecha}', ${monto}, ${contrato_nro}, ${contrato_year}, ${tipo_contrato_id},'${vencimientoTimbrado}')`
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

Factura.prototype.updateFactura = async function () {
  const { fecha, timbrado, vencimientoTimbrado, monto, nro } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE factura
            SET factura_fecha='${fecha}', factura_monto=${monto}, factura_timbrado_vencimiento='${vencimientoTimbrado}'
          WHERE factura_nro ilike '${nro}' and factura_timbrado = ${timbrado}`
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

Factura.deleteFactura = function ({ nro, timbrado }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `delete from factura where factura_nro ilike '${nro}' and factura_timbrado = ${timbrado}`
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Factura
