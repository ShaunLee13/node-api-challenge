const express = require('express')
const helmet = require('helmet')

const projectRouter = require('./routers/projectRouter')

const server = express()

server.use(express.json())
server.use(helmet())
server.use(logger)

server.get('/', (req, res) => {
    res.send("Welcome to the API, user")
})

server.use('/projects', projectRouter)

//Logger Middleware
function logger(req, res, next) {
    console.log(`A ${req.method} was made to ${req.url} at ${Date()}`)
    next()
  }

module.exports = server