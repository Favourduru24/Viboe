const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'username is required!'],
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      unique:true
    },
    email: {
      type: String,
      required: [true, 'email is required!'],
    },
    profilePics: {
      type: String,
      // required: [true, 'profilePics is required!'],
    }
}, {
    timestamp: true
})

 module.exports = mongoose.model('User', userSchema)