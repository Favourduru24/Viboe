require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOption = require('./config/corsOption')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnc')
const {logger} = require('./middleware/logger')
const errorMiddleware = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3002
const helmet = require('helmet')
// const {RateLimiterRedis} = require('express-rate-limiter')
const Redis = require('ioredis')

//middleware
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOption))
app.use(logger)
app.use(helmet())

//  const redisClient = new Redis(process.env.REDIS_URL)

//  Ddos rate limiting and connection
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
  //   logEvent(`Too Many Requests from this IP: ${req.ip}`, 'rateLimiter.log')
  //   res.status(429).json({
  //     success: false,
  //     message: 'Too many requests'
  //   })
  //   })
  // })
 
  app.use('/api/auth', require('./router/authRoutes'))
  app.use('/api/user', require('./router/userRoutes') )
  app.use(errorMiddleware)

  connectDB()
  app.listen(PORT, () => {console.log(`service: identity-service running on port ${PORT}`)})
