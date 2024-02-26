
const adminModel = require('../models/admin');
const categoryModel = require('../models/category');
const userModel = require('../models/user');
const productModel = require('../models/products');




exports.adminLoginGet = ( req, res ) => {
    res.render('adminLogin.ejs');
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
        return res.status(200).json({ success: 'perfect admin'});
    }

    return res.status(400).json({ error: 'somethign make me wrong'});
}



exports.adminHomeGet = ( req, res ) => {
    res.render('admin-home.ejs');
}



exports.adminUsersGet = async ( req, res ) => {
    try{
        const users = await userModel.find({ }).sort({ createdAt: -1 });
        res.render('admin-users.ejs', { users });
    }catch(err){
        console.log(`error in adminUsersGet : ${err}`);
    }
}



exports.userStatusPost = async ( req, res ) => {
    try{
        const { userId, status } = req.body;
        if(status === false ){
            const result = await userModel.findOneAndUpdate({ _id: userId }, { status: false });
            return res.json({ message: result });
        }else {
            const result = await userModel.findOneAndUpdate({ _id: userId }, { status: true });
            return res.json({ message: result });
        }
    }
    catch(err){
        console.log(`error in userStatusPost route : ${err}`);
    }
}




exports.categoryGet =  async ( req, res ) => {
    const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
    res.render('admin-category.ejs', { categorys });
}




exports.createCategoryPost = async ( req, res ) => {
    try{
     console.log('inside add category');
     const { category, status } = req.body;
     console.log('category  : ' + category);
     if(!category || category == '' ){
         console.log(`category can't be null`);
         return res.json({ message: 'category name is required '});
     }
     const checkCategory = await categoryModel.findOne({ categoryName: category })
     console.log(checkCategory)
     if(checkCategory){
         return res.status(400).json({ error: 'category is already existed'});
     }
     const result = await categoryModel.create({ categoryName: category });
     console.log('result : ' + result );
     return res.status(201).json({ message: 'category created successfully' });
    }
    catch(err){
     console.log('error : ' + err );
    }
}





exports.categoryListEditPatch =  async ( req, res ) => {
    console.log('inside add category');
    const { categoryId, action } = req.body;
    console.log('category  : ' + categoryId, 'action : ' + action );
    console.log('after req.body');
    try{
        if(!action){
            const result = await categoryModel.findOneAndUpdate({ _id: categoryId }, { isActive: false }, { new: true });
            console.log('result : ' + result );
        }else {
            const result = await categoryModel.findOneAndUpdate({ _id: categoryId }, { isActive: true }, { new: true });
            console.log('result : ' + result );
        }
        res.json({ message: 'created' });
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.categoryDelete = async ( req, res ) => {
    console.log('Inside delete category');
    const categoryId = req.params.id;
    const result = await productModel.findOneAndDelete({ _id: categoryId });
    console.log('successfully deleted');
    return res.json({ message: 'deleted'});
}







exports.productListEditPatch =  async ( req, res ) => {
    console.log('inside add category');
    const { productId, action } = req.body;
    console.log('category  : ' + productId, 'action : ' + action );
    console.log('after req.body');
    try{
        if(!action){
            const result = await productModel.findOneAndUpdate({ _id: productId }, { status: false }, { new: true });
            console.log('result : ' + result );
        }else {
            const result = await productModel.findOneAndUpdate({ _id: productId }, { status: true }, { new: true });
            console.log('result : ' + result );
        }
        res.json({ message: 'created' });
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.productDelete = async ( req, res ) => {
    console.log('Inside delete category');
    const productId = req.params.id;
    const result = await productModel.findOneAndDelete({ _id: productId });
    console.log('successfully deleted');
    return res.json({ message: 'deleted'});
}