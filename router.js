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
const adendaController = require('./controllers/adendaController')
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

// licitaciones routes
apiRouter.get('/licitaciones', auth, licitacionController.apiGetLicitaciones)
apiRouter.get(
  '/licitaciones/enlaces',
  licitacionController.apiGetLicitacionesEnlaces
)
apiRouter.get('/licitaciones/:id', licitacionController.apiGetLicitacionByID)
apiRouter.get(
  '/licitaciones/check/:id',
  licitacionController.apiCheckLicitacionId
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
apiRouter.post(
  '/licitaciones',
  auth,
  [
    check('id', 'El ID es obligatorio').not().isEmpty().isNumeric(),
    check('tipo_id')
      .not()
      .isEmpty()
      .withMessage('El ID es obligatorio')
      .isNumeric()
      .withMessage('El ID debe ser numérico')
      .toInt(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de llamado es obligatorio')
      .isNumeric()
      .withMessage('El nro de llamado debe ser numérico')
      .toInt(),
    check('year', 'El año es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .withMessage('La descripción es obligatoria')
      .isString()
      .withMessage('La descripción debe ser un string')
      .trim()
  ],
  licitacionController.apiAddLicitacion
)
apiRouter.put(
  '/licitaciones/:id',
  auth,
  [
    check('id', 'El ID es obligatorio').not().isEmpty().isNumeric(),
    check('tipo_id')
      .not()
      .isEmpty()
      .withMessage('El ID es obligatorio')
      .isNumeric()
      .withMessage('El ID debe ser numérico')
      .toInt(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de llamado es obligatorio')
      .isNumeric()
      .withMessage('El nro de llamado debe ser numérico')
      .toInt(),
    check('year', 'El año es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .withMessage('La descripción es obligatoria')
      .isString()
      .withMessage('La descripción debe ser un string')
      .trim()
  ],
  licitacionController.apiUpdateLicitacion
)
apiRouter.delete(
  '/licitaciones/:id',
  auth,
  licitacionController.apiDeleteLicitacion
)

// contratos routes
apiRouter.get(
  '/licitaciones/:id/contratos',
  auth,
  contratoController.apiGetContratos
)
apiRouter.get(
  '/contrato/:nro/:tipo/:year',
  auth,
  contratoController.apiCheckContratoNro
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
apiRouter.post(
  '/licitaciones/:id',
  auth,
  [
    check('licitacion_id', 'El ID es obligatorio').not().isEmpty().isNumeric(),
    check('tipo')
      .not()
      .isEmpty()
      .withMessage('El tipo es obligatorio')
      .isNumeric()
      .withMessage('El tipo debe ser numérico')
      .toInt(),
    check('empresa')
      .not()
      .isEmpty()
      .withMessage('El empresa es obligatoria')
      .isNumeric()
      .withMessage('El empresa debe ser numérica')
      .toInt(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser numérica')
      .toInt(),
    check('activo')
      .not()
      .isEmpty()
      .withMessage('El estado del contrato es obligatorio')
      .isBoolean()
      .toBoolean(),
    check('cumplimiento')
      .not()
      .isEmpty()
      .withMessage('El vencimiento es obligatorio')
      .isBoolean()
      .toBoolean(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de contrato es obligatorio')
      .isNumeric()
      .withMessage('El nro de contrato debe ser numérico')
      .toInt(),
    check('year', 'El año es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inválida'),
    check('fecha_vencimiento')
      .isDate()
      .withMessage('La fecha de vencimiento es inválida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_minimo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_maximo')
      .isNumeric()
      .withMessage('El monto maximo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nro')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nombre')
      .isString()
      .withMessage('La descripción debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.maximo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.minimo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  contratoController.apiAddContrato
)
apiRouter.put(
  '/licitaciones/:id/contratos/:nro/',
  auth,
  [
    check('licitacion_id', 'El ID es obligatorio').not().isEmpty().isNumeric(),
    check('tipo')
      .not()
      .isEmpty()
      .withMessage('El tipo es obligatorio')
      .isNumeric()
      .withMessage('El tipo debe ser numérico')
      .toInt(),
    check('empresa')
      .not()
      .isEmpty()
      .withMessage('El empresa es obligatoria')
      .isNumeric()
      .withMessage('El empresa debe ser numérica')
      .toInt(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser numérica')
      .toInt(),
    check('activo')
      .not()
      .isEmpty()
      .withMessage('El estado del contrato es obligatorio')
      .isBoolean()
      .toBoolean(),
    check('cumplimiento')
      .not()
      .isEmpty()
      .withMessage('El vencimiento es obligatorio')
      .isBoolean()
      .toBoolean(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de contrato es obligatorio')
      .isNumeric()
      .withMessage('El nro de contrato debe ser numérico')
      .toInt(),
    check('year', 'El año es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inválida'),
    check('fecha_vencimiento')
      .isDate()
      .withMessage('La fecha de vencimiento es inválida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_minimo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_maximo')
      .isNumeric()
      .withMessage('El monto maximo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nro')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nombre')
      .isString()
      .withMessage('La descripción debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.maximo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.minimo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser numérico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  contratoController.apiUpdateContrato
)
apiRouter.delete(
  '/licitaciones/:id/contratos/:nro/:year/:tipo',
  auth,
  contratoController.apiDeleteContrato
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
  '/codigo-contratacion/:id',
  auth,
  codigoController.apiGetCodigoById
)
apiRouter.get(
  '/codigo-contratacion/:contrato/:year/:tipoContrato',
  auth,
  codigoController.apiGetCodigoByContrato
)
apiRouter.post(
  '/codigo-contratacion/:contrato/:year/:tipoContrato',
  auth,
  [
    check('id')
      .not()
      .isEmpty()
      .isString()
      .withMessage('La descripción debe ser un string')
      .toUpperCase(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser numérica')
      .toInt(),
    check('obervaciones')
      .isString()
      .withMessage('La descripción debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser numérico')
      .toInt(),
    check('rubros.*.monto')
      .not()
      .isEmpty()
      .withMessage('El monto es obligatorio')
      .isNumeric()
      .withMessage('El monto debe ser numérico')
      .toFloat()
  ],
  codigoController.apiAddCodigo
)
apiRouter.put(
  '/codigo-contratacion/:contrato/:year/:tipoContrato',
  auth,
  [
    check('id')
      .not()
      .isEmpty()
      .isString()
      .withMessage('La descripción debe ser un string')
      .toUpperCase(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser numérica')
      .toInt(),
    check('obervaciones')
      .isString()
      .withMessage('La descripción debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser numérico')
      .toInt(),
    check('rubros.*.monto')
      .not()
      .isEmpty()
      .withMessage('El monto es obligatorio')
      .isNumeric()
      .withMessage('El monto debe ser numérico')
      .toFloat()
  ],
  codigoController.apiUpdateCodigo
)
apiRouter.delete(
  '/codigo-contratacion/:id',
  auth,
  codigoController.apiDeleteCodigo
)

// adenda routes
apiRouter.get(
  '/contratos/:nroContrato/:year/:tipo/adenda/:nroAdenda',
  auth,
  adendaController.apiCheckAdendaNro
)

module.exports = apiRouter
