const express = require('express')

const app = express()

app.use(express.static('public'))

app.get('*', (req, res) => {
    res.end("Hello From Digital Business Cards")
})

module.exports = app;