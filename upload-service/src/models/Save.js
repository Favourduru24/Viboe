const mongoose = require('mongoose')

const saveSchema = new mongoose.Schema({
   videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
   }
}, {
   timestamps: true
})

module.exports = mongoose.model('Save', saveSchema)