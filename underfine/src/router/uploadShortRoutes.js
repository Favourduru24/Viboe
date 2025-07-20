const express = require('express')
const router = express.Router()
const {uploadShort, getAllShortVideo} = require('../controller/uploadShortController')

router.post('/upload-short', uploadShort)
router.get('/get-shorts', getAllShortVideo)

module.exports = router