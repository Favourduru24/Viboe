const mongoose = require('mongoose')

const saveSchema = new mongoose.Schema({
   videoId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
   }],
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, {
   timestamps: true
})

module.exports = mongoose.model('Save', saveSchema)