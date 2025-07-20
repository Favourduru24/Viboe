const jwt = require('jsonwebtoken')

const verifyJwt = (req, res, next) => {
 const authHeader = req.headers.authorization || req.headers.Authorization

 if(!authHeader?.startsWith('Bearer ')){
    return res.status(401).json({message: 'Unauthorized me'})
 }
  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        if(err) return res.status(403).json({message: 'Forbidden huh'}) 

            req.id = decoded.UserInfo.id,
            req.username = decoded.UserInfo.username,
            req.email = decoded.UserInfo.email
        next()
    }
  )
}

module.exports = verifyJwt