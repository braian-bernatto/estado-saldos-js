const apiRouter = require('express').Router()
const authController = require('./controllers/authController')
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
const ordenController = require('./controllers/ordenController')
const facturaController = require('./controllers/facturaController')
const notaCreditoController = require('./controllers/notaCreditoController')
const empresaController = require('./controllers/empresaController')
const nivelController = require('./controllers/nivelController')
const rubroController = require('./controllers/rubroController')
const tipoLicitacionController = require('./controllers/tipoLicitacionController')
const tipoContratoController = require('./controllers/tipoContratoController')
const tipoOrdenController = require('./controllers/tipoOrdenController')
const monedaController = require('./controllers/monedaController')
const codigoController = require('./controllers/codigoController')
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
apiRouter.get('/orden/:nro/:tipo/:year', auth, ordenController.apiCheckOrdenNro)
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

// notas credito routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/nota-credito',
  auth,
  notaCreditoController.apiGetNotasCredito
)

// empresa routes
apiRouter.get('/empresa', auth, empresaController.apiGetEmpresas)

// nivel routes
apiRouter.get('/nivel', auth, nivelController.apiGetNiveles)

// rubro routes
apiRouter.get('/rubro', auth, rubroController.apiGetRubros)

// tipo-licitacion routes
apiRouter.get(
  '/tipo-licitacion',
  auth,
  tipoLicitacionController.apiGetTipoLicitaciones
)

// tipo-contrato routes
apiRouter.get(
  '/tipo-contrato',
  auth,
  tipoContratoController.apiGetTipoContratos
)

// tipo-ordenes routes
apiRouter.get('/tipo-orden', auth, tipoOrdenController.apiGetTipoOrdenes)

// moneda routes
apiRouter.get('/moneda', auth, monedaController.apiGetMonedas)

// codigo contratacion routes
apiRouter.get('/codigo-contratacion', auth, codigoController.apiGetCodigos)
apiRouter.get(
  '/codigo-contratacion/:contrato/:year/:tipoContrato',
  auth,
  codigoController.apiGetCodigoById
)

module.exports = apiRouter