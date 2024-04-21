const couponModel = require('../models/coupons');


exports.couponGet = async ( req, res ) => {
    try{
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        res.render('admin-coupon.ejs', { coupons });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



exports.addCouponGet = async ( req, res ) => {
    res.render('adm-add-coupon.ejs');
}



exports.addCouponPost = async ( req, res ) => {
    const { couponCode , startDate, endDate, purchaseAmount ,discountAmount } = req.body;
    console.log(req.body);
    try{
        const isCouponCheck = await couponModel.findOne( { couponCode: couponCode });
        if(isCouponCheck) return res.status(400).json({ error: 'coupon code is already existed'})
        if (!couponCode || !startDate || !endDate)  return res.status(400).json({ error: 'Coupon code, start date, and end date are required' });

        const newCoupon = new couponModel({
            couponCode: couponCode,
            startDate: startDate,
            endDate: endDate,
            purchaseAmount: purchaseAmount,
            discountAmount: discountAmount
        });
        const savedCoupon = await newCoupon.save();

        if(!savedCoupon) return res.status(400).json({ error: 'something went wrong' });
        console.log('savedcoupn : ' + savedCoupon );
        res.status(200).json({ success: true, message: 'Coupn create successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.couponDelete = async ( req, res ) => {
    const couponId = req.params.couponId;
    try{
        console.log(couponId);
        const result = await couponModel.findByIdAndDelete(couponId);
        if(result) return res.status(200).json({ success: true, message: 'coupon successfully deleted'});
        else return res.status(400).json({ error: 'coupon not found' });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}