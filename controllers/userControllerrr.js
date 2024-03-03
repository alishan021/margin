

const middleware = require('../middlewares/functions');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user')
const productModel = require('../models/products')
const bcrypt = require('bcrypt');
// const productModel = require('../models/products');




exports.userHomeGet = ( req, res) => {
    console.log('userin : ' + req.session.userIn);
    res.render('index.ejs')
}



exports.userSignupGet = ( req, res ) => {
    res.render('signup.ejs');
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
        const isUser = await userModel.findOne({ email });

        if (!isUser) {
            return res.status(400).json({ error: 'User not found' });
        }
        if(!isUser.status){
            return res.status(400).json({ error: 'user is blocked by admin'});
        }

        const match = await bcrypt.compare(password, isUser.password);
        console.log('match : ' + match );
        if (match) {
            req.session.userIn = true;
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
        res.render('product.ejs', { product } );
    }
    catch(error){
        console.log(`error inside productGet : ${error}`);
    }
}





exports.productListGet = async ( req, res ) => {
    try{
        const products = await productModel.find({ status: { $ne: false } });
        const totalDocs = await productModel.find({ status: { $ne: false } }).count();
        res.render('product-list.ejs', { products, totalDocs });
   }
   catch(error){
    console.log('error in productListGet: ' + error );
    }
}





exports.errorPageGet = ( req, res ) => {
    res.render('404.ejs');
}