
const express = require('express');
const bcrypt = require('bcrypt');
// const userController = require('../controllers/userController')
const userController = require('../controllers/userControllerrr')
const userAuth = require('../middlewares/authUser');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user');
const { render } = require('ejs');

const router = express.Router();


// Home 
router.get('/', userController.userHomeGet );
// Signup page
router.get('/signup', userController.userSignupGet );
router.post('/signup', userController.validateSignupBody );
// Send signup otp
router.get('/signup/otp', userController.sendOtp, userController.signupOtpGet );
// Validate body
router.post('/signup/otp/validate', userController.signupOtpPost );
// Saving user singup data into database
router.get('/post-user', userController.userSignupPost );

// Login
router.get('/login', userAuth.userSessionYes ,userController.loginGet );
// Get user Data
router.post('/login', userController.loginPost );
// Login user Forgot password
router.get('/login/forgot-password', userController.forgotPasswordGet );
router.post('/login/forgot-password', userController.loginForgotPasswordOtp, userController.sendOtp, userController.successMessage );

router.get('/resend-otp', userController.sendOtp );

router.post('/login/validate-otp', userController.validateOtpPost );

router.get('/login/new-password', userController.newPasswordGet );
router.post('/login/new-password', userController.newPasswordPost );

router.get('/product-list', userController.productListGet );

router.get('/product/:productId', userController.productGet );

router.get('/logout', userController.userLogout );


// Error page
// router.get('/*', userController.errorPageGet );




module.exports = router;