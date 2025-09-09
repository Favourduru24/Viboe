require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOption = require('./config/corsOption')
const rateLimit = require('express-rate-limit')
const {logger, logEvent} = require('./middleware/logger')
const errorMiddleware = require('./middleware/errorHandler')
const helmet = require('helmet')
const proxy = require('express-http-proxy')
const verifyJwt = require('./middleware/verifyJwt')
const PORT = process.env.PORT || 3001

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOption))
app.use(helmet())
app.use(logger)

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 100, // Limit each IP to 10 requests per `window` per 15 minute
    message:
        { message: 'Too many request from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => {
        logEvent(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t`, 'rateLimiter.log')
        res.status(options.statusCode).send(options.message)
        next()
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

 app.use(routeLimiter)

  const proxyOptions = {
     proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, "/api")
     },
     proxyErrorHandler: (err, res, next) => {
        logEvent(`Proxy error: ${err.message}`, 'errLog.log'),
        res.status(500).json({
            message: 'Internal proxy server error', error: err.message
        })
     } 
  }

  app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts
    },
    userResDecorator: (proxyRes, proxyResData, userReq) => {
        console.log(`Response recieved from identity service: ${proxyRes.statusCode}`)
        return proxyResData
    }
  }))

  app.use('/v1/user', proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts
    },
    userResDecorator: (proxyRes, proxyResData, userReq) => {
        console.log(`Response recieved from identity service: ${proxyRes.statusCode}`)
        return proxyResData
    }
  }))

   app.use('/v1/video', proxy(process.env.UPLOAD_SERVICE_URL, {
     ...proxyOptions,
     proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
  proxyReqOpts.headers['authorization'] = srcReq.headers.authorization;
  return proxyReqOpts;
},
     userResDecorator: (proxyRes, proxyResData, userReq) => {
        console.log(`Response recieved from upload service: ${proxyRes.statusCode}`)
        return proxyResData
    }
   }))

   app.use('/v1/upload',  proxy(process.env.Upload_File, {
    ...proxyOptions,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // proxyReqOpts.headers['x-user-id'] = srcReq.user.userId // Updated to use user object
        if(!srcReq.headers['content-type']?.startsWith('multipart/form-data')){
           proxyReqOpts.headers["Content-Type"] = "application/json"  
        }
        return proxyReqOpts
    },
       userResDecorator: (proxyRes, proxyResData, userReq) => {
        console.log(`Response recieved from file service: ${proxyRes.statusCode}`)
        return proxyResData
    },
    parseReqBody: false
   }))

  app.use(errorMiddleware)


app.listen(PORT, () => {
    console.log(`Api Gateway is running on port ${PORT}`) 
    console.log(`idenity service is running on port ${process.env.IDENTITY_SERVICE_URL}`) 
    console.log(`upload service is running on port ${process.env.UPLOAD_SERVICE_URL}`) 
})