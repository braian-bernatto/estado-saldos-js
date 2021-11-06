const apiRouter = require('express').Router()
const licitacionController = require('./controllers/licitacionController')
const contratoController = require('./controllers/contratoController')
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


module.exports = apiRouter