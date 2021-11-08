const apiRouter = require('express').Router()
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
const ordenController = require('./controllers/ordenController')
const facturaController = require('./controllers/facturaController')
const cors = require('cors')

apiRouter.use(cors())

apiRouter.get('/', (req, res) => res.json('Your backend API is running successfully!!!'))

// llamados routes
apiRouter.get('/licitaciones', licitacionController.apiGetLicitaciones)
apiRouter.get('/licitaciones/:id', licitacionController.apiGetLicitacionByID)
apiRouter.get('/licitaciones/activo/:estado', licitacionController.apiGetLicitacionesByEstado)
apiRouter.get('/licitaciones/search/:input', licitacionController.apiGetLicitacionesBySearch)

// contratos routes
apiRouter.get('/licitaciones/:id/contratos', contratoController.apiGetContratos)
apiRouter.get('/licitaciones/:id/contratos/:nro', contratoController.apiGetContrato)
apiRouter.get('/licitaciones/:id/contratos/activo/:estado', contratoController.apiGetContratoByEstado)
apiRouter.get('/licitaciones/:id/contratos/search/:input', contratoController.apiGetContratosBySearch)
apiRouter.get('/licitaciones/:id/contratos/:nro/detalle', contratoController.apiGetContratoResumen)

// ordenes routes
apiRouter.get('/licitaciones/:id/contratos/:nro/ordenes', ordenController.apiGetOrdenes)

// facturas routes
apiRouter.get('/licitaciones/:id/contratos/:nro/facturas', facturaController.apiGetFacturas)

module.exports = apiRouter