const mongoose = require('mongoose')
const User = require('../model/User')

const getAllUser = async (req, res) => {
   try {
     const user = await User.find()

     if(user) {
         return res.status(400).json({
            success: false,
            message: 'No user found!'
         })
     }

     res.status(200).json({
       success: true,
       message: 'User fetched sucessfully.',
     })
     
   } catch(error) {
      console.log(error, 'Something went wrong fetching user!')
      return res.status(500).json({
        success: false,
        message: 'Something went wrong fetching video'
      })
   }
}

const addUserSubscriber = async (req, res) => {

    const user = req.id

    if(!user) {
         return res.status(400).json({
            message: 'user not found!'
         })
    }

    if(!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format.'
        })
    }

    try{
    const userId = await User.findById(user)

    if(!userId.subscription.includes(user)) {
        userId.subscription.push(user)
    }

    await userId.save()

    res.status(200).json({
        message: 'Subcription added successfully.'
    })

   } catch(error) {
     console.log(error, 'Something went wrong creating subscription!')
   }
}

const removeUserSubscriber = async (req, res) => {

    const user = req.id

    if(!user) {
         return res.status(400).json({
            message: 'user not found!'
         })
    }

    if(!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format.'
        })
    }

    try{
        
    const userId = await User.findById(user)

    if(userId.subscription.includes(user)) {
        userId.subscription.pull(user)
    }

    await userId.save()

    res.status(200).json({
        message: 'Subcription added successfully.'
    })

   } catch(error) {
     console.log(error, 'Something went wrong creating subscription!')
   }
}

 const getUserById = async(req, res) => {
    const user = req.id

    try {
        const userId = await User.findById(user)

        if(!userId) {
             return res.status(400).json({
             success: false,
             message: 'No user found.'
             }
        )}

        res.status(200).json({
            success: true,
            message: 'user fetch successfully'
        })

    } catch(error) {
        console.log(error, 'Something went wrong fetching user details')
    }
 }

module.exports = {
    getAllUser,
    addUserSubscriber,
    removeUserSubscriber,
    getUserById
}