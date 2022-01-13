const express = require('express')
const app = express()
const sanitizeHTML = require('sanitize-html')
const jwt = require('jsonwebtoken')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', require('./router'))

const server = require('http').createServer(app)

app.listen(process.env.PORT, function () {
  console.log(`Server is running on port ${process.env.PORT}`)
})

module.exports = server
