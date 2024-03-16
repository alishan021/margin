

const middleware = require('../middlewares/functions');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user')
const productModel = require('../models/products')
const bcrypt = require('bcrypt');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');




exports.userHomeGet = ( req, res) => {
    console.log('userin : ' + req.session.userIn);
    res.render('index.ejs', { userIn: req.session.userIn });
}



exports.userSignupGet = ( req, res ) => {
    res.render('signup.ejs', { userIn: req.session.userIn });
}



exports.validateSignupBody = async (req, res, next ) => {

    console.log('enter in to validatesignupbody');

    const body = { username, email, password, passwordRe } = req.body;
    req.session.userEmail = email;
    req.session.signupBody = body;
    console.log(req.session);
    console.log(req.body);

    const isEmailValid = (email) => {
      const emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
      return emailRegex.test(email)
    }


    if(!username || !email || !password || !passwordRe ){
      console.log('error 1');
      return res.status(400).json({ error: 'All fields are required'});
    }

    if(!isEmailValid(email)){
      console.log('error 2');
      return res.status(400).json({ error: 'email structure is not right'});
    }
    
    if(password !== passwordRe){
      console.log('error 3');
      return res.status(400).json({ error: 'password is not matching'});
    }
    
    const isUnique = await userModel.findOne({ email });
    if(isUnique){
      console.log('not unique, error 4');
      return res.status(400).json({ error: 'email is already registered'});
    }

    console.log('validateSingupbody is finished');
    res.json({ message: 'validation is alright'});
}




exports.sendOtp = async ( req, res , next ) => {

    console.log('send otp');
    if(req.body.email){
        req.session.userEmail = req.body.email;
    }
    const email = req.session.userEmail
    console.log('email : ' + email );
    const otpGen = require('otp-generator');

    const otp = otpGen.generate( 6, { 
        upperCaseAlphabets: false,
         lowerCaseAlphabets: false, 
         specialChars: false,
    })

    console.log('otp : ' + otp );

    const newDoc = { user: req.session.userEmail, otp };
    console.log('newDoc : ' + newDoc.user, newDoc.otp);
    const docRes = await new otpModel(newDoc)
            .save();

    console.log(docRes);

    const nodemailer = require('nodemailer');
    
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test102201102@gmail.com',
            pass: 'gunk xzwl blxq esjr',
        }
    });

    const mailOptions = {
        from: 'test102201102@gmail.com',
        to: email,
        subject: 'sending email to you',
        text: `Your otp to verify your account is ${otp}, Thank you`
    }


    // transport.sendMail( mailOptions, async ( err, info ) => {
    //     if(err) console.log('error : ' + err);
    //     else{
            
    //         console.log('success : ' + info.response );
    //     }
    // })

    next();
}




exports.signupOtpGet = ( req, res) => {
    res.render('signupOtp.ejs');
}




