const User = require('../model/User')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const {email, password, username} = req.body

      const existUser = await User.findOne({email})

      if(existUser) {
        const error = new Error('user already exist')
        error.statusCode = 409
        throw error
      }

      const hashPassword = await bcrypt.hash(password, 10)

       const newUser = await User.create([{username, email, password: hashPassword}], {session})

       await session.commitTransaction()
       session.endSession()

       res.status(201).json({
         success:true,
         message:'User created successfully',
       })

    } catch (error) {
       await session.abortTransaction()
       session.endSession() 
       next(error)
    }
}

const login = async(req, res, next) => {

  const session = await mongoose.startSession()
  session.startTransaction()

  try {

    const {email, password} = req.body
     
     const foundUser = await User.findOne({email})

     if(!foundUser) {
       const error = new Error('Unauthorized no user found!')
       error.statusCode = 404
       throw error
     }

     const comfirmPassword = await bcrypt.compare(password, foundUser.password)

     if(!comfirmPassword) {
       const error = new Error('Not matching password!')
       error.statusCode = 400
       throw error
     }

     const accessToken = jwt.sign({
       UserInfo: {
         id: foundUser.id,
         username: foundUser.username,
         email: foundUser.email
       }
     },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

     const refreshToken = jwt.sign(
       {email: foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    ) 

     res.cookies('jwt', refreshToken, {
       httpOnly: true,
       sameSite: 'None',
       secure: true,
       maxAge: 7 * 24 * 60 * 60 * 1000,
     })

     await session.commitTransaction()
     session.endSession()

    return res.json({
      success: true,
      accessToken,
      message:'User login successfully!'
     })
     
  } catch(error){
    session.abortTransaction()
    session.endSession()
    next(error)
  }

}

const refresh = (req, res) => {
 const cookies = req.cookies

  if(!req.cookies?.jwt) {
    return res.status(400).json({
       message:'Unauthorized no cookies recieved!'
    })
  }
    
  const refreshToken = cookies?.jwt
    try {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if(err) {
             return res.status(403).json({message: 'Forbidden!'})
          }
         const foundUser = await User.findOne({email: decoded.email}).exec()

         if(!foundUser) {
           return res.status(401).json({
            message: 'Unauthorized!'
           })
         }
         const accessToken = jwt.sign({
           UserInfo: {
             id: foundUser.id,
             email:foundUser.email,
             username:foundUser.username
           }
         },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: '1d'}
        )
         res.json({accessToken})
        }
      )
    } catch(error){
       console.log('Error sending refresh token', error);
       res.status(500).json({ message: 'Server error Something went wrong!'});
    }
}

const logout = (req, res) => {
  const cookie = req.cookies

  if(!cookie?.jwt) {
     return res.sendStatus(204) //no content
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

module.exports = {
  registerUser,
  login,
  refresh,
  logout,
}