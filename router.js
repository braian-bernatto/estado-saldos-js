const apiRouter = require('express').Router()
const authController = require('./controllers/authController')
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
const ordenController = require('./controllers/ordenController')
const facturaController = require('./controllers/facturaController')
const strController = require('./controllers/strController')
const notaCreditoController = require('./controllers/notaCreditoController')
const empresaController = require('./controllers/empresaController')
const nivelController = require('./controllers/nivelController')
const rubroController = require('./controllers/rubroController')
const tipoLicitacionController = require('./controllers/tipoLicitacionController')
const tipoContratoController = require('./controllers/tipoContratoController')
const tipoOrdenController = require('./controllers/tipoOrdenController')
const monedaController = require('./controllers/monedaController')
const dependenciaController = require('./controllers/dependenciaController')
const codigoController = require('./controllers/codigoController')
const adendaController = require('./controllers/adendaController')
const rolController = require('./controllers/rolController')
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
      .withMessage('El ID debe ser num??rico')
      .toInt(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de llamado es obligatorio')
      .isNumeric()
      .withMessage('El nro de llamado debe ser num??rico')
      .toInt(),
    check('year', 'El a??o es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .withMessage('La descripci??n es obligatoria')
      .isString()
      .withMessage('La descripci??n debe ser un string')
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
      .withMessage('El ID debe ser num??rico')
      .toInt(),
    check('nro')
      .not()
      .isEmpty()
      .withMessage('El nro de llamado es obligatorio')
      .isNumeric()
      .withMessage('El nro de llamado debe ser num??rico')
      .toInt(),
    check('year', 'El a??o es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .withMessage('La descripci??n es obligatoria')
      .isString()
      .withMessage('La descripci??n debe ser un string')
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
      .withMessage('El tipo debe ser num??rico')
      .toInt(),
    check('empresa')
      .not()
      .isEmpty()
      .withMessage('El empresa es obligatoria')
      .isNumeric()
      .withMessage('El empresa debe ser num??rica')
      .toInt(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
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
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('year', 'El a??o es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inv??lida'),
    check('fecha_vencimiento')
      .isDate()
      .withMessage('La fecha de vencimiento es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_minimo')
      .isNumeric()
      .withMessage('El monto m??nimo de contrato debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_maximo')
      .isNumeric()
      .withMessage('El monto m??ximo de contrato debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nro')
      .isNumeric()
      .withMessage('El nro de lote debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nombre')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.maximo')
      .isNumeric()
      .withMessage('El monto m??ximo de lote debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.minimo')
      .isNumeric()
      .withMessage('El monto m??nimo de lote debe ser num??rico')
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
      .withMessage('El tipo debe ser num??rico')
      .toInt(),
    check('empresa')
      .not()
      .isEmpty()
      .withMessage('El empresa es obligatoria')
      .isNumeric()
      .withMessage('El empresa debe ser num??rica')
      .toInt(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
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
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('year', 'El a??o es obligatorio').not().isEmpty().isNumeric().toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inv??lida'),
    check('fecha_vencimiento')
      .isDate()
      .withMessage('La fecha de vencimiento es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_minimo')
      .isNumeric()
      .withMessage('El monto m??nimo de contrato debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('monto_maximo')
      .isNumeric()
      .withMessage('El monto m??ximo de contrato debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nro')
      .isNumeric()
      .withMessage('El monto m??nimo de contrato debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.nombre')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.maximo')
      .isNumeric()
      .withMessage('El monto m??ximo de contrato debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.minimo')
      .isNumeric()
      .withMessage('El monto minimo de contrato debe ser num??rico')
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
apiRouter.post(
  '/licitaciones/:id/contratos/:nro/ordenes',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de orden debe ser un string')
      .toUpperCase(),
    check('year', 'El a??o de la orden es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o debe ser num??rico')
      .toInt(),
    check('tipo', 'El tipo de orden es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de orden debe ser num??rico')
      .toInt(),
    check('observacion')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('contrato_year', 'El a??o del contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o del contrato debe ser num??rico')
      .toInt(),
    check('tipo_contrato_id', 'El tipo de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de contrato debe ser num??rico')
      .toInt(),
    check('rubro_id', 'El rubro es obligatorio')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt(),
    check('fecha_emision')
      .isDate()
      .withMessage('La fecha de emisi??n es inv??lida'),
    check('fecha_recepcion')
      .isDate()
      .withMessage('La fecha de recepci??n es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat(),
    check('estado')
      .isString()
      .withMessage('El estado debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.lote_id')
      .isNumeric()
      .withMessage('El n??mero de lote debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  ordenController.apiAddOrden
)
apiRouter.put(
  '/contratos/:nroContrato/:contratoYear/:contratoTipo/ordenes/:nroOrden/:ordenYear/:ordenTipo',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de orden debe ser un string')
      .toUpperCase(),
    check('year', 'El a??o de la orden es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o debe ser num??rico')
      .toInt(),
    check('tipo', 'El tipo de orden es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de orden debe ser num??rico')
      .toInt(),
    check('observacion')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('contrato_year', 'El a??o del contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o del contrato debe ser num??rico')
      .toInt(),
    check('tipo_contrato_id', 'El tipo de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de contrato debe ser num??rico')
      .toInt(),
    check('rubro_id', 'El rubro es obligatorio')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt(),
    check('fecha_emision')
      .isDate()
      .withMessage('La fecha de emisi??n es inv??lida'),
    check('fecha_recepcion')
      .isDate()
      .withMessage('La fecha de recepci??n es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat(),
    check('estado')
      .isString()
      .withMessage('El estado debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.lote_id')
      .isNumeric()
      .withMessage('El n??mero de lote debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  ordenController.apiUpdateOrden
)
apiRouter.delete(
  '/contratos/:nroContrato/:contratoYear/:contratoTipo/ordenes/:nroOrden/:ordenYear/:ordenTipo',
  auth,
  ordenController.apiDeleteOrden
)

// facturas routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/facturas',
  auth,
  facturaController.apiGetFacturas
)
apiRouter.get(
  '/factura/:nro/:timbrado',
  auth,
  facturaController.apiCheckFacturaNro
)
apiRouter.get(
  '/factura/:nro/:timbrado/saldo',
  auth,
  facturaController.apiCheckFacturaSaldo
)
apiRouter.post(
  '/licitaciones/:id/contratos/:nro/facturas',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de orden debe ser un string')
      .toUpperCase(),
    check('timbrado', 'El timbrado es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('contrato_year', 'El a??o del contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o del contrato debe ser num??rico')
      .toInt(),
    check('tipo_contrato_id', 'El tipo de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de contrato debe ser num??rico')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('vencimientoTimbrado')
      .isDate()
      .withMessage('La fecha de vencimiento de timbrado es inv??lida'),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
  ],
  facturaController.apiAddFactura
)
apiRouter.put(
  '/facturas/:nro/:timbrado',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de orden debe ser un string')
      .toUpperCase(),
    check('timbrado', 'El timbrado es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nro de contrato debe ser num??rico')
      .toInt(),
    check('contrato_year', 'El a??o del contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o del contrato debe ser num??rico')
      .toInt(),
    check('tipo_contrato_id', 'El tipo de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El tipo de contrato debe ser num??rico')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('vencimientoTimbrado')
      .isDate()
      .withMessage('La fecha de vencimiento de timbrado es inv??lida'),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
  ],
  facturaController.apiUpdateFactura
)
apiRouter.delete(
  '/facturas/:nro/:timbrado',
  auth,
  facturaController.apiDeleteFactura
)

//str routes
apiRouter.get('/str/:nro/:year', auth, strController.apiCheckStrNro)
apiRouter.post(
  '/str',
  auth,
  [
    check('nro', 'El N?? de STR es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El N?? de STR debe ser num??rico')
      .toInt(),
    check('year', 'El a??o de la STR es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o debe ser num??rico')
      .toInt(),
    check('moneda', 'La moneda es obligatoria')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('fechaDeposito')
      .isDate()
      .withMessage('La fecha de dep??sito es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.facturaNro')
      .isString()
      .withMessage('El N?? de factura debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.timbrado')
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  strController.apiAddStr
)
apiRouter.put(
  '/str/:nro/:year',
  auth,
  [
    check('nro', 'El N?? de STR es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El N?? de STR debe ser num??rico')
      .toInt(),
    check('year', 'El a??o de la STR es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El a??o debe ser num??rico')
      .toInt(),
    check('moneda', 'La moneda es obligatoria')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('fechaDeposito')
      .isDate()
      .withMessage('La fecha de dep??sito es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.facturaNro')
      .isString()
      .withMessage('El N?? de factura debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.timbrado')
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('facturas.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  strController.apiUpdateStr
)
apiRouter.delete('/str/:nro/:year', auth, strController.apiDeleteStr)

// notas credito routes
apiRouter.get(
  '/licitaciones/:id/contratos/:nro/nota-credito',
  auth,
  notaCreditoController.apiGetNotasCredito
)
apiRouter.get(
  '/nota-credito/:nro/:timbrado',
  auth,
  notaCreditoController.apiCheckNotaCreditoNro
)
apiRouter.post(
  '/factura/:nro/:timbrado/nota-credito',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de factura debe ser un string')
      .toUpperCase(),
    check('timbrado', 'El timbrado es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('nroFactura')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de factura debe ser un string')
      .toUpperCase(),
    check('timbradoFactura', 'El timbrado de factura es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('vencimientoTimbrado')
      .isDate()
      .withMessage('La fecha de vencimiento de timbrado es inv??lida'),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
  ],
  notaCreditoController.apiAddNotaCredito
)
apiRouter.put(
  '/factura/:nro/:timbrado/nota-credito/:nroNotaCredito/:timbradoNotaCredito',
  auth,
  [
    check('nro')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de factura debe ser un string')
      .toUpperCase(),
    check('timbrado', 'El timbrado es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('nroFactura')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nro de factura debe ser un string')
      .toUpperCase(),
    check('timbradoFactura', 'El timbrado de factura es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El timbrado debe ser num??rico')
      .toInt(),
    check('fecha').isDate().withMessage('La fecha de emisi??n es inv??lida'),
    check('vencimientoTimbrado')
      .isDate()
      .withMessage('La fecha de vencimiento de timbrado es inv??lida'),
    check('monto')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
  ],
  notaCreditoController.apiUpdateNotaCredito
)
apiRouter.delete(
  '/nota-credito/:nro/:timbrado',
  auth,
  notaCreditoController.apiDeleteNotaCredito
)

// empresa routes
apiRouter.get('/empresa', auth, empresaController.apiGetEmpresas)
apiRouter.get('/empresa/:ruc', auth, empresaController.apiCheckRuc)
apiRouter.post(
  '/empresa',
  auth,
  [
    check('ruc')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El ruc debe ser un string')
      .toUpperCase(),
    check('nombre_fantasia')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nombre debe ser un string'),
    check('representante')
      .isString()
      .withMessage('El representante debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('telefono')
      .isString()
      .withMessage('El tel??fono debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('direccion')
      .isString()
      .withMessage('La direcci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('email')
      .isEmail()
      .withMessage('Email no v??lido')
      .optional({ nullable: true, checkFalsy: true })
  ],
  empresaController.apiAddEmpresa
)
apiRouter.put(
  '/empresa/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('ruc')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El ruc debe ser un string')
      .toUpperCase(),
    check('nombre_fantasia')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nombre debe ser un string'),
    check('representante')
      .isString()
      .withMessage('El representante debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('telefono')
      .isString()
      .withMessage('El tel??fono debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('direccion')
      .isString()
      .withMessage('La direcci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('email')
      .isEmail()
      .withMessage('Email no v??lido')
      .optional({ nullable: true, checkFalsy: true })
  ],
  empresaController.apiUpdateEmpresa
)
apiRouter.delete('/empresa/:id', auth, empresaController.apiDeleteEmpresa)

// nivel routes
apiRouter.get('/nivel', auth, nivelController.apiGetNiveles)
apiRouter.get('/nivel/:nro', auth, nivelController.apiCheckNivel)
apiRouter.post(
  '/nivel',
  auth,
  [
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nivel debe ser un string')
      .toUpperCase()
  ],
  nivelController.apiAddNivel
)
apiRouter.put(
  '/nivel/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nivel debe ser un string')
      .toUpperCase()
  ],
  nivelController.apiUpdateNivel
)
apiRouter.delete('/nivel/:id', auth, nivelController.apiDeleteNivel)

// rubro routes
apiRouter.get('/rubro', auth, rubroController.apiGetRubros)
apiRouter.get('/rubro/:nro', auth, rubroController.apiCheckRubro)
apiRouter.post(
  '/rubro',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('nivel_id', 'El nivel es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nivel debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El nivel debe ser un string')
      .toUpperCase()
  ],
  rubroController.apiAddRubro
)
apiRouter.put(
  '/rubro/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('nivel_id', 'El nivel es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El nivel debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El Nivel debe ser un string')
      .toUpperCase()
  ],
  rubroController.apiUpdateRubro
)
apiRouter.delete('/rubro/:id', auth, rubroController.apiDeleteRubro)

// tipo-licitacion routes
apiRouter.get(
  '/tipo-licitacion',
  auth,
  tipoLicitacionController.apiGetTipoLicitaciones
)
apiRouter.get(
  '/tipo-licitacion/:tipo',
  auth,
  tipoLicitacionController.apiCheckTipoLicitacion
)
apiRouter.post(
  '/tipo-licitacion',
  auth,
  [
    check('siglas')
      .not()
      .isEmpty()
      .isString()
      .withMessage('Las siglas deben ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo licitacion debe ser un string')
      .toUpperCase()
  ],
  tipoLicitacionController.apiAddTipoLicitacion
)
apiRouter.put(
  '/tipo-licitacion/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('siglas')
      .not()
      .isEmpty()
      .isString()
      .withMessage('Las siglas deben ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo licitacion debe ser un string')
      .toUpperCase()
  ],
  tipoLicitacionController.apiUpdateTipoLicitacion
)
apiRouter.delete(
  '/tipo-licitacion/:id',
  auth,
  tipoLicitacionController.apiDeleteTipoLicitacion
)

// tipo-contrato routes
apiRouter.get(
  '/tipo-contrato',
  auth,
  tipoContratoController.apiGetTipoContratos
)
apiRouter.get(
  '/tipo-contrato/:tipo',
  auth,
  tipoContratoController.apiCheckTipoContrato
)
apiRouter.post(
  '/tipo-contrato',
  auth,
  [
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo contrato debe ser un string')
      .toUpperCase()
  ],
  tipoContratoController.apiAddTipoContrato
)
apiRouter.put(
  '/tipo-contrato/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo contrato debe ser un string')
      .toUpperCase()
  ],
  tipoContratoController.apiUpdateTipoContrato
)
apiRouter.delete(
  '/tipo-contrato/:id',
  auth,
  tipoContratoController.apiDeleteTipoContrato
)

// tipo-ordenes routes
apiRouter.get('/tipo-orden', auth, tipoOrdenController.apiGetTipoOrdenes)
apiRouter.get('/tipo-orden/:tipo', auth, tipoOrdenController.apiCheckTipoOrden)
apiRouter.post(
  '/tipo-orden',
  auth,
  [
    check('descripcion', 'La descripci??n es obligatoria')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo contrato debe ser un string')
      .toUpperCase()
  ],
  tipoOrdenController.apiAddTipoOrden
)
apiRouter.put(
  '/tipo-orden/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El tipo contrato debe ser un string')
      .toUpperCase()
  ],
  tipoOrdenController.apiUpdateTipoOrden
)
apiRouter.delete(
  '/tipo-orden/:id',
  auth,
  tipoOrdenController.apiDeleteTipoOrden
)

// moneda routes
apiRouter.get('/moneda', auth, monedaController.apiGetMonedas)
apiRouter.get('/moneda/:nombre', auth, monedaController.apiCheckMoneda)
apiRouter.post(
  '/moneda',
  auth,
  [
    check('simbolo', 'El simbolo es obligatorio')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El s??mbolo deben ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('La moneda debe ser un string')
      .toUpperCase()
  ],
  monedaController.apiAddMoneda
)
apiRouter.put(
  '/moneda/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('simbolo', 'El simbolo es obligatorio')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El s??mbolo deben ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('La moneda debe ser un string')
      .toUpperCase()
  ],
  monedaController.apiUpdateMoneda
)
apiRouter.delete('/moneda/:id', auth, monedaController.apiDeleteMoneda)

// dependencia routes
apiRouter.get('/dependencia', auth, dependenciaController.apiGetDependencias)
apiRouter.get(
  '/dependencia/:id',
  auth,
  dependenciaController.apiCheckDependencia
)
apiRouter.post(
  '/dependencia',
  auth,
  [
    check('id', 'El ID es obligatorio')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El ID debe ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El Dependencia debe ser un string')
      .toUpperCase()
  ],
  dependenciaController.apiAddDependencia
)
apiRouter.put(
  '/dependencia/:id',
  auth,
  [
    check('id', 'El ID es obligatorio')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El ID debe ser un string')
      .toUpperCase(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El Dependencia debe ser un string')
      .toUpperCase()
  ],
  dependenciaController.apiUpdateDependencia
)
apiRouter.delete(
  '/dependencia/:id',
  auth,
  dependenciaController.apiDeleteDependencia
)

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
      .withMessage('La descripci??n debe ser un string')
      .toUpperCase(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
      .toInt(),
    check('obervaciones')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt(),
    check('rubros.*.monto')
      .not()
      .isEmpty()
      .withMessage('El monto es obligatorio')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
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
      .withMessage('La descripci??n debe ser un string')
      .toUpperCase(),
    check('moneda')
      .not()
      .isEmpty()
      .withMessage('La moneda es obligatoria')
      .isNumeric()
      .withMessage('La moneda debe ser num??rica')
      .toInt(),
    check('obervaciones')
      .isString()
      .withMessage('La descripci??n debe ser un string')
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .not()
      .isEmpty()
      .withMessage('El rubro es obligatorio')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt(),
    check('rubros.*.monto')
      .not()
      .isEmpty()
      .withMessage('El monto es obligatorio')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
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
apiRouter.post(
  '/contratos/:nroContrato/:year/:tipo/adenda',
  auth,
  [
    check('nro', 'El nro de adenda es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('codigo')
      .isString()
      .withMessage('El nro de C.C. debe ser un string')
      .toUpperCase()
      .optional({ nullable: true, checkFalsy: true }),
    check('observaciones')
      .isString()
      .withMessage('La observaci??n debe ser un string')
      .toUpperCase()
      .optional({ nullable: true, checkFalsy: true }),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('contrato_year', 'El a??o es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('tipo_contrato_id')
      .not()
      .isEmpty()
      .withMessage('El tipo es obligatorio')
      .isNumeric()
      .withMessage('El tipo debe ser num??rico')
      .toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inv??lida'),
    check('fecha_ampliada')
      .isDate()
      .withMessage('La fecha de ampliada es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('disminucion')
      .not()
      .isEmpty()
      .withMessage('Se debe especificar si es una adenda de disminuci??n')
      .isBoolean()
      .toBoolean(),
    check('monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.lote_id')
      .isNumeric()
      .withMessage('El n??mero de lote debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  adendaController.apiAddAdenda
)
apiRouter.put(
  '/contratos/:nroContrato/:year/:tipo/adenda/:nroAdenda',
  auth,
  [
    check('nro', 'El nro de adenda es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('codigo')
      .isString()
      .withMessage('El nro de C.C. debe ser un string')
      .toUpperCase()
      .optional({ nullable: true, checkFalsy: true }),
    check('observaciones')
      .isString()
      .withMessage('La observaci??n debe ser un string')
      .toUpperCase()
      .optional({ nullable: true, checkFalsy: true }),
    check('contrato_nro', 'El nro de contrato es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('contrato_year', 'El a??o es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .toInt(),
    check('tipo_contrato_id')
      .not()
      .isEmpty()
      .withMessage('El tipo es obligatorio')
      .isNumeric()
      .withMessage('El tipo debe ser num??rico')
      .toInt(),
    check('fecha_firma').isDate().withMessage('La fecha de firma es inv??lida'),
    check('fecha_ampliada')
      .isDate()
      .withMessage('La fecha de ampliada es inv??lida')
      .optional({ nullable: true, checkFalsy: true }),
    check('disminucion')
      .not()
      .isEmpty()
      .withMessage('Se debe especificar si es una adenda de disminuci??n')
      .isBoolean()
      .toBoolean(),
    check('monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.lote_id')
      .isNumeric()
      .withMessage('El n??mero de lote debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('lotes.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.nro')
      .isNumeric()
      .withMessage('El rubro debe ser num??rico')
      .toInt()
      .optional({ nullable: true, checkFalsy: true }),
    check('rubros.*.monto')
      .isNumeric()
      .withMessage('El monto debe ser num??rico')
      .toFloat()
      .optional({ nullable: true, checkFalsy: true })
  ],
  adendaController.apiUpdateAdenda
)
apiRouter.delete(
  '/contratos/:nroContrato/:year/:tipo/adenda/:nroAdenda',
  auth,
  adendaController.apiDeleteAdenda
)

// rol routes
apiRouter.get('/rol', auth, rolController.apiGetRoles)
apiRouter.get('/rol/:nro', auth, rolController.apiCheckRol)
apiRouter.post(
  '/rol',
  auth,
  [
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El rol debe ser un string')
      .toLowerCase()
  ],
  rolController.apiAddRol
)
apiRouter.put(
  '/rol/:id',
  auth,
  [
    check('id', 'El id es obligatorio')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('El id debe ser num??rico')
      .toInt(),
    check('descripcion')
      .not()
      .isEmpty()
      .isString()
      .withMessage('El rol debe ser un string')
      .toLowerCase()
  ],
  rolController.apiUpdateRol
)
apiRouter.delete('/rol/:id', auth, rolController.apiDeleteRol)

module.exports = apiRouter
