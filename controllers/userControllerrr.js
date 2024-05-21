

const otpModel = require('../models/db-otp');
const userModel = require('../models/user')
const productModel = require('../models/products')
const bcrypt = require('bcrypt');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const couponModel = require('../models/coupons');
const { search } = require('../routes/userRoute');
const PDFDocument = require('pdfkit');




exports.userHomeGet = async ( req, res) => {
    try{
        const products = await productModel.find({ status: true }, { }).limit(8).populate('category');
        const featuredProducts = await productModel.find({ status: true }, { }).limit(7).populate('category').sort({ price: -1 });
        const featuredProduct = featuredProducts.splice(0 , 1);
        console.log(featuredProduct)
        res.render('index.ejs', { userIn: req.session.userIn, products, featuredProducts, featuredProduct: featuredProduct[0] });
    }catch(err){
        console.error(`Error at userHomeGet : ${err}`);
    }
}



exports.userSignupGet = ( req, res ) => {
    res.render('signup.ejs', { userIn: req.session.userIn });
}



exports.validateSignupBody = async (req, res, next ) => {


    const body = { username, email, password, passwordRe, referalCode } = req.body;
    req.session.userEmail = email;
    req.session.signupBody = body;

    const isEmailValid = (email) => {
      const emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
      return emailRegex.test(email)
    }

    if(!username || !email || !password || !passwordRe ) return res.status(400).json({ error: 'All fields are required'});
    if(!isEmailValid(email)) return res.status(400).json({ error: 'email structure is not right'});
    if(password !== passwordRe) return res.status(400).json({ error: 'password is not matching'});
    
    const isUnique = await userModel.findOne({ email });
    if(isUnique) return res.status(400).json({ error: 'email is already registered'});

    res.json({ message: 'validation is alright'});
}




exports.sendOtp = async ( req, res , next ) => {

    if(req.body.email){
        req.session.userEmail = req.body.email;
    }
    const email = req.session.userEmail
    const otpGen = require('otp-generator');

    const otp = otpGen.generate( 6, { 
        upperCaseAlphabets: false,
         lowerCaseAlphabets: false, 
         specialChars: false,
    })


    const newDoc = { user: req.session.userEmail, otp };
    const docRes = await new otpModel(newDoc)
            .save();

    console.log(docRes);

    const nodemailer = require('nodemailer');
    
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test102201102@gmail.com',
            pass: 'gunk xzwl blxq esjr',
        }
    });

    const mailOptions = {
        from: 'test102201102@gmail.com',
        to: email,
        subject: 'sending email to you',
        text: `Your otp to verify your account is ${otp}, Thank you`
    }


    transport.sendMail( mailOptions, async ( err, info ) => {
        if(err) console.log('error : ' + err);
        else{
            
            console.log('success : ' + info.response );
        }
    })

    next();
}




exports.signupOtpGet = ( req, res) => {
    res.render('signupOtp.ejs');
}




