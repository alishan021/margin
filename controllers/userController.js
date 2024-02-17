
const middleware = require('../middlewares/validation');
const otpModel = require('../models/db-otp');
const userModel = require('../models/user')
const bcrypt = require('bcrypt');

exports.userHomeGet = ( req, res) => {
    res.render('index.ejs')
}



exports.userSignupGet = ( req, res ) => {
    res.render('signup.ejs');
}



exports.userSignupPost = async ( req, res, next ) => {
    try{
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
    
        const { username, email, password } = req.body;

        req.session.userEmail = email;
    
        const hashedPassword = await bcrypt.hash( password, saltRounds )        
    
        const userData = { username, email, password: hashedPassword };
        const result = await userModel.create(userData);
    
        console.log(result);    
        res.json({ success: true });
       }
    catch(error) {
        console.log('error : ' + error );
    }
    next();
}



exports.sendOtp = async ( req, res , next ) => {

    console.log('send otp');

    const otpGen = require('otp-generator');

    const otp = otpGen.generate( 6, { 
        upperCaseAlphabets: false,
         lowerCaseAlphabets: false, 
         specialChars: false,
    })

    console.log(otp);

    const newDoc = { user: req.session.userEmail, otp };
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
        to: 'marginwings@gmail.com',
        subject: 'sending email to you',
        text: `Your otp to verify your account is ${otp}, Thank you`
    }


    transport.sendMail( mailOptions, async ( err, info ) => {
        if(err) console.log('error : ' + err);
        else{
            
            console.log('success : ' + info.response );
        }
    })

    next();
}



exports.redirecToOtp = ( req, res) => {
    res.redirect('/signup/otp');
}



exports.signupOtpGet = ( req, res) => {
    res.render('signupOtp.ejs');
}



// exports.signupOtpPost =  async ( req, res) => {
//     const { otp } = req.body;
//     const dbOtp = await otpModel.find({ email: req.session.userEmail });

//     console.log( `otp : ${otp},  dbOtp : ${dbOtp}`);

//     if( otp != dbOtp ){
//         return res.status(400).json({ success: false, error: 'otp is not correct'});
//     }
//     // if()
//     if( otp * 1 === dbOtp ){
//         return res.status(400).json({ success: true, message: 'otp verification successful'})
//     }
// }



exports.signupOtpPost = async (req, res) => {
    const { otp } = req.body;
    try {
        // Use await with exec() to execute the query and await the result
        const dbOtp = await otpModel.findOne({ otp }).exec();

        console.log(`otp : ${otp}, dbOtp :, ${dbOtp}, email : ${req.session.userEmail}`);

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




exports.loginGet = ( req, res ) => {
    res.render('login.ejs');
}