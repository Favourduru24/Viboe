const express = require('express')
const router = express.Router()
const uploadRecordController = require('../controller/uploadRecordController')
const verifyRequest = require('../middleware/verifyJwt')

router.post('/upload-screen-record', uploadRecordController.createRecordedVideo)
router.get('/get-screen-record', uploadRecordController.getAllVideoRecord)
router.get('/get-screen-record/:id', uploadRecordController.getRecordedVideoById)
router.patch('/like-screen-record/:id', verifyRequest, uploadRecordController.likeRecordedVideo)
router.patch('/unlike-screen-record/:id', verifyRequest, uploadRecordController.unLikeRecordedVideo)
router.post('/save-screen-record-video/:id', verifyRequest, uploadRecordController.saveRecordedVideo)
router.get('/get-saved-screen-record', verifyRequest, uploadRecordController.getSavedRecordedVideo)


module.exports = router