const express = require('express')
const morgan = require('morgan')

//express app
const app = express()

//development tool for the request log
app.use(morgan('dev'))

//serving the static files
app.use(express.static('public'))


module.exports = app;