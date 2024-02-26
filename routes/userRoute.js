
const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController')
const userControl = require('../controllers/userControllerrr')
const middleware = require('../middlewares/validation');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user');

const router = express.Router();

// // Home page
// router.get('/', userController.userHomeGet );

// //signup page
// router.get('/signup', userController.userSignupGet);
// router.post('/signup', userController.validateSignupBody, userController.sendOtp );

// router.get('/signup/otp', userController.sendOtp , userController.signupOtpGet );
// router.post('/signup/otp', userController.signupOtpPost );

// router.post('/post-user', userController.userSignupPost );


// router.get('/login', userController.loginGet );
// router.post('/login', userController.loginPost );

// router.get('/login/forgot-password', userController.forgotPasswordGet );

// router.post('/login/forgot-password', userController.loginForgotPasswordOtp, userController.sendOtp, userController.successMessage );

// router.post('/login/validate-otp', userController.validateOtpPost );

// router.get('/resend-otp', userController.sendOtp );

// // router.post('/login/new-password', userController.newPasswordGet )

// router.get('/login/new-password', userController.newPasswordGet );

// router.post('/login/new-password', userController.newPasswordPost );



// Home 
router.get('/', userControl.userHomeGet );
// Signup page
router.get('/signup', userControl.userSignupGet );
router.post('/signup', userControl.validateSignupBody );
// Send signup otp
router.get('/signup/otp', userControl.sendOtp, userControl.signupOtpGet );
// Validate body
router.post('/signup/otp/validate', userControl.signupOtpPost );
// Saving user singup data into database
router.get('/post-user', userControl.userSignupPost );

// Login
router.get('/login', userControl.loginGet );
// Get user Data
router.post('/login', userControl.loginPost );
// Login user Forgot password
router.get('/login/forgot-password', userControl.forgotPasswordGet );
router.post('/login/forgot-password', userControl.loginForgotPasswordOtp, userControl.sendOtp, userControl.successMessage );

router.get('/resend-otp', userController.sendOtp );

router.post('/login/validate-otp', userControl.validateOtpPost );

router.get('/login/new-password', userControl.newPasswordGet );
router.post('/login/new-password', userControl.newPasswordPost )

// Error page
router.get('/*', userController.errorPageGet );




module.exports = router;