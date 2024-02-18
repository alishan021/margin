
const express = require('express');
const userController = require('../controllers/userController')
const middleware = require('../middlewares/validation');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user');

const router = express.Router();

// Home page
router.get('/', userController.userHomeGet );

//signup page
router.get('/signup', userController.userSignupGet);
router.post('/signup', middleware.validateSignupBody, userController.userSignupPost );

router.get('/signup/otp', userController.sendOtp , userController.signupOtpGet );
router.post('/signup/otp', userController.signupOtpPost );


router.get('/login', userController.loginGet );
router.post('/login', userController.loginPost );

module.exports = router;