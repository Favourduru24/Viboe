const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    videoUrl: {
            message: String,
            cloudinaryUrl: String,
            cloudinaryPublicId: String,
       },
       thumbnailUrl: {
          cloudinaryUrl: String,
          cloudinaryPublicId: String,
        },
       userId: {
        type:mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: ['UnAuthorized to create video', true]
       },
       title:{
          required: ['video title is required', true],
           type: String,
           trim: true
         },
       description: {
         type: String,
          required: ['video description is required', true],
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

 module.exports = mongoose.model('Record', recordSchema)