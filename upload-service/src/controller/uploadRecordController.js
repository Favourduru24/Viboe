const mongoose = require('mongoose')
const Record = require('../models/Record')
const Save = require('../models/Save')

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

   if(!recordedVideo) {
       return res.status(404).json({
         success: false,
         message: 'No recorded video found.'
       })
   }

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

const getRecordedVideoById = async (req, res) => {
   try{
       const {id} = req.params
      
       if(!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({
            success: false,
            message: 'Invalid ID format.'
         })
       }

      const recordedVideo = await Record.findById(id)

      if(recordedVideo._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: 'invalid id recieved.'
          })
      }

      return res.status(201).json({
         success: true,
         message: 'Recorded video fetched successfully.',
         recordedVideo
      })

    } catch(error) { 
       console.log('Error fetching recorded video by id', error)
       return res.status(500).json({
         message: 'Something went wrong fetch recorded video detail'
       })
    }
}




const likeRecordedVideo = async (req, res) => {
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
        const recordedVideo = await Record.findById(id) 

         if(!recordedVideo?.likes.includes(userId)) {
             recordedVideo?.likes.push(userId)
         }

         await recordedVideo.save()

         res.status(200).json({
            success: true,
            message: 'screen video liked successfully!'
         })

    } catch (error) {
      console.log(error, 'Error: Something went wrong liking video')  
      return res.status(500).json({
        message: 'Something went wrong liking video'
      })
    }
    
   
}

const unLikeRecordedVideo = async (req, res) => {
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
        const recordedVideo = await Record.findById(id) 

         if(recordedVideo?.likes.includes(userId)) {
             recordedVideo?.likes.pull(userId)
         }

         await recordedVideo.save()

        res.status(200).json({
            success: true,
            message: 'screen video unliked successfully!'
        })

    } catch (error) {
      console.log(error, 'Error liking video')  
      return res.status(500).json({
         message: 'Something went wrong unliking video'
      })
    }
}

 const saveRecordedVideo = async (req, res, next) => {
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

    const video = await Record.findById(id).session(session);

    if (!video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    const savedVideo = await Save.create([{videoId: id, userId}], { session });

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

 const getSavedRecordedVideo = async (req, res) => {

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


module.exports = {
    createRecordedVideo,
    getAllVideoRecord,
    getRecordedVideoById,
    likeRecordedVideo,
    unLikeRecordedVideo,
    saveRecordedVideo,
    getSavedRecordedVideo
}