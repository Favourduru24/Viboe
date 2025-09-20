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

const likeShortVideo = async (req, res) => {

   const {id} = req.params
   const userId = req.id

   if(!id) {
     return res.status(400).json({
        success: false,
        message: 'No videoId recieved'
     })
   }
   if(!userId) {
     return res.status(400).json({
        success: false,
        message: 'No userId recieved'
     })
   }

    try {

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                messge: 'invalid Id fromat!'
            })
        }
        const shorts = await Short.findById(id) 

         if(!shorts?.likes.includes(userId)) {
             shorts?.likes.push(userId)
         }

         await shorts.save()

         res.status(200).json({
            success: true,
            message: 'shorts liked successfully!'
         })

    } catch (error) {
      console.log(error, 'Error: Something went wrong liking video')  
      return res.status(500).json({
        message: 'Something went wrong liking video'
      })
    }
    
   
}

const unLikeShortVideo = async (req, res) => {
   const {id} = req.params
   const userId = req.id

   if(!id) {
     return res.status(400).json({
        success: false,
        message: 'No videoId recieved'
     })
   }
   if(!userId) {
     return res.status(400).json({
        success: false,
        message: 'No userId recieved'
     })
   }

    try {

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                messge: 'invalid Id fromat!'
            })
        }
        const shorts = await Short.findById(id) 

         if(shorts?.likes.includes(userId)) {
             shorts?.likes.pull(userId)
         }

         await shorts.save()

        res.status(200).json({
            success: true,
            message: 'shorts unliked successfully!'
        })

    } catch (error) {
      console.log(error, 'Error liking shorts')  
      return res.status(500).json({
         message: 'Something went wrong unliking shorts'
      })
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
    getAllShortVideo,
    likeShortVideo,
    unLikeShortVideo
}
