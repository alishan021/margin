
const categoryModel = require('../models/category');
const productModel = require('../models/products');





exports.categoryGet =  async ( req, res ) => {
    const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
    const products = await productModel.find({}, { name: 1, _id: -1, category: 1 });
    console.log( products );
    res.render('admin-category.ejs', { categorys, products });
}




exports.createCategoryPost = async ( req, res ) => {
    try{
     console.log('inside add category');
     const { category, status } = req.body;
     console.log('category  : ' + category);
     if(!category || category == '' ){
         console.log(`category can't be null`);
         return res.status(400).json({ error: 'category name is required '});
     }
     const checkCategory = await categoryModel.findOne({ categoryName: category.toLowerCase() })
     console.log(checkCategory)
     if(checkCategory){
         return res.status(400).json({ error: 'category is already existed plus'});
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
    try{
        console.log('Inside delete category');
        const categoryId = req.params.id;
        const result = await categoryModel.findOneAndDelete({ _id: categoryId });
        console.log('successfully deleted');
        return res.status(200).json({ message: 'deleted'});
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.categoryUpdateGet = async ( req, res ) => {
    try{
        const categoryId = req.params.categoryId;
        const category = await categoryModel.findById(categoryId);
        if(!category){
            return res.status(400).json({ error: 'no category found'});
        }
        return res.json({ categoryName: category.categoryName });
    }
    catch(err){
        console.log(`error : ${err}`);
    }
}




exports.categoryUpdatePut = async ( req, res ) => {
    try{
        console.log('inside the categoryupdatePut');
        const { categoryName } = req.body;
        const categoryId = req.params.categoryId;
        console.log('categoryId : ' + categoryId )
        const dbCategory = await categoryModel.findById(categoryId, { categoryName: 1 });
        console.log(dbCategory);
        if(!dbCategory){
            return res.status(400).json({ error: 'category not found'});
        }
        const dbCategoryName = dbCategory.categoryName;
        console.log('dbCategoryName : ' + dbCategoryName );
        console.log('categoryName : ' + categoryName );
        if(dbCategoryName.toLowerCase().trim() == categoryName.toLowerCase().trim() ){
            return res.status(400).json({ error: 'category is already exist'});
        }
        const check = await categoryModel.findOne({ categoryName: categoryName.toLowerCase().trim() });
        console.log('check : ' + check );
        if(check){
            return res.status(400).json({ error: 'category is already exist'});
        }
        const result = await categoryModel.findByIdAndUpdate(categoryId, { categoryName: categoryName.toLowerCase() } );
        console.log(result);
        return res.status(200).json({ success: true, message: 'user updated successfully'});
    }
    catch(error){
        console.log('error : ' + error );
        return res.status(500).json({ error: 'Internal server error' });
    }
}