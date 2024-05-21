

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




exports.productListEditPatch =  async ( req, res ) => {
    const { productId, action } = req.body;
    try{
        if(!action){
            const result = await productModel.findOneAndUpdate({ _id: productId }, { status: false }, { new: true });
        }else {
            const result = await productModel.findOneAndUpdate({ _id: productId }, { status: true }, { new: true });
        }
        res.json({ message: 'created' });
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.getProducts = async ( req, res ) => {
    const products = await productModel.find({}).sort({ create_at: -1, modified_at: -1 }).populate('category');
    const categories = await categoryModel.find({});
    res.render('admin-products', { products, categories });
}




exports.addProductGet = async ( req, res ) => {
    try{
        const categorys = await categoryModel.find({});
        res.render('add-product.ejs', { categorys });
    }catch(err){
        console.log(err);
    }
}





exports.addProductPost =  async ( req, res ) => {
    try{
        const images = [];
        const { name, price, quantity, brand, size, color, description, category, details } = req.body;
        const files = req.files.filename;
        if (!files || files.length === 0) {
           return res.json({ error: 'No Images selected'});
        } else {
            for (const file of files) {
                images.push(files.filename);
            }
        }
        const body = { name, price, quantity, brand, size, color, description, details, images: images };
        const productResult = await productModel.create(body);
        if(!productResult){
            res.status(400).json({ error: `can't upload into database`});
        }
        res.status(201).json({ message: 'product Created successfully'})
    }
    catch(err){
     console.log('error : ' + err );
    }
 }




exports.productDelete = async ( req, res ) => {
    const productId = req.params.id;
    const result = await productModel.findOneAndDelete({ _id: productId });
    return res.json({ message: 'deleted'});
}





exports.productsAdd = async ( req, res ) => {
    try{
         const { name, price,quantity, brand, size, color, description, category, details } = req.body;
         const colorsArray = color.split(',').map(c => c.trim());
 
         const images = [];
         if(!name || !price || !quantity ) return res.status(400).json({ error: 'name price and quantity are required'});
         if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'atleast one image is required '}); 
 
         for(const file of req.files){
             images.push(file.filename)
         }
 
         const product = {
             name,
             price,
             quantity,
             brand,
             size,
             images,
             color: colorsArray,
             description,
             details,
             category
         }
         const result = await productModel.create(product);
         if(result){
             return res.status(201).json({ success: true, message: 'product created successfully'});
         }
    }
    catch(error){
         console.log(`product port error : ${error}`);
    }
 
 } 




 exports.productEditGet = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const categorys = await categoryModel.find({});
        const product = await productModel.findOne({ _id: productId }).populate('category');
        res.render('edit-product', { product, categorys });
    }
    catch(err){
        console.log(err);
    }
}





exports.productEditPost = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const dbProduct = await productModel.findById(productId);
        const { name, price,quantity, brand, size, color, description, category, details } = req.body;
        const colorsArray = color.split(',').map(c => c.trim());

        let imagesArray = [];
        if(!name || !price || !quantity ) return res.status(400).json({ error: 'name price and quantity are required'});

        if(req.files || req.files.length > 0)
            for(const file of req.files){
                imagesArray.push(file.filename)
        }
        if(req.files.length <= 0 ){
            imagesArray = dbProduct.images;
        }

        const product = {
            name,
            price,
            quantity,
            brand,
            size,
            images: imagesArray,
            color: colorsArray,
            description,
            category,
            details
        }
        const result = await productModel.findByIdAndUpdate( productId, product,  );
        if(result) return res.status(201).json({ success: true, message: 'product updated successfully'});
   }
   catch(error){
        console.log(`product port error : ${error}`);
   }
}


exports.productImageDelete = async ( req, res ) => {
    const imageUrl = req.query.imageUrl;
    const productId = req.query.productId;
    try{
        if(!imageUrl || !productId) return res.status(400).json({ success: false, error: 'product image or product not found in db'});
        const result = await productModel.findByIdAndUpdate(productId, { $pull: { images: imageUrl }});
        if(result) return res.status(200).json({ success: true, message: 'Image removed from product details.'});
    }catch(err){
        console.log(err);
    }
}