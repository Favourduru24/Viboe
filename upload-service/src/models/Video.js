const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
   video: {
     type:mongoose.Schema.Types.ObjectId,
      ref: 'Video'
   },
   userId: {
    type:mongoose.Schema.Types.ObjectId,
     ref: 'User'
   },
   description: {
     type: String,
      required: ['video description is required', true],
      trim: true
   },
    title:{
      required: ['video title is required', true],
   
    },
    thumbnail: {
      required: ['video thumbnail is required', true],
    }

}, {
    timestamps: true
})

 module.exports = mongoose.model('Video', videoSchema)