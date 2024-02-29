
const express = require('express');
const adminController = require('../controllers/adminController');
const admProductController = require('../controllers/admProductController');
const admUserController = require('../controllers/admUserController');
const admCategoryController = require('../controllers/admCategoryController');
const adminModel = require('../models/admin');
const adminAuth = require('../middlewares/authAdmin');
const userModel = require('../models/user');
const categoryModel = require('../models/category');
const productModel = require('../models/products');
// const {upload} = require('../middlewares/functions');

const router = express.Router();



const multer = require('multer')
// const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      console.log('inside multer diskStorage ');
      cb(null, './public/products');
    },
    filename: function(req, file, cb) {
      const fileName = Date.now() + file.originalname;
      cb(null, fileName );
      console.log('filename : ' + fileName );
    },
    onFileUploadStart: function (file) {
        console.log(file.fieldname + ' is starting ...')
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
});

const upload = multer({ storage: storage });



router.get('/login', adminAuth.adminSessionYes, adminController.adminLoginGet );
router.post('/login',  adminController.adminLoginPost );

// Home page
router.get('/',  adminAuth.adminSessionNo, adminController.adminHomeGet );



// To get user list for admin;
router.get('/users', adminAuth.adminSessionNo, admUserController.adminUsersGet );
// To  block and unblock the user;
router.post('/user-status', admUserController.userStatusPost );



// admin category
router.get('/category', adminAuth.adminSessionNo, admCategoryController.categoryGet );
router.post('/category',  admCategoryController.createCategoryPost );
router.patch('/category',  admCategoryController.categoryListEditPatch );
router.delete('/category/:id',  admCategoryController.categoryDelete );



// admin product 
router.get('/products', adminAuth.adminSessionNo,  admProductController.getProducts );
router.get('/products/add', adminAuth.adminSessionNo,  admProductController.addProductGet );
router.patch('/product', admProductController.productListEditPatch );
router.delete('/product/:id', admProductController.productDelete );

router.get('/logout', adminController.logout );



router.post('/products/add', upload.array('images', 6 ), async ( req, res ) => {
   try{
        console.log('inside admin/products/add');
        const { name, price,quantity, size, color, description, details } = req.body;
        const colorsArray = color.split(',').map(c => c.trim());
        console.log( name, price )

        const images = [];
        console.log(req.files);
        if(!name || !price || !quantity ){
            res.status(400).json({ error: 'name price and quantity are required'});
        }
        if (!req.files || req.files.length === 0) {
            console.log('At least one image is required');
            res.status(400).json({ error: 'atleast one image is required '});
        }        

        for(const file of req.files){
            images.push(file.filename)
        }
        console.log('images[] : ' + images );
        images.length

        const product = {
            name,
            price,
            quantity,
            size,
            images,
            color: colorsArray,
            description,
            details
        }
        const result = await productModel.create(product);
        console.log(result)
        if(result){
            return res.status(201).json({ success: true, message: 'product created successfully'});
        }
   }
   catch(error){
        console.log(`product port error : ${error}`);
   }

} );




module.exports = router;