const pool = require('../db')
const pgp = require('pg-promise')({ capSQL: true })

const Contrato = function (data, adenda) {
  this.data = data
  this.adenda = adenda
  this.errors = []
}

Contrato.allContratos = async function (licitacionID) {
  let contratoObj = []
  let x = 0
  return new Promise(async (resolve, reject) => {
    try {
      let resultado =
        await pool.query(`SELECT L.LICITACION_ID, L.LICITACION_YEAR,
	L.LICITACION_DESCRI,
	L.LICITACION_YEAR,
	LT.LICITACION_TIPO_ABREVIATURA,
	C.CONTRATO_NRO,
	C.CONTRATO_YEAR,
	C.TIPO_CONTRATO_ID,
	C.CONTRATO_FIRMA,
	C.CONTRATO_VENCIMIENTO,
	C.MONEDA_ID,
	C.CONTRATO_ACTIVO,
	CC.CODIGO_CONTRATACION_ID,
	CC.CODIGO_CONTRATACION_OBSERVACION,
	E.EMPRESA_RUC,
	E.EMPRESA_NOMBRE_FANTASIA
FROM LICITACION L
NATURAL JOIN LICITACION_TIPO LT
NATURAL JOIN EMPRESA E
NATURAL JOIN CONTRATO C
LEFT JOIN CODIGO_CONTRATACION CC ON C.CONTRATO_NRO = CC.CONTRATO_NRO
AND C.CONTRATO_YEAR = CC.CONTRATO_YEAR
AND C.TIPO_CONTRATO_ID = CC.TIPO_CONTRATO_ID
WHERE L.LICITACION_ID = ${licitacionID}
				AND CC.CODIGO_CONTRATACION_ID not ilike '%AC%'
        AND CC.CODIGO_CONTRATACION_ID not in
          (SELECT CODIGO_CONTRATACION_ID
            FROM ADENDA
            NATURAL JOIN CONTRATO
            NATURAL JOIN ADENDA_CC
            WHERE LICITACION_ID = ${licitacionID} )
      ORDER BY C.CONTRATO_NRO`)

      let resultadoSinCodigo =
        await pool.query(`SELECT L.LICITACION_ID, L.LICITACION_NRO,
      L.LICITACION_YEAR,
      L.LICITACION_DESCRI,
      L.LICITACION_YEAR,
      LT.LICITACION_TIPO_ABREVIATURA,
      C.CONTRATO_NRO,
      C.CONTRATO_YEAR,
      C.TIPO_CONTRATO_ID,
      C.CONTRATO_FIRMA,
      C.CONTRATO_VENCIMIENTO,
      C.MONEDA_ID,
      C.CONTRATO_ACTIVO,
      CC.CODIGO_CONTRATACION_ID,
      CC.CODIGO_CONTRATACION_OBSERVACION,
      E.EMPRESA_RUC,
      E.EMPRESA_NOMBRE_FANTASIA
    FROM LICITACION L
    NATURAL JOIN LICITACION_TIPO LT
    NATURAL JOIN EMPRESA E
    NATURAL JOIN CONTRATO C
    LEFT JOIN CODIGO_CONTRATACION CC ON C.CONTRATO_NRO = CC.CONTRATO_NRO
    AND C.CONTRATO_YEAR = CC.CONTRATO_YEAR
    AND C.TIPO_CONTRATO_ID = CC.TIPO_CONTRATO_ID
    WHERE L.LICITACION_ID = ${licitacionID}
            AND CC.CODIGO_CONTRATACION_ID is NULL
            AND CC.CODIGO_CONTRATACION_ID not in
              (SELECT CODIGO_CONTRATACION_ID
                FROM ADENDA
                NATURAL JOIN CONTRATO
                NATURAL JOIN ADENDA_CC
                WHERE LICITACION_ID = ${licitacionID} )
          ORDER BY C.CONTRATO_NRO`)

      if (resultadoSinCodigo.length) {
        resultado = resultado.concat(resultadoSinCodigo)
      }

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

Contrato.checkNroUtilizado = async function (nro, tipo, year) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(
        `select * from contrato where contrato_nro = ${nro} and tipo_contrato_id = ${tipo} and contrato_year = ${year}`
      )
      resultado.length ? resolve(false) : resolve(true)
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.contratoByNro = async function (licitacionID, contratoNro) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultado = await pool.query(`SELECT 
        E.empresa_id,
        L.licitacion_id,
        L.licitacion_tipo_id,
        L.licitacion_nro,
        L.licitacion_year,
        L.licitacion_descri,
        LT.licitacion_tipo_abreviatura,
        LT.licitacion_tipo_nombre,
        C.contrato_nro,
        C.contrato_year,
        C.tipo_contrato_id,
        C.contrato_firma,
        C.contrato_vencimiento,
        C.moneda_id,
        CC.moneda_id AS MONEDA_CC,
        C.contrato_activo,
        E.empresa_ruc,
        E.empresa_nombre_fantasia,
        E.empresa_representante,
        E.empresa_telef,
        E.empresa_dir,
        E.empresa_correo
        FROM LICITACION L
        NATURAL JOIN LICITACION_TIPO LT
        NATURAL JOIN CONTRATO C 
        LEFT JOIN CODIGO_CONTRATACION CC ON C.CONTRATO_NRO = CC.CONTRATO_NRO 
        AND C.CONTRATO_YEAR = CC.CONTRATO_YEAR AND C.TIPO_CONTRATO_ID = CC.TIPO_CONTRATO_ID 
        NATURAL JOIN EMPRESA E
        WHERE C.LICITACION_ID = ${licitacionID}
                AND C.CONTRATO_NRO = ${contratoNro}
                AND CC.CODIGO_CONTRATACION_ID not ilike '%AC%'
        ORDER BY C.CONTRATO_NRO`)

      if (!resultado.length) {
        resultado =
          await pool.query(`select * from licitacion natural join licitacion_tipo
      natural join contrato natural join empresa where licitacion_id = ${licitacionID} and 
      contrato_nro = ${contratoNro} order by contrato_nro`)
      }

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

      if (!resultado.length) {
        resultado =
          await pool.query(`select * from licitacion natural join  licitacion_tipo natural join contrato natural join
      empresa where licitacion_id = ${licitacionID} and 
      contrato_activo = ${estado} order by contrato.contrato_nro`)
      }

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
        `select * from contrato natural join contrato_detalle natural join codigo_contratacion natural join moneda where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} and codigo_contratacion_id not ilike '%AC%'`
      )

      // adjudicacion por lote
      if (!resultado.length) {
        resultado =
          await pool.query(`select * from contrato natural join contrato_lote natural join codigo_contratacion natural join moneda
      where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} and codigo_contratacion_id not ilike '%AC%' order by contrato_lote_id`)
      }

      // adjudicacion normal
      if (!resultado.length) {
        resultado = await pool.query(
          `select * from contrato natural join contrato_detalle where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
        )
      }

      // adjudicacion por lote
      if (!resultado.length) {
        resultado = await pool.query(
          `select * from contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
        )
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
      let checkEqualMoneda = await pool.query(
        `select str.moneda_id, contrato.moneda_id from contrato 
          natural join str natural join licitacion where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )

      let finalQuery = checkEqualMoneda.length
        ? `select coalesce((select sum(str_monto) as total_factura_str from str_detalle where factura_nro in (select factura_nro from factura natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro})), 0) as total_factura_str
    `
        : `select coalesce((select sum(str_monto * factura_menos_credito / suma_str) as total_factura_str from (
        select factura_nro, factura_monto, str_monto, suma_str, factura_monto - coalesce(total_nota_credito, 0) as factura_menos_credito from (
        select factura_nro, total_nota_credito from factura left join (select factura_nro, sum(nota_monto) as total_nota_credito from nota_credito natural join factura natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} group by factura_nro) as credito using(factura_nro) natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}) as credito natural join (select factura_nro, factura_monto, str_monto, suma_str from str_detalle natural join factura natural join contrato natural join (select factura_nro, factura_monto, sum(str_monto) as suma_str from str_detalle natural join factura natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} group by factura_nro, factura_monto) as suma where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}) as listado) as superquery), 0) as total_factura_str
    `

      // monto facturado con str en moneda extranjera
      let totalFacturadoSTR = await pool.query(finalQuery)

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
      let vigencia = await pool.query(
        `select * from adenda natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} and adenda_fecha is not null and adenda_nro
        not in (select adenda_nro from codigo_contratacion natural join adenda natural join adenda_cc natural join contrato natural join codigo_rubro where licitacion_id =  ${licitacionID} and contrato_nro = ${contratoNro}) and adenda_nro not in (select distinct(adenda_nro) from adenda natural join adenda_disminucion natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro})`
      )
      vigencia.length ? '' : (vigencia = false)

      let ampliacionAll = await pool.query(
        `SELECT CC.CODIGO_CONTRATACION_ID,
        C.MONEDA_ID,
        CC.MONEDA_ID AS MONEDA_CC,
        A.ADENDA_NRO,
        A.ADENDA_FIRMA,
        A.ADENDA_FECHA,
        A.ADENDA_OBSERVACION,
        AC.ADENDA_MONTO,
        CR.CODIGO_CONTRATACION_MONTO,
        CR.RUBRO_ID
      FROM CONTRATO C
      NATURAL JOIN ADENDA A
      NATURAL JOIN ADENDA_CC AC
      LEFT JOIN CODIGO_CONTRATACION CC ON AC.CODIGO_CONTRATACION_ID = CC.CODIGO_CONTRATACION_ID
      LEFT JOIN CODIGO_RUBRO CR ON CR.CODIGO_CONTRATACION_ID = CC.CODIGO_CONTRATACION_ID WHERE
       C.licitacion_id = ${licitacionID} and C.contrato_nro = ${contratoNro} ORDER BY A.ADENDA_NRO DESC`
      )
      let ampliacion = ampliacionAll.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(
          elemento =>
            elemento.codigo_contratacion_id ===
            valorActual.codigo_contratacion_id
        )
        let nuevo
        if (elementoYaExiste) {
          nuevo = acumulador.map(item => {
            if (
              item.codigo_contratacion_id === valorActual.codigo_contratacion_id
            ) {
              item.rubros
                ? (item.rubros = [
                    ...item.rubros,
                    {
                      rubro_id: valorActual.rubro_id,
                      monto: valorActual.codigo_contratacion_monto
                    }
                  ])
                : (item.rubros = [
                    {
                      rubro_id: valorActual.rubro_id,
                      monto: valorActual.codigo_contratacion_monto
                    }
                  ])
              item.codigo_contratacion_monto =
                parseFloat(item.codigo_contratacion_monto) +
                parseFloat(valorActual.codigo_contratacion_monto)
              delete item.rubro_id
            }
            return item
          })
          return nuevo
        } else {
          return [
            ...acumulador,
            {
              ...valorActual,
              rubros: [
                {
                  rubro_id: valorActual.rubro_id,
                  monto: valorActual.codigo_contratacion_monto
                }
              ]
            }
          ]
        }
      }, [])

      // adenda con lotes
      let lotes_ampliacion = await pool.query(
        `select * from adenda_lote natural join adenda natural join adenda_cc natural join contrato natural join contrato_lote where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by adenda_nro desc, contrato_lote_id asc`
      )

      ampliacion.length ? '' : (ampliacion = false)
      lotes_ampliacion.length ? '' : (lotes_ampliacion = false)

      // adenda disminucion
      let disminucionAll = await pool.query(
        `select * from adenda natural join adenda_disminucion natural join adenda_disminucion_cc natural join contrato where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro} order by adenda_nro desc, rubro_id asc`
      )

      let disminucion = disminucionAll.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(
          elemento => elemento.adenda_nro === valorActual.adenda_nro
        )
        let nuevo
        if (elementoYaExiste) {
          nuevo = acumulador.map(item => {
            if (item.adenda_nro === valorActual.adenda_nro) {
              item.rubros
                ? (item.rubros = [
                    ...item.rubros,
                    {
                      rubro_id: valorActual.rubro_id,
                      monto: valorActual.adenda_rubro_monto
                    }
                  ])
                : (item.rubros = [
                    {
                      rubro_id: valorActual.rubro_id,
                      monto: valorActual.adenda_rubro_monto
                    }
                  ])
              item.adenda_rubro_monto =
                parseFloat(item.adenda_rubro_monto) +
                parseFloat(valorActual.adenda_rubro_monto)
              delete item.rubro_id
            }
            return item
          })
          return nuevo
        } else {
          return [
            ...acumulador,
            {
              ...valorActual,
              rubros: [
                {
                  rubro_id: valorActual.rubro_id,
                  monto: valorActual.adenda_rubro_monto
                }
              ]
            }
          ]
        }
      }, [])

      // adenda disminucion con lotes
      let lotes_disminucion = await pool.query(
        `SELECT distinct ad.adenda_nro, al.contrato_lote_id, cl.lote_descri, al.adenda_lote_monto
        FROM ADENDA_LOTE al
        NATURAL JOIN ADENDA_DISMINUCION ad
        NATURAL JOIN ADENDA a
        NATURAL JOIN CONTRATO c
        NATURAL JOIN CONTRATO_LOTE cl        
        WHERE c.licitacion_id = ${licitacionID} and c.contrato_nro = ${contratoNro} order by ad.adenda_nro desc, al.contrato_lote_id asc`
      )

      disminucion.length ? '' : (disminucion = false)
      lotes_disminucion.length ? '' : (lotes_disminucion = false)

      // si no hay ningun tipo de adenda se envia un false
      if (ampliacion.length || disminucion.length || vigencia.length) {
        let adenda = [
          { ampliacion },
          { lotes_ampliacion },
          { disminucion },
          { lotes_disminucion },
          { vigencia }
        ]
        resolve(adenda)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.finalizarContrato = async function (
  licitacionID,
  contratoNro,
  estado
) {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(
        `update contrato set contrato_activo = ${estado} where licitacion_id = ${licitacionID} and contrato_nro = ${contratoNro}`
      )
      resolve({ msg: 'Actualizado con éxito' })
    } catch (error) {
      console.log(error)
    }
  })
}

Contrato.prototype.addContrato = async function () {
  const {
    licitacion_id,
    activo,
    cumplimiento,
    nro,
    tipo,
    year,
    moneda,
    empresa,
    fecha_firma,
    fecha_vencimiento,
    lotes,
    monto_minimo,
    monto_maximo
  } = this.data

  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `INSERT INTO contrato(
            contrato_nro, contrato_year, tipo_contrato_id, contrato_firma, contrato_vencimiento, licitacion_id, empresa_id, moneda_id, contrato_activo)    
            VALUES (${nro}, ${year}, ${tipo}, '${fecha_firma}', '${
              cumplimiento ? 'CUMPLIMIENTO' : fecha_vencimiento
            }', ${licitacion_id}, ${empresa}, ${moneda}, ${activo})`
          )
          if (lotes === false) {
            await t.query(
              `INSERT INTO contrato_detalle(
              contrato_nro, contrato_year, tipo_contrato_id, contrato_minimo, contrato_maximo)
              VALUES (${nro}, ${year}, ${tipo}, ${monto_minimo}, ${monto_maximo})`
            )
          }
          if (Array.isArray(lotes)) {
            const cs = new pgp.helpers.ColumnSet(
              [
                'contrato_lote_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'lote_descri',
                'lote_minimo',
                'lote_maximo'
              ],
              {
                table: 'contrato_lote'
              }
            )

            // data input values:
            const values = lotes.map(lote => {
              const loteObj = {
                contrato_nro: nro,
                contrato_year: year,
                tipo_contrato_id: tipo,
                contrato_lote_id: lote.nro,
                lote_descri: lote.nombre,
                lote_minimo: lote.minimo,
                lote_maximo: lote.maximo
              }
              return loteObj
            })

            // generating a multi-row insert query:
            const query = pgp.helpers.insert(values, cs)

            // executing the query:
            await t.none(query)
          }
          resolve(resultado)
        })
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

