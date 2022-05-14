const Licitacion = require('../models/Licitacion')
const { validationResult } = require('express-validator')

exports.apiGetLicitaciones = async function (req, res) {
  try {
    let licitaciones = await Licitacion.allLicitaciones()
    let licitacionOrdenado = ordenarResultado(licitaciones)

    res.json(licitacionOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckLicitacionId = async function (req, res) {
  try {
    let respuesta = await Licitacion.checkIdUtilizado(req.params.id)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionesEnlaces = async function (req, res) {
  try {
    let licitaciones = await Licitacion.allLicitacionesEnlaces()
    res.json(licitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionByID = async function (req, res) {
  try {
    let licitacion = await Licitacion.licitacionByID(req.params.id)
    res.json(licitacion)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionesByEstado = async function (req, res) {
  try {
    let licitacionEstado = await Licitacion.licitacionesByEstado(
      req.params.estado
    )
    let licitacionOrdenado = ordenarResultado(licitacionEstado)
    res.json(licitacionOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiGetLicitacionesBySearch = async function (req, res) {
  try {
    let licitaciones = await Licitacion.licitacionesSearch(req.params.input)
    let licitacionOrdenado = ordenarResultado(licitaciones)
    res.json(licitacionOrdenado)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiAddLicitacion = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let licitaciones = await new Licitacion(req.body).addLicitacion()
    res.json(licitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateLicitacion = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let licitaciones = await new Licitacion(req.body).updateLicitacion()
    res.json(licitaciones)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteLicitacion = async function (req, res) {
  try {
    let respuesta = await Licitacion.deleteLicitacion(req.params.id)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

function ordenarResultado(datos) {
  return datos
    .sort(function (a, b) {
      return (
        a.data.licitacion_year - b.data.licitacion_year ||
        a.data.licitacion_id - b.data.licitacion_id
      )
    })
    .reverse()
}
