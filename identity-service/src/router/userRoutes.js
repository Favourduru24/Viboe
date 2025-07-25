const express = require('express')
const router = express.Router()
const verifyJwt = require('../middleware/verifyJwt')
const {
    getAllUser,
    addUserSubscriber,
    removeUserSubscriber,
    getUserById
    } = require('../controller/userController')

router.patch('/add-subcriber', verifyJwt, addUserSubscriber)
router.patch('/remove-subcriber', verifyJwt, removeUserSubscriber)
router.get('/get-user', getAllUser)
router.get('/get-userId', getUserById)

module.exports = router