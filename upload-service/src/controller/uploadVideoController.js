const mongoose = require('mongoose')
const Video = require('../models/Video')
const Save = require('../models/Save')

 const uploadVideo = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {videoUrl, description, title, userId, category, thumbnailUrl} = req.body

        const newVideo = await Video.create([{
            videoUrl,
            thumbnailUrl,
            description,
            title,
            category,
            userId
        }], { session })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
            message: 'Video created successfully',
            video: newVideo[0] // Changed from 'videos' to 'video' for consistency
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const getAllVideo = async (req, res) => {
   try{

      const {category = ''} = req.query

  const video = await Video.find()

//   if(!video?.length) {
//      return res.status(404).json({
//       success: false,
//       message: 'No video found'
//      })
//   }

  

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

const getVideoById = async (req, res) => {
  try {
     const {id} = req.params

     if(!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({
            success: false,
            message: 'Invalid Id format'
         })
     }

     const videoId = await Video.findById(id)

     if(videoId._id.toString() !== id) {
        return res.status(400).json({
            success: false,
            message: 'invalid id recieved.'
        })
     }

     res.status(200).json({
         success: true,
         message: 'video detail fetched successfully.',
         videoId
     })

  } catch(error) {
     console.log(error, 'Error fetching video details by id')
     return res.status(500).json({
        message: 'Error fetching video details'
     })
  }
}

const likeVideo = async (req, res) => {
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
        const video = await Video.findById(id) 

         if(!video?.likes.includes(userId)) {
             video?.likes.push(userId)
         }

         await video.save()

         res.status(200).json({
            success: true,
            message: 'video liked successfully!'
         })

    } catch (error) {
      console.log(error, 'Error: Something went wrong liking video')  
      return res.status(500).json({
        message: 'Something went wrong liking video'
      })
    }
    
   
}

const unLikeVideo = async (req, res) => {
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
        const video = await Video.findById(id) 

         if(video?.likes.includes(userId)) {
             video?.likes.pull(userId)
         }

         await video.save()

        res.status(200).json({
            success: true,
            message: 'video unliked successfully!'
        })

    } catch (error) {
      console.log(error, 'Error liking video')  
      return res.status(500).json({
         message: 'Something went wrong unliking video'
      })
    }
}

 const saveVideo = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params
    const userId = req.id

    if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const video = await Video.findById(id).session(session);
    
    if (!video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    const savedVideo = await Save.create([{ videoId: id, userId}], { session });

    if(!savedVideo) {
       await session.abortTransaction();
       session.endSession();
       return res.status(404).json({
         success: false,
         message: 'Unable to save vidoe with inconsistent data'
       })
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Video saved successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error)
  }
};

 const getSavedVideo = async (req, res) => {

  const user = req.id

    try {
      const saveVideo = await Save.find({userId: user})
                                  .populate('videoId', 'thumbnailUrl _id title')
      
      if(!saveVideo) {
         return res.status(400).json({
           success: false,
           message: 'No save video found.'
         })
      }

      res.status(201).json({
        success: true,
        message: 'Save video fetched successfully.',
        saveVideo
      })

    } catch(error) {
        console.log(error, 'something went wrong fetching saved video')
        return res.status(500).json({
           success: false,
           message: 'Something went wrong fetching saved video'
        })
    }
 }

 const getVideoByUser = async (req, res) => {
    try {
    const userId = req.id

   if(!mongoose.Types.ObjectId.isValid(userId)) {
       return res.status(400).json({
          success: false,
          message: 'Invalid id format.'
       })
   }

   const userVideo = await Video.find()

   if(!userVideo) {
       return res.status(404).json({
          success: false,
          message: 'No user video found.'
       })
   }

   res.status(204).json({
      message: 'User video fetched successfully.',
       userVideo
   })
    } catch(error) {
     return res.status(500).json({
        message: 'Something went wrong fetching user video',
        error
    })
    }
   

}

 const getVideoCategory = (req, res) => {
   
 }

module.exports = {
   uploadVideo,
   getAllVideo,
   likeVideo,
   unLikeVideo,
   getVideoById,
   saveVideo,
   getSavedVideo,
   getVideoByUser
}
