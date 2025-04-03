const express = require('express')
const morgan = require('morgan')

//express app
const app = express()

//development tool for the request log
app.use(morgan('dev'))

//serving the static files
app.use(express.static('public'))

//routes

//CARDS
// api/v1/cards         GET
// api/v1/cards/:id     GET (one)
// api/v1/cards         POST
// api/v1/cards/:id     PATCH
// api/v1/cards/:id     DELETE



module.exports = app;