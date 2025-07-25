const express = require('express')
const router = express.Router()
// const {uploadShort, getAllShortVideo} = require('../controller/uploadShortController')

// router.post('/upload-short', uploadShort)
router.get('/', (req, res, next) => {
    console.log('My Ip adress!', req.ip)
     next()
})

module.exports = router