Contrato.prototype.updateContrato = async function () {
  const {
    licitacion_id,
    activo,
    cumplimiento,
    nro,
    tipo,
    year,
    moneda,
    empresa,
    fecha_firma,
    fecha_vencimiento,
    lotes,
    monto_minimo,
    monto_maximo
  } = this.data
  const eliminadosArray = this.data.eliminados ? this.data.eliminados : []
  // only if there are no errors proceedo to save into the database
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      try {
        pool.task(async t => {
          let resultado = await t.query(
            `UPDATE contrato
          SET contrato_firma='${fecha_firma}', contrato_vencimiento='${
              cumplimiento ? 'CUMPLIMIENTO' : fecha_vencimiento
            }', licitacion_id=${licitacion_id}, empresa_id=${empresa}, moneda_id=${moneda}, contrato_activo=${activo}, tipo_contrato_id=${tipo}
          WHERE contrato_nro=${nro} and contrato_year=${year} and tipo_contrato_id=${tipo}`
          )
          if (lotes === false) {
            await t.query(
              `UPDATE contrato_detalle
            SET contrato_minimo=${
              monto_minimo ? monto_minimo : null
            }, contrato_maximo=${monto_maximo}
            WHERE contrato_nro=${nro} and contrato_year=${year} and tipo_contrato_id=${tipo}`
            )
          }
          if (Array.isArray(lotes)) {
            const csUpdate = new pgp.helpers.ColumnSet(
              ['contrato_lote_id', 'lote_descri', 'lote_minimo', 'lote_maximo'],
              {
                table: 'contrato_lote'
              }
            )

            // si se agregan nuevos lotes al contrato se insertan
            const csInsert = new pgp.helpers.ColumnSet(
              [
                'contrato_lote_id',
                'contrato_nro',
                'contrato_year',
                'tipo_contrato_id',
                'lote_descri',
                'lote_minimo',
                'lote_maximo'
              ],
              {
                table: 'contrato_lote'
              }
            )

            // data input values:
            let loteObj
            const values = lotes.map(lote => {
              loteObj = {
                contrato_nro: nro,
                contrato_year: year,
                tipo_contrato_id: tipo,
                contrato_lote_id: lote.nro,
                lote_descri: lote.nombre,
                lote_minimo: lote.minimo,
                lote_maximo: lote.maximo
              }
              lote.hasOwnProperty('newLote')
                ? (loteObj.newLote = true)
                : loteObj
              return loteObj
            })

            const newLotes = values.filter(lote =>
              lote.hasOwnProperty('newLote')
            )
            const lotesActualizar = values.filter(
              lote => !lote.hasOwnProperty('newLote')
            )

            const condition = pgp.as.format(
              ' WHERE t.contrato_nro=${contrato_nro} and t.contrato_year=${contrato_year} and t.tipo_contrato_id=${tipo_contrato_id} and t.contrato_lote_id=v.contrato_lote_id',
              loteObj
            )

            // si se agregaron lotes nuevos se insertan en la bd
            if (newLotes.length > 0) {
              // generating a multi-row insert query:
              const queryInsert = pgp.helpers.insert(newLotes, csInsert)
              // executing the query:
              await t.none(queryInsert)
            }

            // generating a multi-row insert query:
            if (lotesActualizar.length > 0) {
              const queryUpdate =
                pgp.helpers.update(lotesActualizar, csUpdate) + condition
              // executing the query:
              await t.none(queryUpdate)
            }

            //si se eliminan lotes del contrato
            if (eliminadosArray.length > 0) {
              const ids = eliminadosArray.map(lote => {
                return lote.nro
              })
              await t.none(
                `delete from contrato_lote where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} and contrato_lote_id in ($1:list)`,
                [ids]
              )
            }
          }
          resolve(resultado)
        })
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

Contrato.deleteContrato = function (nro, year, tipo) {
  return new Promise(async (resolve, reject) => {
    try {
      pool.task(async t => {
        let result = await t.query(
          `delete from contrato_detalle where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
        )
        if (!result.length) {
          result = await t.query(
            `delete from contrato_lote where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
          )
        }
        if (result.length) {
          result = await t.query(
            `delete from contrato where contrato_nro = ${nro} and contrato_year = ${year} and tipo_contrato_id = ${tipo} RETURNING contrato_nro`
          )
        }
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Contrato
