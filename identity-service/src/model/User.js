const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'username is required!'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      unique:true
    },
    email: {
      type: String,
      required: [true, 'email is required!'],
      trim: true
    },
    profilePics: {
      type: String,
    },
    subscription: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    }]
}, {
    timestamp: true
})

 module.exports = mongoose.model('User', userSchema)