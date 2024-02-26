
const express = require('express');
const adminController = require('../controllers/adminController')
const adminModel = require('../models/admin');
const userModel = require('../models/user');
const categoryModel = require('../models/category');
const productModel = require('../models/products');


const router = express.Router();


router.get('/login', adminController.adminLoginGet );
router.post('/login', adminController.adminLoginPost );

// Home page
router.get('/', adminController.adminHomeGet );



// To get user list for admin;
router.get('/users', adminController.adminUsersGet );
// To  block and unblock the user;
router.post('/user-status', adminController.userStatusPost );



// To get admin category Page;
router.get('/category', adminController.categoryGet );
// To create to new category;
router.post('/category', adminController.createCategoryPost );
// To change list and unlist of status of category;
router.patch('/category', adminController.categoryListEditPatch );
// To delete a cateogory;
router.delete('/category/:id', adminController.categoryDelete );



// To get admin product list
router.get('/products', async ( req, res ) => {
    const products = await productModel.find({}).sort({ create_at: -1, modified_at: -1 });
    res.render('admin-products', { products });
})

router.get('/products/add', ( req, res ) => {
    res.render('add-product.ejs');
})

router.post('/products/add', async ( req, res ) => {
   try{
    const { name, price, quantity , size, color, description, details, category, status, image } = req.body;
    console.log(name, price, quantity , size, color, description, details, category, status, image);
    const body = { name, price, quantity , size, color, description, details, category, status, image };
    console.log('body : ' + body);
    const productResult = await productModel.create(body);
    if(!productResult){
        res.status(400).json({ error: `can't upload into database`});
    }
    res.status(201).json({ message: 'product Created successfully'})
    console.log('productResult : ' + productResult );
   }
   catch(err){
    console.log('error : ' + err );
   }
})

router.patch('/product', adminController.productListEditPatch );

router.delete('/product/:id', adminController.productDelete );

module.exports = router;