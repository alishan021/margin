
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

router.get('/product-list', userController.productListGet );

router.get('/product/:productId', userController.productGet );
router.patch('/product/cart/:productId/:quantity', async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const quantity = req.params.quantity;
        if (!req.session.user) {
            return res.status(404).json({ error: 'User not found', redirect: '/login' });
        }
        const userId = req.session.user._id;
        console.log(productId, quantity, userId );

        const user = await userModel.findById(userId);
        const productIndex = user.cart.findIndex(item => item._id.toString() === productId);
        console.log(productIndex);

        const isProduct = user.cart.find( doc => { return doc.product == productId  });
        console.log('isProduct : ');
        console.log(isProduct);
        if(isProduct){
            return res.status(400).json({ error: 'Product is already existed in the cart' });
        }

        if(quantity > 10 || quantity <= 0 ){
            return res.status(404).json({ error: 'maximum cart items 10' });
        }
        if (productIndex === -1) {
            user.cart.push({ product: productId, count: quantity });
        } else {
            user.cart[productIndex].count = parseInt(quantity);
        }

        await user.save();

        console.log('User updated successfully:', user);

        return res.status(200).json({ message: 'Cart updated successfully', user });
    }catch(err){
        console.error(err);
    }
})

router.get('/logout', userController.userLogout );

// User profile
router.get('/dashboard', userAuth.userSessionNo, userController.dashboardGet );
router.patch('/dashboard/user-details', userAuth.userSessionNo, userController.DashboardUserDetailsPatch );
router.patch('/address/:userId', userController.addAddressPatch );
router.delete('/address/:addressId', async ( req, res ) => {
    const addressId = req.params.addressId;
    const user = await userModel.findById(req.session.user._id);
    if(!user){
        res.status(400).json({ error: 'user not found again, login again'});
    }else{
        // const address = user.address.find( address => address._id == addressId );
        const addressIndex = user.address.findIndex( address => address._id == addressId );
        user.address.splice(addressIndex, 1);
        await user.save();
        res.status(200).json({ success: true, message: 'address successfully removed.' });
    }
})

// User Cart
router.get('/cart', userAuth.userSessionNo, userController.cartGet );
router.patch('/cart/:productId', userController.cartPatch );
router.patch('/cart/product/:userId/:productId/:nums', userController.cartCountPatch );
router.patch('/cart/delete/:productId', userController.cartProductDelete );




// User wishlist
router.get('/wishlist', userAuth.userSessionNo, userController.wishlistGet );


// User checkout
router.get('/checkout', userAuth.userSessionNo, userController.checkoutGet );


// Error page
// router.get('/*', userController.errorPageGet );




module.exports = router;