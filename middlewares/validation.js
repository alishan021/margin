const userModel = require('../models/user')



exports.validateSignupBody = async (req, res, next ) => {

    console.log('enter in to validatesignupbody');

    const { username, email, password, passwordRe } = req.body;
    req.session.user
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