const Rol = require('../models/Rol')
const { validationResult } = require('express-validator')

exports.apiGetRoles = async function (req, res) {
  try {
    let roles = await Rol.allRoles()
    res.json(roles)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiCheckRol = async function (req, res) {
  try {
    let respuesta = await Rol.checkRol(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.apiAddRol = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Rol(req.body).addRol()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiUpdateRol = async function (req, res) {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    let respuesta = await new Rol(req.body).updateRol()
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}

exports.apiDeleteRol = async function (req, res) {
  try {
    let respuesta = await Rol.deleteRol(req.params)
    res.json(respuesta)
  } catch (error) {
    res.status(500).send('Error')
  }
}
