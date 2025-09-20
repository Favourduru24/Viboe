const express = require('express')
const router = express.Router()
const verifyRequest = require('../middleware/verifyJwt')
const {uploadShort, getAllShortVideo, likeShortVideo, unLikeShortVideo} = require('../controller/uploadShortController')

router.post('/upload-short', uploadShort)
router.get('/get-shorts', getAllShortVideo)
router.patch('/like-shorts/:id', verifyRequest, likeShortVideo)
router.patch('/unlike-video/:id', verifyRequest, unLikeShortVideo)

module.exports = router