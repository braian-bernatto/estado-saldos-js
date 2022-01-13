const pool = require('../db')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

let Usuario = function (data) {
  this.data = data
}

Usuario.verificarUsuario = async function (email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // revisar si existe usuario
      let usuario = await pool.query(
        `select * from usuario where usuario_email ilike '${email}'`
      )

      // console.log(usuario)
      if (!usuario.length) {
        resolve({ msg: 'El usuario no existe' })
        // retorno null para que no se siga ejecutando los codigos siguientes
        return null
      } else {
        // revisamos el password
        const passCorrecto = await bcryptjs.compare(
          password,
          usuario[0].usuario_password
        )

        if (!passCorrecto) {
          resolve({ msg: 'Password Incorrecto' })
          return null
        }

        // si todo es correcto crear y firmar el jwt
        const payload = {
          usuario: {
            email: usuario[0].usuario_email
          }
        }
        // firmar el jwt
        jwt.sign(
          payload,
          process.env.SECRETA,
          {
            expiresIn: '24h'
          },
          (error, token) => {
            if (error) {
              reject()
              throw error
            }
            // mensaje de confirmacion
            resolve({ token })
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = Usuario
