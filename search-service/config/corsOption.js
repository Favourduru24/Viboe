const allowedOrigin = require('./allowedOrigin')

 const corsOption = {
     origin:(origin, callback) => {
        if(!origin || allowedOrigin.indexOf(origin) !== -1) {
             callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS!'))
        }
      },
      optionSuccessStatus: 204,
      credential: true
 }

 module.exports = corsOption