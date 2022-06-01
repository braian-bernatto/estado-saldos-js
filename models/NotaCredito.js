const pool = require('../db')

const NotaCredito = function (data) {
  this.data = data
  this.errors = []
}

NotaCredito.allNotasCreditoByContrato = async function (
  licitacionID,
  contratoNro
) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from nota_credito natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by nota_fecha desc, nota_nro desc`
      )

      if (resultado.length) {
        const years = resultado.reduce((year, item) => {
          let onlyYear = new Date(item.nota_fecha).getFullYear()
          if (!year.includes(onlyYear)) {
            year.push(onlyYear)
          }
          return year
        }, [])

        const resultadoAgrupado = []

        years.forEach(year => {
          const listado = resultado.filter(nota => {
            let onlyYear = new Date(nota.nota_fecha).getFullYear()
            if (onlyYear === year) {
              return nota
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

NotaCredito.checkNroUtilizado = async function ({ nro, timbrado }) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from nota_credito where nota_nro = '${nro}' and nota_timbrado = ${timbrado}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}
NotaCredito.prototype.addNotaCredito = async function () {
  const {
    nroFactura,
    timbradoFactura,
    nro,
    timbrado,
    vencimientoTimbrado,
    fecha,
    monto
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `INSERT INTO nota_credito(
              nota_nro, factura_nro, factura_timbrado, nota_fecha, nota_monto, nota_timbrado, nota_timbrado_vencimiento)
            VALUES ('${nro}', '${nroFactura}', ${timbradoFactura}, '${fecha}', ${monto}, ${timbrado}, '${vencimientoTimbrado}')`
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

NotaCredito.prototype.updateNotaCredito = async function () {
  const { nro, timbrado, vencimientoTimbrado, fecha, monto } = this.data
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        let resultado = await pool.query(
          `UPDATE nota_credito
           nota_fecha='${fecha}', nota_monto=${monto}, nota_timbrado_vencimiento='${vencimientoTimbrado}'
          WHERE nota_nro = '${nro}' and nota_timbrado = ${timbrado}`
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

NotaCredito.deleteNotaCredito = function ({ nro, timbrado }) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `delete from nota_credito where nota_nro = '${nro}' and nota_timbrado = ${timbrado}`
      )
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = NotaCredito
