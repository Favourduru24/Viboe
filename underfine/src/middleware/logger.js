const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const logEvent = async (message, logName) => {
    
    const num = 500000000000000000000

    const uuid = Math.floor(Math.random(num) * num)
    const date = Date.now()
    
    const log = `${date}\t${uuid}\t${message}\t`
     
     try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
          await fsPromise.mkdir(__dirname, '..', 'logs')
        } else {
         await fsPromise.appendFile(path.join(__dirname, '..', 'logs', logName), log)
        }
     } catch (error) {
       console.log('Error updating errors message.')  
     }
}

const logger = (req, res, next) => {
    logEvent(`${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    next()
}

 module.exports = {
    logEvent,
    logger
 }