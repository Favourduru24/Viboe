const mongoose = require('mongoose')

const videoShortSchema = new mongoose.Schema({
    videoUrl: {
        message: String,
        cloudinaryUrl: String,
        cloudinaryPublicId: String,
   },
   userId: {
       type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: ['unAuthorized to create short videos']
      },
    description: {
     type: String,
      required: ['video short description is required', true],
      trim: true
   },
   category: {
     type: String,
     required: [true, 'video category is required'],
     trim: true
   },
 }, {
    timestamps: true
})

 module.exports = mongoose.model('Short', videoShortSchema)