
const adminModel = require('../models/admin');
const categoryModel = require('../models/category');
const userModel = require('../models/user');
const productModel = require('../models/products');




exports.adminLoginGet = ( req, res ) => {
    res.render('admin-login.ejs');
}


exports.adminLoginPost = async ( req, res ) => {
    const { email, password } = req.body;
    console.log( 'email : ' + email, 'password : ' + password );

    const admin = await adminModel.findOne({ email });
    console.log('admin : ' + admin );

    // console.log('admin.password: ' + admin.password, 'admin.email : ' + admin.email );

    if(!email || !password){
        return res.status(400).json({ error: 'email and password is required '});
    }

    if(!admin || admin === null ){
        return res.status(400).json({ error: 'email is incorrect'});
    }

    if(admin.password !== password){
        return res.status(400).json({ error: 'password is incorrect'});
    }

    if(admin.password === password){
        req.session.admin = true;
        console.log('req.session.isAdmin : ' + req.session.admin );
        return res.status(200).json({ success: 'perfect admin'});
    }

    return res.status(400).json({ error: 'somethign make me wrong'});
}



exports.adminHomeGet = ( req, res ) => {
    res.render('admin-home.ejs');
}






exports.logout = ( req, res ) => {
    delete req.session.admin;
    res.redirect('login');
}