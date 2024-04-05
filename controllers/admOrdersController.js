const orderModel = require('../models/order');




exports.orderGet = async ( req, res ) => {
    try{
      const orders = await orderModel.find({}).populate('products.productId');
      res.render('admin-order.ejs', { orders })
    }catch(err){
      console.log(err);
    }
  }


exports.orderStatusPatch = async ( req, res ) => {
  try{
    const orderId = req.body.orderId;
    const orderStatus = req.body.newOrderStatusText;
    if(!orderId || !orderStatus) return res.status(400).json({ error: 'orderId or OrderStatus is not available, login again'});
    const order = await orderModel.findById( orderId );
    order.orderStatus = orderStatus;
    await order.save();
    res.json({ message: 'order status updated successfully'});
  }catch(err){
    console.log(err);
  }
}