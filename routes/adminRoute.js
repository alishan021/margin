
const express = require('express');
const adminController = require('../controllers/adminController');
const admProductController = require('../controllers/admProductController');
const admUserController = require('../controllers/admUserController');
const admCategoryController = require('../controllers/admCategoryController');
const admOrdersController = require('../controllers/admOrdersController');
const admCouponController = require('../controllers/admCouponController');
const admSalesReportController = require('../controllers/admSalesReport');
const admOfferModule = require('../controllers/admOfferModule');
const adminModel = require('../models/admin');
const adminAuth = require('../middlewares/authAdmin');
const userModel = require('../models/user');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const productModel = require('../models/products');
// const {upload} = require('../middlewares/functions');

const router = express.Router();



const multer = require('multer')
// const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/products');
    },
    filename: function(req, file, cb) {
      const fileName = Date.now() + file.originalname;
      cb(null, fileName );
    },

});

const upload = multer({ storage: storage });



router.get('/login', adminAuth.adminSessionYes, adminController.adminLoginGet );
router.post('/login',  adminController.adminLoginPost );

// Home page
router.get('/',  adminController.adminHomeGet );
router.get('/dashboard/data', adminController.dashBoardDetails );
router.get('/dashboard/data/custom', adminController.customDetails );


// To get user list for admin;
router.get('/users', adminAuth.adminSessionNo, admUserController.adminUsersGet );
// To  block and unblock the user;
router.post('/user-status', admUserController.userStatusPost );



// admin category
router.get('/category', adminAuth.adminSessionNo, admCategoryController.categoryGet );
router.post('/category',  admCategoryController.createCategoryPost );
router.patch('/category',  admCategoryController.categoryListEditPatch );
router.delete('/category/:id',  admCategoryController.categoryDelete );
router.get('/category/:categoryId', admCategoryController.categoryUpdateGet );
router.patch('/category/update/:categoryId', admCategoryController.categoryUpdatePut );



// admin product 
router.get('/products', adminAuth.adminSessionNo,  admProductController.getProducts );
router.get('/products/add', adminAuth.adminSessionNo,  admProductController.addProductGet );
router.patch('/product', admProductController.productListEditPatch );
router.delete('/product/:id', admProductController.productDelete );


router.post('/products/add', upload.array('images', 6 ), admProductController.productsAdd );
router.get('/products/edit/:productId', admProductController.productEditGet );
router.post('/products/edit/:productId',  upload.array('images', 6 ), admProductController.productEditPost );
router.delete('/products/delete-image', admProductController.productImageDelete );

router.get('/order', admOrdersController.orderGet );
router.patch('/order-status', admOrdersController.orderStatusPatch );

router.get('/coupon', admCouponController.couponGet );
router.get('/coupon/add', admCouponController.addCouponGet );
router.post('/coupon/add', admCouponController.addCouponPost );
router.delete('/coupon/delete/:couponId', admCouponController.couponDelete );

router.get('/sales-report/', admSalesReportController.salesReportGet );
// router.get('/sales-report/custom/:fromDate/:toDate', admSalesReportController.customSalesReportGet );
router.get('/sales-report/:reportType', admSalesReportController.customSalesReportGet);
router.get('/sales/pdf/:reportType', admSalesReportController.genPdfGet );
router.get('/sales-report-total', admSalesReportController.salesReportTotalGet );
router.get('/sales/excel/:reportType', admSalesReportController.salesReportExcelGet );

router.get('/offer-module', admOfferModule.offerModuleGet );
router.post('/offer-module', admOfferModule.offerModulePost );
// router.post('/category-offer', admOfferModule.categoryOfferPost );

router.get('/logout', adminController.logout );


// // 404 Not Found handler
// router.get('*', (req, res, next) => {
//   console.log('response : ' + res );
//   res.status(404).send('404 Error')
// });

// // 500 Internal Server Error handler
// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('500 Error');
// });


module.exports = router;