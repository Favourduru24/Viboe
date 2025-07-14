 const errorMiddleware = (err, req, res, next) => {
   try {
    let error = {...err}

    error.message = err.message

    console.log(err)

    if(err.name === 'CastError') {
         const message = 'Resource not found'
         error = new Error(message)
         error.statusCode = 404
    }
    
     if(err.code === 11000) {
       const message = 'Duplicate field value entered'
       error = new Error(message)
       error.statusCode = 404
     }

     if(err.name === 'ValidationError') {
        const message = Object.values(err.error).map(val => val.message)
        error = new Error(message.join(',')).replaceAll('Path', ' ')
        error.statusCode = 400
     }

     res.status(error.statusCode || 500, json({message: error.message || 'Server Error'}))
   } catch(error) {
    next(error)
   }
 }

 module.exports = {
    errorMiddleware
 }