const Dependencia = require('../models/Dependencia')
const { validationResult } = require('express-validator')

exports.apiGetDependencias = async function (req, res) {
  try {
    let Dependencias = await Dependencia.allDependencias()
    res.json(Dependencias)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckDependencia = async function (req, res) {
  try {
    let respuesta = await Dependencia.checkDependencia(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddDependencia = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Dependencia(req.body).addDependencia()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateDependencia = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Dependencia(req.body).updateDependencia()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteDependencia = async function (req, res) {
  try {
    let respuesta = await Dependencia.deleteDependencia(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
