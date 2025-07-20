const mongoose = require('mongoose')
const Record = require('../models/Record')

const createRecordedVideo = async (req, res, next) =>  {
     const session = await mongoose.startSession()
      session.startTransaction()

      try {
        const {videoUrl, thumbnailUrl, title, description, category, userId} = req.body

        const recordedVideo = await Record.create([{videoUrl, thumbnailUrl, title, description, category, userId}], {session})

        if(!recordedVideo) {
         return res.status(400).json({
            success: false,
            message: 'Something went wrong creating video record',
         })
        }

        await session.commitTransaction()
         session.endSession()

         res.status(201).json({
            success: true,
            message: 'Recorded video uploaded successfully!'
         })

      } catch (error) {
         await session.abortTransaction()
         session.endSession()
         next(error) 
      }
}

const getAllVideoRecord = async (req, res) => {
   try{
  const recordedVideo = await Record.find()

  res.json({
    success: true,
    recordedVideo,
    message: 'Recorded video fetched successfully!'
  })
 
   } catch(error) {
    console.log(error, 'Error fetching recorded video')
    return res.status(500).json({
       message: 'Something went wrong fetching recorded video'
    })
   }
}

module.exports = {
    createRecordedVideo,
    getAllVideoRecord
}