exports.signupOtpPost = async (req, res) => {
    const { otp } = req.body;
    try {
        // Use await with exec() to execute the query and await the result
        const dbOtp = await otpModel.findOne({ otp }).exec();

        console.log(`otp : ${otp}, dbOtp :, ${dbOtp}, email : ${req.session.userEmail}`);

        if(!otp){
            return res.status(400).json({ success: false, error: 'OTP is required' });
        }

        if (!dbOtp || !dbOtp.otp ) {
            return res.status(400).json({ success: false, error: 'OTP is wrong' });
        }

        if (dbOtp.otp !== otp ) {
            return res.status(400).json({ success: false, error: 'OTP is not correct' });
        }

        if (dbOtp.user !== req.session.userEmail ) {
            return res.status(400).json({ success: false, error: 'email is not matching' });
        }

        // If OTP matches, return success response
        return res.status(200).json({ success: true, message: 'OTP verification successful' });
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};




exports.userSignupPost = async ( req, res, next ) => {
    try{
        const { username, email, password } = req.session.signupBody;

        // req.session.userEmail = email;
    
        const hashedPassword = await bcrypt.hash( password, parseInt(process.env.SALTROUNDS) );   
    
        const userData = { username, email, password: hashedPassword };
        const result = await userModel.create(userData);
    
        console.log(result);    
        res.redirect('/login');
        // res.json({ success: true });
       }
    catch(error) {
        console.log('error : ' + error );
    }
    next();
}




exports.redirecToOtp = ( req, res) => {
    res.redirect('/signup/otp');
}



exports.loginGet = ( req, res ) => {
    // if(req.session.isLogin){
    //     return res.redirect('/');
    // }
    res.render('login.ejs');
}



exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
        return emailRegex.test(email);
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isEmailValid(email)) {
        return res.status(400).json({ error: 'Email format is wrong' });
    }

    try {
        const userDetails = await userModel.findOne({ email });

        if (!userDetails) {
            return res.status(400).json({ error: 'User not found' });
        }
        if(!userDetails.status){
            return res.status(400).json({ error: 'user is blocked by admin'});
        }

        const match = await bcrypt.compare(password, userDetails.password);
        console.log('match : ' + match );
        if (match) {
            req.session.userIn = true;
            req.session.user = userDetails;
            console.log('userIn : ' + req.session.userIn );
            return res.status(200).json({ success: true, message: 'Authentication successful' });
        } else {
            return res.status(400).json({ success: false, error: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}




exports.userLogout = ( req, res ) => {
    delete req.session.userIn;
    delete req.session.user;
    res.redirect(`/`);
}





exports.forgotPasswordGet = ( req, res ) => {
    res.render('forgot-password.ejs');
}




exports.loginForgotPasswordOtp = async ( req, res, next ) => {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if(!user){
        res.status(400).json({ error: 'user not found'});
    }
    req.session.userEmail = email;
    next();
}




exports.successMessage = ( req, res ) => {
    res.status(201).json({ message: 'otp send to your email'});
}




exports.validateOtpPost = async (req, res) => {
    const { otp, email } = req.body;
    try {
        // Use await with exec() to execute the query and await the result
        const dbOtp = await otpModel.findOne({ otp }).exec();

        console.log(`otp : ${otp}, dbOtp :, ${dbOtp}, email : ${req.session.userEmail}`);

        if (!dbOtp || !otp ) {
            return res.status(400).json({ success: false, error: 'otp is not recieved, try resend otp' });
        }

        if (dbOtp.otp !== otp ) {
            return res.status(400).json({ success: false, error: 'OTP is Invalid' });
        }

        if (dbOtp.user !== req.session.userEmail ) {
            return res.status(400).json({ success: false, error: 'email is not matching' });
        }

        // If OTP matches, return success response
        if(otp === dbOtp.otp){
            return res.status(200).json({ success: true, message: 'OTP verification successful' });
        }

        return res.json({ message: "something wrong or server side"})
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};




exports.newPasswordGet = ( req, res ) => {
    res.render('new-password.ejs');
}



exports.newPasswordPost = async ( req, res ) =>{
    try{
        console.log('inside new password');
        const { password, passwordre } = req.body;
        if(!password || !passwordre ){
            return res.status(400).json({ error: 'all fields are required!'});
        }
        if( password.length < 6 || passwordre.length < 6 ){
            return res.status(400).json({ error: 'password must be greaterthan 6'});
        }
        if( password !== passwordre ){
            return res.status(400).json({ error: 'password is not matching!'});
        }

        console.log(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash( password, process.env.SALTROUNDS * 1 );   
        console.log(process.env.SALTROUNDS);
        req.session.some = 'hai';
        console.log(req.session.some);
        console.log(req.session);
        console.log(req.session.userEmail);
        const result = await userModel.findOneAndUpdate({ email: req.session.userEmail}, { password: hashedPassword });
        console.log('result : ' +  result );

        console.log('backend is allright');
        return res.status(201).json({ message: 'everything is allright'});
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.productGet = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const product = await productModel.findById( productId );
        const category = await categoryModel.findOne({ _id: product.category });
        res.render('product.ejs', { product, category, userIn: req.session.userIn } );
    }
    catch(error){
        console.log(`error inside productGet : ${error}`);
    }
}





exports.productListGet = async ( req, res ) => {
    try{
        const products = await productModel.find({ status: { $ne: false } });
        const totalDocs = await productModel.find({ status: { $ne: false } }).count();
        // const categorys = await categoryModel.find({});
        console.log(products);
        res.render('product-list.ejs', { products, totalDocs, userIn: req.session.userIn });
   }
   catch(error){
    console.log('error in productListGet: ' + error );
    }
}





exports.errorPageGet = ( req, res ) => {
    res.render('404.ejs', { userIn: req.session.userIn });
}




exports.dashboardGet = async ( req, res ) => {
    const user = await userModel.findById(req.session.user._id);
    const orders = await orderModel.find({ userId: req.session.user._id });
    console.log(orders);
    res.render('dashboard.ejs', { userIn: req.session.userIn, user, orders });
}




exports.cartGet = async ( req, res ) => {
    const cartProducts = await userModel.findOne({ email: req.session.user.email }, { cart: 1 }).populate('cart.product');
    const user = req.session.user;
    console.log(cartProducts)
    if (!cartProducts || !user ) return res.status(404).send('User session expired, login again');

    console.log(cartProducts)
    res.render('cart.ejs', { userIn: req.session.userIn, user, cartProducts });
}




exports.wishlistGet =  ( req, res ) => {
    res.render('wishlist.ejs', { userIn: req.session.userIn, user: req.session.user });
}




exports.preferredAddressGet = ( req, res ) => {
    const addressId = req.params.addressId;
    req.session.addressId = addressId;
    if(addressId) return res.json({ message: 'address changed'});
}




exports.checkoutGet = async (req, res) => {
    try {
        const addressId = req.session.addressId;        
        const user = await userModel.findById(req.session.user._id);
        const address = user.address.find(item => item._id == addressId);
        console.log(address);

        if (!user) return res.status(400).json({ error: 'User session expired, login again' });

        const productDetails = await getProductDetails(user.cart);
        console.log(productDetails);

        res.render('checkout.ejs', { userIn: req.session.userIn, products: productDetails, user, address });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Function to fetch product details for each item in the user's cart
async function getProductDetails(cart) {
    const productDetails = [];
    for (const item of cart) {
        const product = await productModel.findById(item.product);
        if (product) {
            productDetails.push({
                product: product,
                count: item.count,
                _id: item._id,
                added_at: item.added_at
            });
        }
    }
    return productDetails;
}





exports.DashboardUserDetailsPatch = async ( req, res ) => {
    const { username, email, oldpassword, password, passwordre } = req.body;
    const userSessionEmail = req.session.user.email; 
    console.log(username, email )
    if(!username || !email){
        return res.status(400).json({ error: 'username and email is required'});
    }
    if(email !== userSessionEmail){
        console.log(userSessionEmail);
        return res.status(400).json({ error: `please signin through ${userSessionEmail}`})
    }
    if(password !== passwordre ){
        return res.status(400).json({ error: 'password is not matching'});
    }
    if( password < 6 ){
        return res.status(400).json({ error: 'password need atlease 6 charcters'});
    }
    try{
        if(!oldpassword || oldpassword == ''){
            const result = await userModel.updateOne({ email: userSessionEmail}, { $set: { username: username }});
            console.log(result);
            return res.status(200).json({ message: 'username updated successfully'});
        }else {
            const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALTROUNDS ));
            const result = await userModel.findOneAndUpdate({ email: userSessionEmail }, { $set: { username, password: hashedPassword }}, { new: true } );
            console.log(result);
            req.session.user.username = username;
            return res.status(200).json({ message: 'userDetails updated successfully'});
        }
    }
    catch(err){
        console.error(err);
    }
}



// Add prdocuts to cart
exports.cartPatch = async ( req, res ) => {
    try{
        console.log('cart');
        const productId = req.params.productId;
        console.log(productId);
        const user = await userModel.findOne({ _id: req.session.user._id});
        const isProduct = user.cart.find( doc => { return doc.product == productId  });
        console.log('isProduct : ');
        console.log(isProduct);
        if(isProduct){
            return res.status(400).json({ error: 'Product is already existed in the cart' });
        }
        if(!req.session.userIn){
            console.log(req.session.userIn);
            res.status(400).json({ error: 'user is not logged in'});
        }
        const product = await productModel.findById(productId);

        if(!product) return res.status(404).json({ error: 'Product not found' });
        if(product.quantity <= 0) return res.status(400).json({ error: 'out of stock'});
        if(!user || !user._id) return res.status(401).json({ error: 'User not authenticated' });

        const result = await userModel.findByIdAndUpdate(user._id , { $push: { cart: { product: productId } }});
        console.log(result);
        res.status(200).json({ message: 'product successfully added to cart'})
    }catch(err){
        console.error(err);
    }
} 




exports.cartCountPatch = async (req, res) => {
    const productId = req.params.productId;
    const nums = req.params.nums;
    const userId = req.params.userId;

    try {
        const user = await userModel.findById(userId);
        console.log(productId, nums, userId );

        if (!user) {
            return res.status(404).json({ error: 'User not found', redirect: '/login' });
        }

        // Find the index of the product in the cart array
        const productIndex = user.cart.findIndex(item => item._id.toString() === productId);

        console.log(user.cart[productIndex].count*1);
        if(nums > 10 || nums <= 0 ){
            return res.status(404).json({ error: 'maximum cart items 10' });
        }
        // If the product is not found in the cart, return an error
        if (productIndex == -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        user.cart[productIndex].count = parseInt(nums);

        // Save the updated user document
        await user.save();
        // const product = await productModel.findByIdAndUpdate(productId, { $set: { $inc: -nums }});
        // console.log(product)

        console.log('User updated successfully:', user);

        return res.status(200).json({ message: 'Cart updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




exports.addAddressPatch = async ( req, res ) => {
    try{
        console.log('hai from addAddressPatch')
        const userId = req.params.userId;
        const { name, email, phone, pincode, state, country, altphone, city, landmark} = req.body;
        console.log(name, email, phone, pincode, state, country, altphone, city, landmark);
        const result = await userModel.findByIdAndUpdate( userId, { $push:{ address: { name, email, phone, alt_phone: altphone, city, landmark, state, country, pincode } }});
        if (result) {
            console.log('User address updated successfully:', result);
            return res.status(200).json({ message: 'User address updated successfully', user: result });
        } else {
            // If the user was not found
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    }catch(err){
        console.log(err);
    }
};




exports.cartProductDelete = async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.user._id;
        console.log(productId, userId );
        const user = await userModel.findById(userId);

        const productIndex = user.cart.findIndex(item => item.product == productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        user.cart.splice(productIndex, 1);
        await user.save();
        res.status(200).json({ success: true, message: 'Product successfully removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




exports.deleteAddress = async ( req, res ) => {
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
}



exports.addressEditGet =  async ( req, res ) => {
    try{
        console.log('hellow enter')
        const addressId = req.params.addressId;
        const user = await userModel.findById(req.session.user._id);
        if(!user) return res.status(400).json({ error: 'user session expired, login again'});
        const selectedAddress = user.address.find( address => address._id.toString() === addressId );
        console.log('selectedAddress : ' + selectedAddress );
        return res.status(200).json(selectedAddress);
    }catch(err){
        console.log(err);
    }
}




exports.addressUpdatePatch = async (req, res) => {
    const addressId = req.params.addressId;
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(400).json({ error: 'User session expired, login again' });

        // Find the index of the address in the user's addresses array
        const addressIndex = user.address.findIndex(address => address._id == addressId);
        if (addressIndex === -1) return res.status(400).json({ error: 'User address not found' });

        // Update the fields of the found address
        const { name, email, phone, pincode, state, country, altphone, city, landmark } = req.body;
        console.log(name, email, phone, pincode, state, country, altphone, city, landmark);

        // Update the specific address within the array
        user.address[addressIndex].name = name;
        user.address[addressIndex].email = email;
        user.address[addressIndex].phone = phone;
        user.address[addressIndex].pincode = pincode;
        user.address[addressIndex].state = state;
        user.address[addressIndex].country = country;
        user.address[addressIndex].alt_phone = altphone;
        user.address[addressIndex].city = city;
        user.address[addressIndex].landmark = landmark;

        // Save the updated user document
        await user.save();

        console.log('User address updated successfully');
        return res.status(200).json({ message: 'User address updated successfully', user: user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




exports.checkoutPost =  async ( req, res ) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(req.session.user._id);
        const address = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            altphone: req.body.altphone,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            landmark: req.body.landmark,
        }

        const productDetails = await getProductDetails(user.cart);

        let totalPrice = 0;
        productDetails.forEach((item, index ) => {
            const itemPrice = item.product ? (item.product.price || 1) : 0;
            totalPrice += itemPrice * item.count;
        });
        
        const products = productDetails.map( async ( item, index ) => {
            let dbProduct = await productModel.findById(item.product._id);
            if(dbProduct.quantity - item.count <= 0 ) return res.status(400).json({ error: 'product is not available'});
            dbProduct.quantity -= item.count;
            await dbProduct.save();
            return {
                productId: item.product._id,
                quantity: item.count,
                productTotalPrice: item.product.price * item.count,
            }
        })

        if(!user) return res.status(400).json({ error: 'login again, session expired'});
        const order = await orderModel({
            userId: req.params.userId,
            products,
            address,
            orderNotes: req.body.ordernotes,
            totalPrice ,
            paymentMethod: 'COD'
        });

        const savedOrder = await order.save();
        console.log(savedOrder);
        if(savedOrder){
            user.cart = [];
            await user.save();
            return res.json({ success: true, message: 'Order created successfully '});
        } 
            
    }catch(err){
        console.error(err);
    }
}