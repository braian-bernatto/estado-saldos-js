const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (authHeader) {
    // obtener el token
    const token = authHeader.split(' ')[1]

    // comprobar el jwt
    try {
      const usuario = jwt.verify(token, process.env.SECRETA)
      req.usuario = usuario
      return next()
    } catch (error) {
      console.log('Token no valido')
      console.log(error)
    }
  } else {
    res.status(400).json({ msg: 'No hay header' })
  }
}
