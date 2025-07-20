const mongoose = require('mongoose')

 const connectDB = async () => {
       try {
          if(!process.env.MONGODB_URI) {
            throw new Error('MOGODB_URI is missing!')
        }
         await mongoose.connect(process.env.MONGODB_URI)
         console.log('MONGODB is connected!')
       } catch (error) {
         console.log('Something went wrong connecting to MONGODB', error)
       }
 }

  module.exports = connectDB