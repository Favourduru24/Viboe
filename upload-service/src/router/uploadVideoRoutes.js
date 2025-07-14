const express = require('express')
const router = express.Router()
const {uploadVideo, getAllVideo} = require('../controller/uploadVideoController')

 router.post('/upload-video', uploadVideo)
 router.get('/get-video', getAllVideo)

module.exports = router