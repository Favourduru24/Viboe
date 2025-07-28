const express = require('express')
const router = express.Router()
const {
uploadVideo,
getAllVideo,
likeVideo,
unLikeVideo,
getVideoById,
saveVideo,
getSavedVideo,
getVideoByUser
} = require('../controller/uploadVideoController')
const verifyRequest = require('../middleware/verifyJwt')


 router.post('/upload-video', verifyRequest, uploadVideo)
 router.get('/get-video', verifyRequest, getAllVideo)
 router.get('/get-video/:id', getVideoById)
 router.get('/get-video:userId', verifyRequest, getVideoByUser)
 router.get('/get-saved-video', verifyRequest, getSavedVideo)
 router.post('/save-video/:id', verifyRequest, saveVideo)
 router.patch('/like-video/:id', verifyRequest, likeVideo )
 router.patch('/unlike-video/:id', verifyRequest, unLikeVideo)

module.exports = router