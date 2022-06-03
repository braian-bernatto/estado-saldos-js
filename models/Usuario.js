const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let Usuario = function (data) {
  this.data = data
}

Usuario.verificarUsuario = async function (email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // revisar si existe usuario
      let usuario = await pool.query(
        `select * from usuario natural join rol where usuario_email ilike '${email}'`
      )

      // console.log(usuario)
      if (!usuario.length) {
        resolve({ msg: 'El usuario no existe' })
        // retorno null para que no se siga ejecutando los codigos siguientes
        return null
      } else {
        // verificar  el password y autenticar al usuario
        if (bcrypt.compareSync(password, usuario[0].usuario_password)) {
          // crear JWT
          const token = jwt.sign(
            {
              nombre: usuario[0].usuario_nombre,
              email: usuario[0].usuario_email,
              rol: usuario[0].rol_nombre
            },
            process.env.SECRETA,
            {
              expiresIn: '24h'
            }
          )
          resolve({ token })
        } else {
          resolve({ msg: 'Password Incorrecto' })
          return null
        }
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Usuario
