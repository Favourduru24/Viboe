const express = require('express')
const router = express.Router()
const uploadRecordController = require('../controller/uploadRecordController')

router.post('/upload-screen-record', uploadRecordController.createRecordedVideo)
router.get('/get-screen-record', uploadRecordController.getAllVideoRecord)

module.exports = router