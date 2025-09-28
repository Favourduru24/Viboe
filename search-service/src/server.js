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
 

//middleware
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOption))
app.use(logger)
app.use(helmet())

 
  app.use(errorMiddleware)

  connectDB()
  app.listen(PORT, () => {console.log(`service: identity-service running on port ${PORT}`)})
