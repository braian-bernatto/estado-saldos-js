const apiRouter = require('express').Router()
const authController = require('./controllers/authController')
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
const ordenController = require('./controllers/ordenController')
const facturaController = require('./controllers/facturaController')
const cors = require('cors')
const { check } = require('express-validator')
const auth = require('./middleware/auth')

apiRouter.use(cors())

apiRouter.get('/', (req, res) =>
  res.json('Your backend API is running successfully!!!')
)

// auth routes
apiRouter.post(
  '/auth',
  [
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty()
  ],
  authController.autenticarUsuario
)

// llamados routes
apiRouter.get('/licitaciones', auth, licitacionController.apiGetLicitaciones)
apiRouter.get(
  '/licitaciones/:id',
  auth,
  licitacionController.apiGetLicitacionByID
)
apiRouter.get(
  '/licitaciones/activo/:estado',
  auth,
  licitacionController.apiGetLicitacionesByEstado
)
apiRouter.get(
  '/licitaciones/search/:input',
  auth,
  licitacionController.apiGetLicitacionesBySearch
)

// contratos routes
apiRouter.get(
  '/licitaciones/:id/contratos',
  auth,
  contratoController.apiGetContratos
)
apiRouter.get(
  '/licitaciones/:id/contratos/:nro',
  auth,
  contratoController.apiGetContrato
)
apiRouter.get(
  '/licitaciones/:id/contratos/activo/:estado',
  auth,
  contratoController.apiGetContratoByEstado
)
apiRouter.get(
  '/licitaciones/:id/contratos/search/:input',
  auth,
  contratoController.apiGetContratosBySearch
)
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/detalle',
  auth,
  contratoController.apiGetContratoResumen
)

// ordenes routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/ordenes',
  auth,
  ordenController.apiGetOrdenes
)

// facturas routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/facturas',
  auth,
  facturaController.apiGetFacturas
)

module.exports = apiRouter
