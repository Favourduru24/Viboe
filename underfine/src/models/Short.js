const mongoose = require('mongoose')

const videoShortSchema = new mongoose.Schema({
    video: {
     type:mongoose.Schema.Types.ObjectId,
      ref: 'Short'
   },
   userId: {
       type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    description: {
     type: String,
      required: ['video short description is required', true],
      trim: true
   },
 }, {
    timestamps: true
})

 module.exports = mongoose.model('Short', videoShortSchema)