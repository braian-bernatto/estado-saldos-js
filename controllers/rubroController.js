const Rubro = require('../models/Rubro')
const { validationResult } = require('express-validator')

exports.apiGetRubros = async function (req, res) {
  try {
    let rubros = await Rubro.allRubros()
    res.json(rubros)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckRubro = async function (req, res) {
  try {
    let respuesta = await Rubro.checkRubro(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddRubro = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Rubro(req.body).addRubro()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateRubro = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Rubro(req.body).updateRubro()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteRubro = async function (req, res) {
  try {
    let respuesta = await Rubro.deleteRubro(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
