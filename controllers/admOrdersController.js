const orderModel = require('../models/order');




exports.orderGet = async ( req, res ) => {
    try{
      const orders = await orderModel.find({}).populate('products.productId');
      let orderStatus = '...';
      for( let order of orders){
          orderStatus = "...";
          if(order.orderValid && !order.orderStatus && !order.returned ) order.orderMessage = 'Arriving';
          else if(!order.orderValid && order.orderStatus && !order.returned ) order.orderMessage = 'Delivered';
          else if(!order.orderValid && !order.orderStatus && !order.returned ) order.orderMessage = 'Cancelled';
          else if(!order.orderValid && !order.orderStatus && order.returned ) order.orderMessage = 'Return';
          else orderStatus = '.....';
      }
      // console.log(orders);
      res.render('admin-order.ejs', { orders });
    }catch(err){
      console.log(err);
    }
  }


exports.orderStatusPatch = async ( req, res ) => {
  try{
    const { orderStatus, returned, orderValid, orderId } = req.body;
    console.log(orderStatus, returned, orderValid, orderId);
    if(!orderId ) return res.status(400).json({ error: 'orderId is not available, login again'});
    const order = await orderModel.findById( orderId );
    order.orderStatus = orderStatus;
    order.returned = returned;
    order.orderValid = orderValid;
    const result = await order.save();
    console.log(result);
    res.json({ message: 'order status updated successfully'});
  }catch(err){
    console.log(err);
  }
}