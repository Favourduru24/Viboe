const mongoose = require('mongoose')
const Short = require('../models/Short')

const uploadShort = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()
      
   try {
     const {videoUrl, description, title, userId, category} = req.body

      const newShortVideo = await Short.create([{videoUrl, description, title, category, userId}], {session})

       await session.commitTransaction()
       session.endSession()

       res.status(201).json({
        success: true,
        message: 'short video uploaded successfully',
        short: newShortVideo[0],
       })

   } catch(error) {
    next(error)
    await session.abortTransaction()
    session.endSession()
   }
}

const getAllShortVideo = async (req, res) => {
   try{

  const short = await Short.find()

  res.json({
    success: true,
    short,
    message: 'Short video fetched successfully!'
  })
 
   } catch(error) {
    console.log(error, 'Error fetching short videos')
    return res.status(500).json({
       message: 'Something went wrong fetching short video'
    })
   }
}

module.exports = {
    uploadShort,
    getAllShortVideo
}
