const express = require('express')
const router = express.Router()
const {login, logout, refresh, registerUser} = require('../controller/authController')

router.post('/register', registerUser)
router.post('login', login)
router.post('logout', logout)
router.get('refresh', refresh)

module.exports = router