const express = require('express')
const path = require('path')
const cors = require('cors')
const middleware = require('./utils/middleware')
const routes = require('./routes')
const app = express()

app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(express.static('build'))
app.use(cors())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.enable('trust proxy')

app.use(express.static(path.resolve(__dirname, '../client/build')))
Object.keys(routes).forEach(k => {
	app.use(`/api/${k}`, routes[k])
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
