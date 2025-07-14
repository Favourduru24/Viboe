require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOption = require('./config/corsOption')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnc')
const {logger, logEvent} = require('./middleware/logger')
const {errorMiddleware} = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3005
const mongoose = require('mongoose')
const helmet = require('helmet')
const {RateLimiterRedis} = require('express-rate-limiter')
const Redis = require('ioredis')

//middleware
app.use(errorMiddleware)
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOption))
app.use(logger)
app.use(helmet())

//  const redisClient = new Redis(process.env.REDIS_URL)

//  const rateLimiter  = new RateLimiterRedis({
//    storeClient: redisClient,
//    keyPrefix: 'middleware',
//    point: 10,
//    duration: 1
//  })

  // app.use((req, res, next) => {
  //   rateLimiter.consume(req.ip)
  //   .then(() => next())
  //   .catch((error) => {
  //   // logEvent(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t`, 'rateLimiter.log')
  //   })
  // })
 
  app.use('/api/v1/video', require('./router/uploadVideoRoutes'))
  app.use('/api/v1/short', require('./router/uploadShortRoutes'))

// connectDB()
mongoose.connection.once('open', () => {
 app.listen(PORT, () => {console.log(`"service": upload-service running on port ${PORT}`) })
})
