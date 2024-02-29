

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
const multer = require('multer');
const upload = require('../middlewares/functions');




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




exports.getProducts = async ( req, res ) => {
    const products = await productModel.find({}).sort({ create_at: -1, modified_at: -1 });
    res.render('admin-products', { products });
}




exports.addProductGet =  ( req, res ) => {
    res.render('add-product.ejs');
}





exports.addProductPost =  async ( req, res ) => {
    try{
        const images = [];
        const { name, price, quantity , size, color, description, details } = req.body;
        console.log(name, price, quantity , size, color, description, details );
        console.log('req.files : ' + req.files );
        const files = req.files.filename;
        console.log('after requiest files filename');
        console.log('files : ' + files );
        //  console.log('req img : ' + req.images );
        if (!files || files.length === 0) {
           console.log('No files uploaded');
        } else {
            for (const file of files) {
                images.push(files.filename);
            }
        }
        const body = { name, price, quantity , size, color, description, details, images: images };
        console.log('body : ' + body);
        const productResult = await productModel.create(body);
        if(!productResult){
            res.status(400).json({ error: `can't upload into database`});
        }
        console.log('productResult : ' + productResult );
        res.status(201).json({ message: 'product Created successfully'})
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