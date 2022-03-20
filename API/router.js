const apiRouter = require('express').Router()
const authController = require('./controllers/authController')
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
const ordenController = require('./controllers/ordenController')
const facturaController = require('./controllers/facturaController')
const empresaController = require('./controllers/empresaController')
const nivelController = require('./controllers/nivelController')
const modalidadController = require('./controllers/modalidadController')
const cors = require('cors')
const { check } = require('express-validator')
const auth = require('./middleware/auth')

// habilitando cors
const opcionesCors = {
  origin: process.env.FRONTEND_URL
}
apiRouter.use(cors(opcionesCors))

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
apiRouter.get('/auth', auth, authController.usuarioAutenticado)

// llamados routes
apiRouter.get('/licitaciones', auth, licitacionController.apiGetLicitaciones)
apiRouter.get(
  '/licitaciones/enlaces',
  licitacionController.apiGetLicitacionesEnlaces
)
apiRouter.get('/licitaciones/:id', licitacionController.apiGetLicitacionByID)
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
  '/licitaciones/contratos/enlaces',
  contratoController.apiGetContratosEnlaces
)
apiRouter.get(
  '/licitaciones/:id/contratos/:nro',
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
apiRouter.put(
  '/licitaciones/:id/contratos/:nro/finalizar/:estado',
  auth,
  contratoController.apiFinalizarContrato
)

// ordenes routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/ordenes',
  auth,
  ordenController.apiGetOrdenes
)
apiRouter.get(
  '/licitaciones/ordenes/enlaces',
  ordenController.apiGetOrdenesEnlaces
)

// facturas routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/facturas',
  auth,
  facturaController.apiGetFacturas
)

// empresa routes
apiRouter.get('/empresa', auth, empresaController.apiGetEmpresas)

// nivel routes
apiRouter.get('/nivel', auth, nivelController.apiGetNiveles)

// modalidad routes
apiRouter.get('/modalidad', auth, modalidadController.apiGetModalidades)

module.exports = apiRouter
