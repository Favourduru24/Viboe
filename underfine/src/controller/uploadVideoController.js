const mongoose = require('mongoose')
const Video = require('../models/Video')

 const uploadVideo = async (req, res, next) => {
    const session = await mongoose.startSession()
     session.startTransaction()

     try {
     const {video, description, title, thumbnail} = req.body

    const newVideo = await Video.create([{video, description, thumbnail, title}], {session})

    await session.commitTransaction()
     session.endSession()

     res.status(201).json({
        success: true,
        message: 'Video created sucessfully',
        videos: newVideo[0]
     })
        
     } catch (error) {
       next(error)  
       await session.abortTransaction()
       session.endSession()
     }
}

const getAllVideo = async () => {
   try{

  const video = await Video.find()

  res.json({
    success: true,
    videos: video,
    message: 'Video fetched successfully!'
  })
 
   } catch(error) {
    console.log(error, 'Error fetching videos')
    return res.status(500).json({
       message: 'Something went wrong fetching video'
    })
   }
}


module.exports = {
   uploadVideo,
    getAllVideo
}
