const express = require('express')
const router = express.Router()

const accountController = require('../controllers/accountController')
const forgetPasswordController = require('../controllers/forgetPasswordController')

// Member
router.get('/', accountController.getProfile)

// User
router.post('/signin', accountController.signIn)
router.post('/signup', accountController.signUp)
router.get('/logout', accountController.logout)

// Reset Password
router.post('/reset-password', forgetPasswordController.setRedisKey)
router.get('/reset-password/:token', forgetPasswordController.getRedisKey)
router.put('/modify-password', forgetPasswordController.resetPassword)

module.exports = router