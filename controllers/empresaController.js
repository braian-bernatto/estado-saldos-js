const Empresa = require('../models/Empresa')
const { validationResult } = require('express-validator')

exports.apiGetEmpresas = async function (req, res) {
  try {
    let respuesta = await Empresa.allEmpresas()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckRuc = async function (req, res) {
  try {
    let respuesta = await Empresa.checkRuc(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddEmpresa = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Empresa(req.body).addEmpresa()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateEmpresa = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Empresa(req.body).updateEmpresa()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteEmpresa = async function (req, res) {
  try {
    let respuesta = await Empresa.deleteEmpresa(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
