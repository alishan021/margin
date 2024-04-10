
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// const userController = require('../controllers/userController')
const userController = require('../controllers/userControllerrr')
const userAuth = require('../middlewares/authUser');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user');
const { render } = require('ejs');
const productModel = require('../models/products');
const orderModel = require('../models/order');

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
// router.patch('/login', (req, res ) => {
//     res.redirect('/login')
// });
// Get user Data
router.post('/login', userController.loginPost );
// Login user Forgot password
router.get('/login/forgot-password', userController.forgotPasswordGet );
router.post('/login/forgot-password', userController.loginForgotPasswordOtp, userController.sendOtp, userController.successMessage );

router.get('/resend-otp', userController.sendOtp );

router.post('/login/validate-otp', userController.validateOtpPost );

router.get('/login/new-password', userController.newPasswordGet );
router.post('/login/new-password', userController.newPasswordPost );

router.get('/product-list/', userController.productListGet );
router.get('/product-list/:sortBy', userController.productListGetSortBy );
router.get('/filter', userController.sortFilterGet );

router.get('/product/:productId', userController.productGet );
router.patch('/product/cart/:productId/:quantity', userController.productCartPatch );

router.get('/logout', userController.userLogout );

// User profile
router.get('/dashboard', userAuth.userSessionNo, userController.dashboardGet );
router.patch('/dashboard/user-details', userAuth.userSessionNo, userController.DashboardUserDetailsPatch );
router.patch('/address/:userId', userController.addAddressPatch );
router.delete('/address/:addressId', userController.deleteAddress );
router.get('/address/edit/:addressId', userController.addressEditGet );
router.patch('/address/update/:addressId/:userId', userController.addressUpdatePatch );


// User Cart
router.get('/cart', userAuth.userSessionNo, userController.cartGet );
router.patch('/cart/:productId', userController.cartPatch );
router.patch('/cart/product/:userId/:productId/:nums', userController.cartCountPatch );
router.patch('/cart/delete/:productId', userController.cartProductDelete );
router.get('/address/preffered/:addressId', userController.preferredAddressGet );




// User wishlist
router.get('/wishlist', userAuth.userSessionNo, userController.wishlistGet );
router.post('/wishlist/:productId', userAuth.userSessionNo, userController.wishlistPost );
router.delete('/product/remove/:productId', userController.wishlistDelete );


// User checkout
router.get('/checkout', userAuth.userSessionNo, userController.checkoutGet );
router.post('/checkout/:userId', userController.checkoutPost );
// router

router.get('/order/:orderId', userController.orderSingleGet );
router.patch('/order/cancel/:orderId', userController.orderCalcellationPath );

// Error page
// router.get('/*', userController.errorPageGet );




module.exports = router;