exports.signupOtpPost = async (req, res) => {
    const { otp } = req.body;
    try {
        const dbOtp = await otpModel.findOne({ otp }).exec();

        if(!otp) return res.status(400).json({ success: false, error: 'OTP is required' });
        if (!dbOtp || !dbOtp.otp ) return res.status(400).json({ success: false, error: 'OTP is wrong' });
        if (dbOtp.otp !== otp ) return res.status(400).json({ success: false, error: 'OTP is not correct' });
        if (dbOtp.user !== req.session.userEmail ) return res.status(400).json({ success: false, error: 'email is not matching' });

        // If OTP matches, return success response
        return res.status(200).json({ success: true, message: 'OTP verification successful' });
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};




exports.userSignupPost = async ( req, res, next ) => {
    try{
        const { username, email, password, referalCode } = req.session.signupBody;
    
        const hashedPassword = await bcrypt.hash( password, parseInt(process.env.SALTROUNDS) );   
    
        const userData = { username, email, password: hashedPassword };
        const result = await userModel.create(userData);
        if( result || referalCode ) {
            if(!referalCode || referalCode === "" || referalCode == null ) return res.redirect('/login'); 
            const user = await userModel.findOne({ referalCode: referalCode });
            if(user) {
                user.wallet.amount += 100;
                await user.save();
            }
        }
    
        res.redirect('/login');
       }
    catch(error) {
        console.error('userSignupPost Error : ' + error );
    }
}



exports.checkReferalcode = async ( req, res ) => {
    const referalCode = req.params.referalCode;
    try{
        const findReferalCode = await userModel.findOne({ referalCode: referalCode });
        if(findReferalCode) return res.json({ success: true, message: 'Referal code is valid'});
        else return res.json({ success: false, message: "can't find the referal code, try again."});
    }catch(err){
        console.log('Error on checkReferalcode : ' + err )
    }
}




exports.redirecToOtp = ( req, res) => {
    res.redirect('/signup/otp');
}



exports.loginGet = ( req, res ) => {
    res.render('login.ejs');
}



exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
        return emailRegex.test(email);
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isEmailValid(email)) {
        return res.status(400).json({ error: 'Email format is wrong' });
    }

    try {
        const userDetails = await userModel.findOne({ email });

        if (!userDetails) {
            return res.status(400).json({ error: 'User not found' });
        }
        if(!userDetails.status){
            return res.status(400).json({ error: 'user is blocked by admin'});
        }

        const match = await bcrypt.compare(password, userDetails.password);
        if (match) {
            req.session.userIn = true;
            req.session.user = userDetails;
            return res.status(200).json({ success: true, message: 'Authentication successful' });
        } else {
            return res.status(400).json({ success: false, error: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}




exports.userLogout = ( req, res ) => {
    delete req.session.userIn;
    delete req.session.user;
    res.redirect(`/`);
}





exports.forgotPasswordGet = ( req, res ) => {
    res.render('forgot-password.ejs');
}




exports.loginForgotPasswordOtp = async ( req, res, next ) => {
    const email = req.body.email;
    const user = await userModel.findOne({ email });
    if(!user){
        res.status(400).json({ error: 'user not found'});
    }
    req.session.userEmail = email;
    next();
}




exports.successMessage = ( req, res ) => {
    res.status(201).json({ message: 'otp send to your email'});
}




exports.validateOtpPost = async (req, res) => {
    const { otp, email } = req.body;
    try {
        // Use await with exec() to execute the query and await the result
        const dbOtp = await otpModel.findOne({ otp }).exec();

        if (!dbOtp || !otp ) return res.status(400).json({ success: false, error: 'otp is not recieved, try resend otp' });
        if (dbOtp.otp !== otp ) return res.status(400).json({ success: false, error: 'OTP is Invalid' });
        if (dbOtp.user !== req.session.userEmail ) return res.status(400).json({ success: false, error: 'email is not matching' });
        // If OTP matches, return success response
        if(otp === dbOtp.otp) return res.status(200).json({ success: true, message: 'OTP verification successful' });

        return res.json({ error: "something wrong on server side"})
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};




exports.newPasswordGet = ( req, res ) => {
    res.render('new-password.ejs');
}



exports.newPasswordPost = async ( req, res ) =>{
    try{
        const { password, passwordre } = req.body;
        if(!password || !passwordre ){
            return res.status(400).json({ error: 'all fields are required!'});
        }
        if( password.length < 6 || passwordre.length < 6 ){
            return res.status(400).json({ error: 'password must be greaterthan 6'});
        }
        if( password !== passwordre ){
            return res.status(400).json({ error: 'password is not matching!'});
        }

        const hashedPassword = await bcrypt.hash( password, process.env.SALTROUNDS * 1 );   
        req.session.some = 'hai';
        const result = await userModel.findOneAndUpdate({ email: req.session.userEmail}, { password: hashedPassword });

        return res.status(201).json({ message: 'everything is allright'});
    }
    catch(err){
        console.log('error : ' + err );
    }
}




exports.productGet = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const product = await productModel.findById( productId );
        const category = await categoryModel.findOne({ _id: product.category });
        res.render('product.ejs', { product, category, userIn: req.session.userIn } );
    }
    catch(error){
        console.log(`error inside productGet : ${error}`);
    }
}





exports.productListGet = async ( req, res ) => {
    try{
        const products = await productModel.find({ status: { $ne: false } });
        const totalDocs = products.length;
        const categorys = await categoryModel.find({});
        res.render('product-list.ejs', { products, totalDocs, userIn: req.session.userIn, categorys });
   }
   catch(error){
    console.log('error in productListGet: ' + error );
    }
}




exports.productListGetSortBy = async (req, res) => {
    try {
        // Extracting query parameters with default values
        const { sortBy } = req.params;
        const { search = "", category = "", min = 0, max = Infinity } = req.query;

        // Parsing category to array if provided
        let categories = category ? category.split(",") : [];
        // Aggregation pipeline stages
        const pipeline = [
            // Match stage for filtering
            {
                $match: {
                    status: { $ne: false },
                    name: { $regex: search, $options: "i" }, // Case-insensitive search
                    category: { $in: categories },
                    price: { $gte: parseInt(min), $lte: parseInt(max) }
                }
            }
        ];

        // Sorting stage based on sortBy parameter
        if (sortBy === "a-to-z") {
            pipeline.push({ $sort: { name: 1 } });
        } else if (sortBy === "z-to-a") {
            pipeline.push({ $sort: { name: -1 } });
        } else if (sortBy === "low-to-high") {
            pipeline.push({ $sort: { price: 1 } });
        } else if (sortBy === "high-to-low") {
            pipeline.push({ $sort: { price: -1 } });
        } else if (sortBy === "new-arrivals") {
            pipeline.push({ $sort: { create_at: -1 } });
        }

        // Executing aggregation pipeline
        const products = await productModel.aggregate(pipeline);

        // Sending response
        res.render("product-list.ejs", {
            products,
            totalDocs: products.length,
            userIn: req.session.userIn,
            categorys: await categoryModel.find({})
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};




exports.sortFilterGet = async (req, res) => {
    try {
        // Extract query parameters
        const sortBy = req.query.sort;
        const search = req.query.search || "";
        let category = req.query.category || [];
        const min = parseInt(req.query.min) || 0;
        const max = parseInt(req.query.max) || Infinity;

        // Define sort criteria based on sortBy parameter
        let sortCriteria;
        if (sortBy === "a-to-z") sortCriteria = { name: 1 };
        else if (sortBy === "z-to-a") sortCriteria = { name: -1 };
        else if (sortBy === "low-to-high") sortCriteria = { price: 1 };
        else if (sortBy === "high-to-low") sortCriteria = { price: -1 };
        else if (sortBy === "new-arrivals") sortCriteria = { created_at: -1 };

        // Build query for filtering products
        let query = productModel.find({ name: { $regex: search, $options: "i" } });

        // Apply additional filters
        if (category.length > 0) {
            let categories = category.split(',');
            query.where('category').in(categories);
        }
       
        query.where('price').gte(min).lte(max);

        // Apply sorting criteria
        if (sortCriteria) {
            query.sort(sortCriteria);
        }

        // Execute the query
        const products = await query.exec();

        // Return the filtered and sorted products
        return res.status(200).json({ success: true, data: products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};








exports.dashboardGet = async (req, res) => {
    const user = await userModel.findById(req.session.user._id);
    const orders = await orderModel
      .find({ userId: req.session.user._id })
      .populate('products.productId')
      .sort({ orderDate: -1 });
  
    for (let order of orders) {
      let isArriving = false;
      let isDelivered = true;
      let isCancelled = false;
      let isReturned = false;
  
      for (let product of order.products) {
        if (product.orderValid && !product.orderStatus && !product.returned) {
          isArriving = true;
          isDelivered = false;
        } else if (!product.orderValid && product.orderStatus && !product.returned) {
          // Do nothing, this product is delivered
        } else if (!product.orderValid && !product.orderStatus && !product.returned) {
          isCancelled = true;
          isDelivered = false;
        } else if (!product.orderValid && !product.orderStatus && product.returned) {
          isReturned = true;
          isDelivered = false;
        }
      }
  
      if(order.pending) {
        order.orderMessage = "Pending"
      } else if (isArriving) {
        order.orderMessage = 'Arriving';
      } else if (isDelivered) {
        order.orderMessage = 'Delivered';
      } else if (isCancelled) {
        order.orderMessage = 'Cancelled';
      } else if (isReturned) {
        order.orderMessage = 'Returned';
      } else {
        order.orderMessage = '...';
      }
    }
    
    const referalCodeMessage = `If a user Register with this code you will get ${process.env.REFERRAL_CODE_MONEY}Rs`
    res.render('dashboard.ejs', { userIn: req.session.userIn, user, orders, referalCodeMessage });
  };




exports.cartGet = async ( req, res ) => {
    let cartProducts = await userModel.findOne({ email: req.session.user.email }, { cart: 1 }).populate('cart.product');
    
    const user = await userModel.findById(req.session.user._id).populate('cart.product');
    let totalPrice = user.cart.reduce(( prev, curr ) => ( curr.product.quantity > 0 ) ? prev + curr.product.discountPrice * curr.count : prev + 0, 0 );
    let deliveryCharge = 0;
    if( totalPrice < 500 )  deliveryCharge = parseInt(process.env.DELIVERY_CHARGE);

    if (!cartProducts || !user ) return res.status(404).send('User session expired, login again');
    res.render('cart.ejs', { userIn: req.session.userIn, user, cartProducts, totalPrice, deliveryCharge });
}




exports.wishlistGet =  async ( req, res ) => {
    const user = await userModel.findById(req.session.user._id).populate('wishlist.product_id');
    res.render('wishlist.ejs', { userIn: req.session.userIn, user });
}



exports.wishlistPost = async ( req, res ) => {
    const productId = req.params.productId;
    try{
        if(!productId || productId === undefined ) return res.status(400).json({ error: 'product Id not found' });
        if(!req.session.user) return res.status(400).json({ redirect: '/login', error: 'User Not found, login again'});
        const user = await userModel.findById(req.session.user._id);
        const existingItem = user.wishlist.find(
            (item) => item.product_id.toString() === productId
        );
      
        if (existingItem) return res.status(400).json({ error: 'Product already exists in wishlist' });

        user.wishlist.push({ product_id: productId });
        user.save();
        if(user) return res.status(200).json({ success: true, message: 'product added to wishlist' })
        else return res.status(400).json({ error: `can't add product into wishlist`});
    }catch(err){
        console.log(err);
    }
}



exports.wishlistDelete = async ( req, res) => {
    const productId = req.params.productId;
    try{
        const user = await userModel.findById(req.session.user._id);
        user.wishlist.pull({ _id: productId});
        const result = await user.save();

       if(result) res.status(200).json({ success: true, message: 'product removed from the wishlist'})
       else res.status(400).json({ error: "something went wrong can't remove the product in wishlist"});
    }catch(err){
        console.log(err);
    }
}




exports.preferredAddressGet = ( req, res ) => {
    const addressId = req.params.addressId;
    req.session.addressId = addressId;
    if(!addressId || addressId === '' ) {
        return res.json({ message: 'address update as nothinge'});
    }
    if(addressId) return res.json({ message: 'address changed'});
}




exports.checkoutGet = async (req, res) => {
    try {
        const addressId = req.session.addressId;        
        const user = await userModel.findById(req.session.user._id).populate('cart.product');
        let totalPrice = user.cart.reduce(( prev, curr ) => ( curr.product.quantity > 0 ) ? prev + curr.product.discountPrice * curr.count : prev + 0, 0 );
        let deliveryCharge = 0;
        if( totalPrice < 500 )  deliveryCharge = (process.env.DELIVERY_CHARGE)*1;
        const coupons = await couponModel.find({});
        let address = user.address.find(item => item._id == addressId);
        if(!address) address = "";

        if (!user) return res.status(400).json({ error: 'User session expired, login again' });

        const productDetails = await getProductDetails(user.cart);

        res.render('checkout.ejs', { userIn: req.session.userIn, products: productDetails, user, address, coupons, totalPrice, deliveryCharge });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}



// Function to fetch product details for each item in the user's cart
async function getProductDetails(cart) {
    const productDetails = [];
    for (const item of cart) {
        const product = await productModel.findById(item.product);
        if(product.quantity <= 0) continue;
        if (product) {
            productDetails.push({
                product: product,
                count: item.count,
                _id: item._id,
                added_at: item.added_at
            });
        }
    }
    return productDetails;
}





exports.DashboardUserDetailsPatch = async ( req, res ) => {
    const { username, email, oldpassword, password, passwordre, referal_code } = req.body;
    const userSessionEmail = req.session.user.email; 
    if(!username || !email){
        return res.status(400).json({ error: 'username and email is required'});
    }
    if(email !== userSessionEmail){
        return res.status(400).json({ error: `please signin through ${userSessionEmail}`})
    }
    if(( password && passwordre ) && (password !== passwordre) ){
        return res.status(400).json({ error: 'password is not matching'});
    }
    if( password && password < 6 ){
        return res.status(400).json({ error: 'password need atlease 6 charcters'});
    }
    try{
        if( referal_code ) {
            let result = await userModel.findOne({ referalCode: referal_code});
            if( result ) return res.json({ error: 'try another referal code'});
        }
        if(!oldpassword || oldpassword == ''){
            const result = await userModel.updateOne({ email: userSessionEmail}, { $set: { username: username, referalCode: referal_code }});
            return res.status(200).json({ success: true, message: 'userDetails updated successfully'});
        } else{
            const passwordMatch = await bcrypt.compare( oldpassword, req.session.user.password );
            if(!passwordMatch) return res.status(400).json({ error: 'password is wrong'});

            const hashedPassword = await bcrypt.hash( password , parseInt(process.env.SALTROUNDS ));
            const result = await userModel.findOneAndUpdate({ email: userSessionEmail }, { $set: { username, password: hashedPassword, referalCode: referal_code }}, { new: true } );
            req.session.user.username = username;
            return res.status(200).json({ success: true, message: 'userDetails updated successfully'});
        }
    }
    catch(err){
        console.error(err);
    }
}



// Add prdocuts to cart
exports.cartPatch = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        if(!req.session.user) return res.json({ redirect: '/login', error: "Can't find user, Login again"});
        const user = await userModel.findOne({ _id: req.session.user._id});
        const isProduct = user.cart.find( doc => { return doc.product == productId  });
        if(isProduct){
            return res.status(400).json({ error: 'Product is already existed in the cart' });
        }
        if(!req.session.userIn){
            res.status(400).json({ error: 'user is not logged in'});
        }
        const product = await productModel.findById(productId);

        if(!product) return res.status(404).json({ error: 'Product not found' });
        if(product.quantity <= 0) return res.status(400).json({ error: 'out of stock'});
        if(!user || !user._id) return res.status(401).json({ error: 'User not authenticated' });

        const result = await userModel.findByIdAndUpdate(user._id , { $push: { cart: { product: productId } }});
        res.status(200).json({ message: 'product successfully added to cart'})
    }catch(err){
        console.error(err);
    }
} 




exports.cartCountPatch = async (req, res) => {
    const productId = req.params.productId;
    const nums = req.params.nums;
    const userId = req.params.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found', redirect: '/login' });
        }

        // Find the index of the product in the cart array
        const productIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if(nums > 10 || nums <= 0 ) return res.status(404).json({ error: 'maximum cart items 10' });
        if (productIndex == -1) return res.status(404).json({ error: 'Product not found in the cart' });
        const product = await productModel.findById(productId);
        if(nums >= product.quantity) return res.status(400).json({  error: 'no more products available', productQuantity: product.quantity});

        user.cart[productIndex].count = parseInt(nums);

        // Save the updated user document
        await user.save();

        return res.status(200).json({ success: true, message: 'Cart updated successfully'}); // user 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




function validateAddress(name, email, phone, pincode, state, country, altphone, city, landmark) {
    if(!name || !email || !phone || !pincode || !state || !country || !altphone || !city || !landmark ) return { success: false, message: 'Fields with * mark are required'};
    if(email){
         const emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
        let isValidEmail = emailRegex.test(email)
        if(!isValidEmail) return { success: false, message: 'Email is not in the correct format'};
    } 
    const numericRegex = /^[0-9]+$/;

    if (!numericRegex.test(phone) || phone.length !== 10) {
      return { success: false, message: 'Phone number should be 10 digits' };
    }
    
    if (!numericRegex.test(altphone) || altphone.length !== 10) {
      return { success: false, message: 'Alternate phone number should be 10 digits' };
    }
    
    if (!numericRegex.test(pincode) || pincode.length !== 6) {
      return { success: false, message: 'Pincode should be 6 digits' };
    }
    return { success: true };
}




exports.addAddressPatch = async ( req, res ) => {
    try{
        const userId = req.params.userId;
        const { name, email, phone, pincode, state, country, altphone, city, landmark} = req.body;
        const validationResult = validateAddress(name, email, phone, pincode, state, country, altphone, city, landmark); // Pass landmark as an argument
        if(!validationResult.success) {
            return res.status(400).json({ success: false, error: validationResult.message, hai: 'hai' });
        }
        const result = await userModel.findByIdAndUpdate( userId, { $push:{ address: { name, email, phone, alt_phone: altphone, city, landmark, state, country, pincode } }}, { new: true });
        if (result) {
            return res.status(200).json({ success: true, message: 'User address added successfully', user: result });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    }catch(err){
        console.error(`Error at addAddressPath : ${err}`);
    }
};






exports.cartProductDelete = async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.user._id;
        const user = await userModel.findById(userId);

        const productIndex = user.cart.findIndex(item => item.product == productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        user.cart.splice(productIndex, 1);
        await user.save();
        res.status(200).json({ success: true, message: 'Product successfully removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




exports.deleteAddress = async ( req, res ) => {
    const addressId = req.params.addressId;
    const user = await userModel.findById(req.session.user._id);
    if(!user){
        res.status(400).json({ error: 'user not found again, login again'});
    }else{
        // const address = user.address.find( address => address._id == addressId );
        const addressIndex = user.address.findIndex( address => address._id == addressId );
        user.address.splice(addressIndex, 1);
        await user.save();
        res.status(200).json({ success: true, message: 'address successfully removed.' });
    }
}



exports.addressEditGet =  async ( req, res ) => {
    try{
        const addressId = req.params.addressId;
        const user = await userModel.findById(req.session.user._id);
        if(!user) return res.status(400).json({ error: 'user session expired, login again'});
        const selectedAddress = user.address.find( address => address._id.toString() === addressId );
        return res.status(200).json(selectedAddress);
    }catch(err){
        console.log(err);
    }
}




exports.addressUpdatePatch = async (req, res) => {
    const addressId = req.params.addressId;
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(400).json({ error: 'User session expired, login again' });

        // Find the index of the address in the user's addresses array
        const addressIndex = user.address.findIndex(address => address._id == addressId);
        if (addressIndex === -1) return res.status(400).json({ error: 'User address not found' });

        // Update the fields of the found address
        const { name, email, phone, pincode, state, country, altphone, city, landmark } = req.body;
        const validationResult = validateAddress(name, email, phone, pincode, state, country, altphone, city, landmark); // Pass landmark as an argument
        if(!validationResult.success) {
            return res.status(400).json({ success: false, error: validationResult.message, hai: 'hai' });
        }

        // Update the specific address within the array
        user.address[addressIndex].name = name;
        user.address[addressIndex].email = email;
        user.address[addressIndex].phone = phone;
        user.address[addressIndex].pincode = pincode;
        user.address[addressIndex].state = state;
        user.address[addressIndex].country = country;
        user.address[addressIndex].alt_phone = altphone;
        user.address[addressIndex].city = city;
        user.address[addressIndex].landmark = landmark;

        // Save the updated user document
        await user.save();

        return res.status(200).json({ success: true, message: 'User address updated successfully', user: user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}




exports.checkoutPost = async (req, res) => {
    try {
      const user = await userModel.findById(req.session.user._id);
      if(!user) return res.status(400).json({ error: 'User not found, Login again'});
    //   if(typeof Number(req.body.pincode) !== 'number' ) return res.status(400).json({ error: 'pincode must be number'});

      const address = { name, email, phone, pincode, state, country, altphone, city, landmark } = req.body;

      const validationResult = validateAddress( name, email, phone, pincode, state, country, altphone, city, landmark);
      if(!validationResult.success) {
        return res.status(400).json({ success: false, error: validationResult.message, hai: 'hai' });
      }
  
      const productDetails = await getProductDetails(user.cart);
  
      let totalPrice = 0;
      productDetails.forEach((item, index) => {
        const itemPrice = item.product ? (item.product.discountPrice || 1) : 0;
        totalPrice += itemPrice * item.count;
      });
      let originalPrice = totalPrice;
      if(req.body.discountPrice) totalPrice -= req.body.discountPrice;

      if(totalPrice > 1000 && req.body.paymentMethod === 'COD' ) return res.status(400).json({ success: false, error: 'Cash On Delivery is not available for products more than 1000Rs'});
      if(totalPrice < 500 ) totalPrice += parseInt(process.env.DELIVERY_CHARGE);
  
      const products = [];
      for (const item of productDetails) {
        const dbProduct = await productModel.findById(item.product._id);
        if (dbProduct.quantity < item.count) {
            continue;
        }
        dbProduct.quantity -= item.count;
        await dbProduct.save();
        products.push({
          productId: item.product._id,
          quantity: item.count,
          productTotalPrice: item.product.discountPrice * item.count,
        });
      }
  
      if (!user) return res.status(400).json({ error: 'login again, session expired' });
      if(req.body.paymentMethod === "wallet"){
        if( user.wallet.amount < totalPrice ) return res.status(400).json({ error: `balance in wallet : ${user.wallet.amount}` });
        user.wallet.amount -= totalPrice;
      }
  
      const order = await new orderModel({
        userId: req.session.user._id,
        products,
        address,
        orderNotes: req.body.ordernotes,
        originalPrice,
        totalPrice,
        paymentMethod: req.body.paymentMethod || 'COD',
        couponUsed: req.body.couponCode || '',
        status: "Processing",
        orderValid: true,
        rzr_orderId: req.body.orderId
      });
  
      const savedOrder = await order.save();
      if (savedOrder) {
        user.cart = [];
        await user.save();
        if (req.body.couponCode) await couponModel.updateOne({ couponCode: req.body.couponCode }, { $push: { usedUsers: user._id } });
        return res.json({ success: true, message: 'Order created successfully' });
      }
    } catch (err) {
      console.error(err);
    }
  };



exports.failedPayment = async ( req, res ) => {
    const orderId = req.query.orderId;
    try{
        const order = await orderModel.findById(orderId);
        res.status(200).json({ order});
    }catch(err){
        console.log(err);
    }
}


exports.paymentPendingPost = async ( req, res ) => {
    const { userId, rzr_orderId } = req.body;
    try{
        const order = await orderModel.findOne({ rzr_orderId: rzr_orderId });
        if(!order) return res.status(404).json({ error: "Order not found" });
        order.pending = false;
        order.paymentMethod = "razorpay";
        const result = await order.save();
        if(!result) return res.status(404).json({ error: "Order failed" });
        res.status(200).json({ success: true, message: 'Order Payment was successful.' });
    }catch(err){
        console.error(`Error at paymentPendingPost ${err}`)
    }
}




exports.validateCheckoutAddress = async ( req, res ) => {
    const address = { name, email, phone, pincode, state, country, altphone, city, landmark } = req.query;
  
    const validationResult = validateAddress( name, email, phone, pincode, state, country, altphone, city, landmark);
    if(!validationResult.success) {
      return res.status(400).json({ success: false, error: validationResult.message });
    }
    res.status(200).json({ success: true, message:'checkout Address validated.' });
}



exports.checkoutErrorPost = async ( req, res ) => {
    try {
        const user = await userModel.findById(req.session.user._id);
        if(!user) return res.status(400).json({ error: 'User not found, Login again'});
        // if(typeof Number(req.body.pincode) !== 'number' ) return res.status(400).json({ error: 'pincode must be number'});
  
        const address = { name, email, phone, pincode, state, country, altphone, city, landmark } = req.body;
  
        const validationResult = validateAddress( name, email, phone, pincode, state, country, altphone, city, landmark);
        if(!validationResult.success) {
          return res.status(400).json({ success: false, error: validationResult.message });
        }
    
        const productDetails = await getProductDetails(user.cart);
    
        let totalPrice = 0;
        productDetails.forEach((item, index) => {
          const itemPrice = item.product ? (item.product.discountPrice || 1) : 0;
          totalPrice += itemPrice * item.count;
        });
        let originalPrice = totalPrice;
        if(req.body.discountPrice) totalPrice -= req.body.discountPrice;
      
        const products = [];
        for (const item of productDetails) {
          const dbProduct = await productModel.findById(item.product._id);
          if (dbProduct.quantity < item.count) {
              continue;
          }
          dbProduct.quantity -= item.count;
          await dbProduct.save();
          products.push({
            productId: item.product._id,
            quantity: item.count,
            productTotalPrice: item.product.discountPrice * item.count,
          });
        }
    
        if (!user) return res.status(400).json({ error: 'login again, session expired' });
        if(req.body.paymentMethod === "wallet"){
          if( user.wallet.amount < totalPrice ) return res.status(400).json({ error: `balance in wallet : ${user.wallet.amount}` });
          user.wallet.amount -= totalPrice;
        }
    
        const order = await new orderModel({
          userId: req.session.user._id,
          products,
          address,
          orderNotes: req.body.ordernotes,
          originalPrice,
          totalPrice,
          paymentMethod: "Pending",
          couponUsed: req.body.couponCode || '',
          pending: true,
          status: "Pending",
          orderValid: true,
          rzr_orderId: req.body.orderId
        });
    
        const savedOrder = await order.save();
        if (savedOrder) {
          user.cart = [];
          await user.save();
          if (req.body.couponCode) await couponModel.updateOne({ couponCode: req.body.couponCode }, { $push: { usedUsers: user._id } });
          return res.json({ success: true, message: 'Order created successfully' });
        }
      } catch (err) {
        console.error(err);
      }
}




exports.productCartPatch = async ( req, res ) => {
    try{
        const productId = req.params.productId;
        const quantity = req.params.quantity;
        if (!req.session.user) {
            return res.status(404).json({ error: 'User not found please login', redirect: '/login' });
        }
        const userId = req.session.user._id;

        const user = await userModel.findById(userId);
        const productIndex = user.cart.findIndex(item => item._id.toString() === productId);

        const isProduct = user.cart.find( doc => { return doc.product == productId  });

        if(isProduct){
            return res.status(400).json({ error: 'Product is already existed in the cart' });
        }

        if(quantity > 10 || quantity <= 0 ){
            return res.status(404).json({ error: 'maximum cart items 10' });
        }
        if (productIndex === -1) {
            user.cart.push({ product: productId, count: quantity });
        } else {
            user.cart[productIndex].count = parseInt(quantity);
        }

        await user.save();

        return res.status(200).json({ message: 'Cart updated successfully', user, success: true });
    }catch(err){
        console.error(err);
    }
}



exports.orderSingleGet  = async ( req, res )  => {
    try{
        const orderId = req.params.orderId;
        const order = await orderModel.findById(orderId).populate('products.productId');
        let orderStatus = "...";
        if(order.pending) order.orderMessage = 'Pending';
        else if(order.orderValid && !order.orderStatus && !order.returned ) order.orderMessage = 'Arriving';
        else if(!order.orderValid && order.orderStatus && !order.returned ) order.orderMessage = 'Delivered';
        else if(!order.orderValid && !order.orderStatus && !order.returned ) order.orderMessage = 'Cancelled';
        else if(!order.orderValid && !order.orderStatus && order.returned ) order.orderMessage = 'Returned';
        else orderStatus = '.....';
        res.render('order-details.ejs', { order, userIn: req.session.user });
        // if(!orderId) return res.status(400).json({ error: 'orderId not found', redirectUrl: false});
        // if(!dbOrder) return res.status(400).json({ error: 'order not found', redirectUrl: false});
        // return res.status(200).json({ message: 'order showing', redirectUrl: `/order/${orderId}`});
    }catch(err) {
        console.log(err);
    }
}



exports.orderCancellationPath = async ( req, res ) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    let user;
    try{
        const dbOrder = await orderModel.findById(orderId).populate('products.productId');
        if(dbOrder.paymentMethod !== 'COD'){
            user = await userModel.findById(dbOrder.userId);
            if(!user) return res.status(404).json({ error: 'user not found, login again'});
            user.wallet.amount += parseInt(dbOrder.totalPrice);
            await user.save();
        }
        const index = dbOrder.products.findIndex( product => product.productId._id.toString() === productId );
        dbOrder.products[index].orderStatus = false;
        dbOrder.products[index].orderValid = false;
        dbOrder.products[index].returned = false;
        await dbOrder.save();
        return res.status(200).json({ success: true, message: 'order cancelled'});
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.orderReturnPatch = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
  
    try {
      const dbOrder = await orderModel.findById(orderId).populate('products.productId');
      if (!dbOrder) return res.status(404).json({ error: 'Order not found' });
  
      const product = dbOrder.products.find((p) => p.productId._id.toString() === productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
    
      product.returned = true;
      product.orderStatus = false;
      product.orderValid = false;
  
      await dbOrder.save();
  
      return res.status(200).json({ message: 'Product returned successfully' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };




exports.addWalletAmount = async ( req, res ) => {
    const userId = req.params.userId;
    const amount = req.params.amount;
    try{
        if(!userId) return res.status(403).json({ error: 'user not found, login again' });
        if(!amount) return res.status(403).json({ error: 'Please enter an amount' });
        const user = await userModel.findById(userId);
        user.wallet.amount += parseInt(amount);
        await user.save();
        return res.status(200).json({ success: true, message: `${amount}Rs added to wallet` });
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



exports.couponCheck = async ( req, res ) => {
    const couponCode = req.params.couponCode;
    const productTotal = req.params.productTotal;
    try{
        if(!couponCode) return res.status(300).json({ status: false, error: 'No coupon'});
        const coupon = await couponModel.findOne({ couponCode });
        if(!coupon) return res.status(300).json({ status: false, error: 'No coupon found' });
        if( productTotal >= coupon.purchaseAmount ) {
            let discountPrice = productTotal - coupon.discountAmount;
            const couponresult = await couponModel.updateOne({ couponCode: req.params.couponCode }, { $push: { usedUsers: req.session.user._id }});
        
            return res.status(200).json({ status: true, discountPrice, couponOffer: coupon.discountAmount, couponCode : coupon.couponCode });
        } else return res.status(403).json({ error: `You need to order above ${coupon.purchaseAmount}, to use this coupon` });

    }catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




exports.removeCoupon = async ( req, res ) => {
    const couponCode = req.params.couponCode;
    try{
        if(!req.session.user) return res.status(400).json({ error: "user not found, login again" });
        const coupon = await couponModel.updateOne({ couponCode: couponCode }, { $pull: { usedUsers: req.session.user._id }});
        if(!coupon) return res.status(400).json({ error: "coupon not found"});
        res.status(200).json({ message: "Coupon removed successfully" });
    }catch(err){
        console.log(`Error at removeCoupon \n${err}`);
    }
}



exports.genInvoice = async ( req, res ) => {
    const orderId = req.params.orderId;

    const doc = new PDFDocument({ font: 'Helvetica', margin: 50});
    doc.pipe(res);

    const order = await orderModel.findById(orderId).populate('products.productId');
    
    genInvoicePdf(doc, orderId, order );

    doc.end();
}


function genInvoicePdf(doc, orderId, order ) {

    doc.fontSize(18).font('Helvetica-Bold').text('Invoice', { align: 'center' })
        .moveDown();

    doc.font('Helvetica-Bold').fontSize(10).text(`Date : ${new Date(Date.now()).toLocaleDateString()}`, { align: 'right'});

    doc.font('Helvetica-Bold').fontSize(14).text('MARGIN');
    doc.moveDown(0.3)
        .font('Helvetica')
        .fontSize(8).text(`Abcd street`)
        .fontSize(8).text(`Calicut, Kerala, 673020`)
        .fontSize(8).text(`1800-208-9898`)
        .fontSize(8).font('Helvetica-Bold').text(`orderId : ${orderId}`, { align: 'right'});

    generateHr(doc, doc.y + 10);
    let y = doc.y + 20;
    doc.font('Helvetica-Bold').text('No', 60, y)
        .text('product', 100, y)
        .text('Quantity', 250, y)
        .text('Price', 400, y)
        .text('Total', 500, y);

    generateHr(doc, doc.y + 10);

    y += 40;

    order.products.forEach(( item, index ) => {
        
        doc.font('Helvetica').text(`${index + 1}`, 60, y)
        .text(`${item.productId.name}`, 100, y)
        .text(`${item.quantity}`, 250, y)
        .text(`${item.productId.discountPrice}`, 400, y)
        .text(`${item.productTotalPrice}`, 500, y);

        y += 20;
    });

    generateHr(doc, doc.y + 10);
    y+= 20;

    doc.font('Helvetica').text(`subTotal : ${ order.totalPrice }`, 450, y );
    doc.font('Helvetica').text(`Delivery : ${ 0 }`, 450, y + 20 );
    doc.moveDown();

    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(450, doc.y).lineTo(550, doc.y).stroke();
    
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`subTotal : ${ order.totalPrice }`);


    return;
};


function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }




exports.errorPageGet = ( req, res ) => {
    res.render('404.ejs', { userIn: req.session.userIn });
}