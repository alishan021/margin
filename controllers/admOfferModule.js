const productModel = require('../models/products');
const categoryModel = require('../models/category');
const offerModel = require('../models/offerModel');


exports.offerModuleGet = async ( req, res ) => {
    const products = await productModel.find({ status: true });
    const categories = await categoryModel.find({ isActive: true });
    const offerProducts = await offerModel.find({ product: { $exists: true }}).populate('product');
    const offerCategory = await offerModel.find({ category: { $exists: true }}).populate('category');
    res.render('adm-offer-module.ejs', { products, categories, offerProducts, offerCategory });
}


exports.offerModulePost = async ( req, res ) => {
    console.log('Inside productOfferPost');
    try{
        const { offerValue, startDate, endDate, description, offerType, product, category } = req.body;
        if(!category && !product) return res.json({ error: 'Select the offer Item'});
        if( !startDate || !endDate || !offerValue || !offerType || !description ) return res.json({ error: "All fields are required"});
        console.log(req.body)
        const offer = new offerModel(req.body);
        const offerSave = await offer.save();
        console.log(offerSave);
        res.json({ success: true, message: 'Offer created successfully'});
    }catch(err){
        console.error(`Error inside productOfferPost : ${err}`);
    }
}



// exports.categoryOfferPost = async ( req, res ) => {
//     console.log('Inside categoryOfferPost');
//     try{
//         console.log(req.body)
//         res.json({ success: true, message: 'successful'});
//     }catch(err){
//         console.error(`Error inside categoryOfferPost : ${err}`);
//     }
// }