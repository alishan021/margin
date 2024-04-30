const orderModel = require("../models/order");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const userModel = require("../models/user");






exports.genPdf = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="sales-report.pdf"'
    });

    const doc = new PDFDocument();
    doc.pipe(res);

    // Build the PDF content
    buildPDF(doc);

    doc.end();
}

async function buildPDF(doc) {
    let commonReport = await getOrderStats();
    console.log( commonReport );
    // Add content to the PDF document
    doc.fontSize(30)
        .text('Sales Report', { align: 'center' })
        .moveDown(); // Move down to create space below the heading

     doc.fontSize(15)
        .text(`Daily Order Count : ${ commonReport }`)
        .text(`Daily Order revenue : ${ commonReport }`)

    doc.fontSize(25)
       .addPage()
       .fontSize(25)
       .text('Here is some vector graphics...', 100, 100)
       .save()
       .moveTo(100, 150)
       .lineTo(100, 250)
       .lineTo(200, 250)
       .fill('#FF3300')
       .scale(0.6)
       .translate(470, -380)
       .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
       .fill('red', 'even-odd')
       .restore()
       .addPage()
       .fillColor('blue')
       .text('Here is a link!', 100, 100)
       .underline(100, 100, 160, 27, { color: '#0000FF' })
       .link(100, 100, 160, 27, 'http://google.com/');
}






exports.salesReportGet = async (req, res) => {
    try {
        let orders = await orderModel.find({}).populate('userId');
        
        orders = orders.filter(order => order.products.some(product => product.orderStatus));
        const { dailyStats, monthlyStats, yearlyStats  } = await getOrderStats();
        res.render('adm-sales-report.ejs', { orders, dailyStats, monthlyStats, yearlyStats } );
    } catch (err) {
        console.log(err);
    }
};



exports.customSalesReportGet = async ( req, res ) => {
    try{
        // const fromDate = req.params.fromDate;
        // const toDate = req.params.toDate;
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;
        console.log(fromDate, toDate);
        if( new Date(fromDate) >= new Date(toDate)) return res.json({ error: 'start date must be less than end date'});
        let orders = await orderModel.find({
            deliveredAt: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }).populate('userId');
        orders = orders.filter(order => order.products.some(product => product.orderStatus));
        const { dailyStats, monthlyStats, yearlyStats } = await getOrderStats( );
        const noOfUsers = await usersCount(fromDate, toDate);
        console.log(noOfUsers);
        const noOfOrders = await orderCount(fromDate, toDate);
        console.log(noOfOrders);
        const revenueAmount = await getRevenueAmount(fromDate, toDate);
        console.log(revenueAmount);
        const productsSale = await getTopProductsSale(fromDate, toDate);
        console.log(productsSale);
        const topCategoryies = await getTopCategoryies(fromDate, toDate);
        console.log(topCategoryies);
        const paymentOptions = await getNoOfPayments(fromDate, toDate);
        console.log(paymentOptions);
        const orderStatus = await getProductStatus(fromDate, toDate);
        console.log(orderStatus);
        const data = { noOfOrders, noOfUsers, revenueAmount, productsSale, topCategoryies, paymentOptions, orderStatus };
        return res.status(200).json({ message: 'success', orders, dailyStats, monthlyStats, yearlyStats, data });
    }catch(err){
        console.log(err);
    }
}


async function getOrderStats() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  // Daily stats
  const dailyOrders = await orderModel.find({
    orderDate: { $gte: twentyFourHoursAgo }
  });
  const dailyOrderCount = dailyOrders.length;
  const dailyRevenueAmount = dailyOrders.reduce((total, order) => total + order.totalPrice, 0);

  // Monthly stats
  const monthlyOrders = await orderModel.find({
    orderDate: { $gte: thirtyDaysAgo }
  });
  const monthlyOrderCount = monthlyOrders.length;
  const monthlyRevenueAmount = monthlyOrders.reduce((total, order) => total + order.totalPrice, 0);

  // Yearly stats
  const yearlyOrders = await orderModel.find({
    orderDate: { $gte: oneYearAgo }
  });
  const yearlyOrderCount = yearlyOrders.length;
  const yearlyRevenueAmount = yearlyOrders.reduce((total, order) => total + order.totalPrice, 0);

  console.log(`Daily stats: ${dailyOrderCount} orders, $${dailyRevenueAmount} revenue`);
  console.log(`Monthly stats: ${monthlyOrderCount} orders, $${monthlyRevenueAmount} revenue`);
  console.log(`Yearly stats: ${yearlyOrderCount} orders, $${yearlyRevenueAmount} revenue`);

  return {
    dailyStats: { dailyOrderCount, dailyRevenueAmount },
    monthlyStats: { monthlyOrderCount, monthlyRevenueAmount },
    yearlyStats: { yearlyOrderCount, yearlyRevenueAmount }
  };
}



async function categoryStats( fromDate, toDate ) {
    ( fromDate ) ? fromDate : false;
    ( toDate ) ? toDate : false;
}







exports.generateSalesReportPDF = async (req, res) => {
    try {
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;

        // Retrieve sales data from MongoDB
        const orders = await orderModel.find({
            createdAt: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }).populate('userId');

        // Create a new PDF document
        const doc = new PDFDocument();

        // Pipe the PDF to a file (or response stream)
        const pdfFilePath = 'sales_report.pdf';
        const writeStream = fs.createWriteStream(pdfFilePath);
        doc.pipe(writeStream);

        // Add content to the PDF
        doc.fontSize(20).text('Sales Report', { align: 'center' }).moveDown();
        
        // Iterate through orders and add details to the PDF
        orders.forEach((order, index) => {
            doc.fontSize(16).text(`Order ${index + 1}`, { underline: true }).moveDown();
            doc.text(`Order ID: ${order._id}`);
            doc.text(`Customer: ${order.userId.name}`);
            doc.text(`Total Amount: ${order.totalAmount}`);
            doc.moveDown();
        });

        // Finalize the PDF
        doc.end();

        // Respond with the PDF file path or stream it as a response
        res.status(200).json({ message: 'PDF generated successfully', pdfFilePath });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}





exports.salesReportTotalGet = async ( req, res ) => {
    const noOfUsers = await usersCount();
    console.log(noOfUsers);
    const noOfOrders = await orderCount();
    console.log(noOfOrders);
    const revenueAmount = await getRevenueAmount();
    console.log(revenueAmount);
    const productsSale = await getTopProductsSale();
    console.log(productsSale);
    const topCategoryies = await getTopCategoryies();
    console.log(topCategoryies);
    const paymentOptions = await getNoOfPayments();
    console.log(paymentOptions);
    const orderStatus = await getProductStatus();
    console.log(orderStatus);
    const data = { noOfOrders, noOfUsers, revenueAmount, productsSale, topCategoryies, paymentOptions, orderStatus };
    return res.json({ data });
}


async function usersCount(fromDate, toDate) {
    let noOfUsers;
    if(fromDate && toDate){
        noOfUsers = await userModel.find({ created_at: { $gte: new Date(fromDate), $lte: new Date(toDate) }}).countDocuments();
    }else {
        noOfUsers = await userModel.find({}).countDocuments();
    }
    return noOfUsers;
}

async function orderCount(fromDate, toDate) {
    let noOfOrders;
    if(fromDate && toDate){
        noOfOrders = await orderModel.find({ deliveredAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }}).countDocuments();
    }else {
        noOfOrders = await orderModel.find({}).countDocuments();
    }
    return noOfOrders;
}


async function getRevenueAmount(fromDate, toDate) {
    let revenueAmount = 0;

    if (fromDate && toDate) {
        revenueAmount = await orderModel.aggregate([
            {
                $match: {
                    deliveredAt: {
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: "$totalPrice" }
                }
            }
        ]);
    } else {
        revenueAmount = await orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: "$totalPrice" }
                }
            }
        ]);
    }
    return revenueAmount.length > 0 ? revenueAmount[0].totalPrice : 0;
}


async function getTopProductsSale(fromDate, toDate) {
    try {
        let pipeline = [];

        if (fromDate && toDate) {
            pipeline = [
                {
                    $match: {
                        deliveredAt: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    }
                }
            ];
        }

        pipeline.push(
            {
                $unwind: '$products'
            },
            {
                $group: {
                    _id: '$products.productId', // Corrected field reference
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    productName: { $arrayElemAt: ['$productInfo.name', 0] }
                }
            }
        );

        const productsSale = await orderModel.aggregate(pipeline);
        return productsSale;
    } catch (error) {
        console.error('Error getting top products sale:', error);
        throw error;
    }
}


async function getTopCategoryies(fromDate, toDate) {
    try {
        let pipeline = [];

        if (fromDate && toDate) {
            pipeline = [
                {
                    $match: {
                        deliveredAt: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    }
                }
            ];
        }

        pipeline.push(
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            {
                $unwind: '$productInfo'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $group: {
                    _id: '$categoryInfo.categoryName',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    categoryName: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        );

        const categoriesSale = await orderModel.aggregate(pipeline);
        return categoriesSale;
    } catch (error) {
        console.error('Error getting top categories sale:', error);
        throw error;
    }
}


async function getNoOfPayments(fromDate, toDate) {
    try {
        const pipeline = [];

        // Match orders within the specified date range
        if (fromDate && toDate) {
            pipeline.push({
                $match: {
                    deliveredAt: {
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            });
        }

        // Group by payment method
        pipeline.push({
            $group: {
                _id: "$paymentMethod",
                count: { $sum: 1 }
            }
        });

        const noOfPayment = await orderModel.aggregate(pipeline);
        return noOfPayment;
    } catch (err) {
        console.log(`Error on getNoOfPayments ${err}`);
        throw err; // Rethrow the error to be handled by the caller
    }
}


async function getProductStatus(fromDate, toDate) {
    try {
        const pipeline = [];

        // Match orders within the specified date range
        if (fromDate && toDate) {
            pipeline.push({
                $match: {
                    "products.deliveredAt": {
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            });
        }
        
        // Unwind the products array to work with each product separately
        pipeline.push({ $unwind: "$products" });

        // Project fields and define status based on product fields
        pipeline.push({
            $project: {
                _id: "$products._id",
                productId: "$products.productId",
                orderStatus: "$products.orderStatus",
                returned: "$products.returned",
                orderValid: "$products.orderValid",
                status: {
                    $cond: {
                        if: { $eq: ["$products.orderStatus", true] },
                        then: "Delivered",
                        else: {
                            $cond: {
                                if: { $eq: ["$products.orderValid", true] },
                                then: "Arriving",
                                else: {
                                    $cond: {
                                        if: { $eq: ["$products.returned", true] },
                                        then: "Returned",
                                        else: "Cancelled"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Group by status and count the number of products in each status group
        pipeline.push({
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        });

        const productStatus = await orderModel.aggregate(pipeline);
        return productStatus;
    } catch (err) {
        console.log(`Error on getProductStatus: ${err}`);
        throw err;
    }
}
