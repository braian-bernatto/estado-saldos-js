const { validationResult } = require('express-validator')
const Usuario = require('../models/Usuario')

exports.autenticarUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  // extraer email y password
  const { email, password } = req.body

  try {
    // revisar que sea un usuario registrado y generar token
    let respuesta = await Usuario.verificarUsuario(email, password)
    if (respuesta.token) {
      return res.send(respuesta)
    } else {
      return res.status(400).send(respuesta)
    }
  } catch (error) {
    console.log(error)
  }
}
