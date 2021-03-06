const Nivel = require('../models/Nivel')
const { validationResult } = require('express-validator')

exports.apiGetNiveles = async function (req, res) {
  try {
    let niveles = await Nivel.allNiveles()
    res.json(niveles)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckNivel = async function (req, res) {
  try {
    let respuesta = await Nivel.checkNivel(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddNivel = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Nivel(req.body).addNivel()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateNivel = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Nivel(req.body).updateNivel()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteNivel = async function (req, res) {
  try {
    let respuesta = await Nivel.deleteNivel(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
