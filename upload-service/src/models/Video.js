const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
   videoUrl: {
       message: String,
       cloudinaryUrl: String,
       cloudinaryPublicId: String
   },
   thumbnailUrl: {
     message: String,
     cloudinaryUrl: String,
     cloudinaryPublicId: String
   },
   description: {
     type: String,
     required: [true, 'video description is required'],
     trim: true
   },
   title: {
     type: String,
     required: [true, 'video title is required'],
     trim: true
   },
   category: {
     type: String,
     required: [true, 'video category is required'],
     trim: true
   },
   userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: [true, 'UnAuthorized to create video']
   },
   likes: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
   }],
   
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema)