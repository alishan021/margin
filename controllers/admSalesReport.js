const orderModel = require("../models/order");



exports.salesReportGet = async (req, res) => {
    try {
        let orders = await orderModel.find({}).populate('userId');
        
        orders = orders.filter(order => order.products.some(product => product.orderStatus));

        res.render('adm-sales-report.ejs', { orders });
    } catch (err) {
        console.log(err);
    }
};
