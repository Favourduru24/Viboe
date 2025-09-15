require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOption = require('./config/corsOption')
const connectDB = require('./config/dbConnc')
const {logger} = require('./middleware/logger')
const errorMiddleware = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3004
const helmet = require('helmet')
const {RateLimiterRedis} = require('express-rate-limiter')
const Redis = require('ioredis')
const {uploadVideoToCloudinary, upload } = require('./config/uploadVideo')
const { uploadImage, uploadImageToCloudinary } = require('./config/uploadImages')

//middleware
app.use(express.json())
app.use(express.static('public'))
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
 
  app.use('/api/video', require('./router/uploadVideoRoutes'))
  app.use('/api/video', require('./router/uploadShortRoutes'))
  app.use('/api/video', require('./router/uploadRecordRoutes'))
  app.use('/api/upload/upload-video', uploadVideoToCloudinary)
  app.use('/api/upload/upload-image', uploadImage, uploadImageToCloudinary)
  app.use(errorMiddleware)
 
connectDB()
   app.listen(PORT, () => {console.log(`"service": upload-service running on port ${PORT}`) })
