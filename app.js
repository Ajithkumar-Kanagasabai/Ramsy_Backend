const tracer = require('dd-trace').init({})
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const helmet = require('helmet')
const nocache = require('nocache')
require('dotenv').config()

const userRoutes = require('./routes/Users')

const log = require('./helpers/logger')
// const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')
// const swaggerFile = require('./swagger_output.json')

const app = express()

const startApp = async () => {
    try {
        //connect to db
        await mongoose.connect(process.env.DB)
        console.log('Connection has been established successfully.')

        //middlewares
        app.use(express.json())
        app.use(cors())
        app.use(helmet())
        app.use(nocache())
        // app.use(
        //     jwt({
        //         secret: Buffer.from(process.env.RSA_PRIVATE_KEY, 'base64'),
        //         algorithms: ['RS256'],
        //         getToken: function fromHeaderOrQuerystring(req) {
        //             if (
        //                 req.headers.authorization &&
        //                 req.headers.authorization.split(' ')[0] === 'Bearer'
        //             ) {
        //                 return req.headers.authorization.split(' ')[1]
        //             } else if (req.query && req.query.token) {
        //                 return req.query.token
        //             }
        //             return null
        //         },
        //     }).unless({
        //         custom: (req) => {
        //             let hasToken = false
        //             if (
        //                 req.headers.authorization &&
        //                 req.headers.authorization.split(' ')[0] === 'Bearer'
        //             ) {
        //                 hasToken = true
        //             } else if (req.query && req.query.token) {
        //                 hasToken = true
        //             }
        //             if (hasToken) {
        //                 return false
        //             }
        //             for (let path of constants.unprotectedPaths) {
        //                 path = path.replace(/:variable/g, '.*?')
        //                 const requestedResource = req.method + '-' + req.path
        //                 if (requestedResource.match(path)) {
        //                     return true
        //                 }
        //             }
        //             return false
        //         },
        //     })
        // )
        // // app.use(authMiddleWare)
        // app.use(function (err, req, res, next) {
        //     if (err.name === 'UnauthorizedError') {
        //         res.status(401).send({
        //             code: 401,
        //             result: err.message,
        //         })
        //     } else {
        //         next(err)
        //     }
        // })

        // app.use(testRoutes)
        // app.use(eventRoutes)
        // app.use(participationRoutes)
        app.use(userRoutes)
        // app.use(contactUsRoutes)
        // app.use(awsRoutes);
        app.get("/",(req, res)=>{
            res.status(200).send("Healthy")
        })
        // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    } catch (err) {
        log.logger('error', err.name, err.message, err.stack)
    }
}

startApp()

module.exports = { app, mongoose }
