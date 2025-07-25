 const express = require('express')
 const app = express()
 const Port = 3000


  //app.use('/', require('./router/uploadShortRoutes'))
  app.get('/', (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 6000)
})

 app.listen(Port, () => {
    console.log(`Server running on port ${Port}`)
 })