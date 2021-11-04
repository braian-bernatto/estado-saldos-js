const apiRouter = require('express').Router()
const licitacionController = require('./controllers/licitacionController')
const cors = require('cors')

apiRouter.use(cors())

apiRouter.get('/', (req, res) => res.json('Your backend API is running successfully!!!'))

// llamados routes
apiRouter.get('/licitaciones', licitacionController.apiGetLicitaciones)
apiRouter.get('/licitaciones/:id', licitacionController.apiGetLicitacionByID)
apiRouter.get('/licitaciones/activo/:estado', licitacionController.apiGetLicitacionesByEstado)


module.exports = apiRouter