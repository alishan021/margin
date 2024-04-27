const mongoose = require('mongoose');
const productModel = require('../models/products');

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        quantity:{
            type:Number
        },
        productTotalPrice:{
            type:Number,
        },
        orderStatus:{
            type: Boolean,
            default: false,
         },
         returned:{
             type: Boolean,
             default:false
         },
         orderValid:{
             type:Boolean,
             default: true
         }
    }],
    address: {
        name: {
            type: String
        },
        email: {
            type: String,
        },
        phone: {
            type: String, 
        },
        pincode: {
            type: Number,
        },
        state: {
            type: String, 
        },
        country: {
            type: String,
        },
        altphone: {
            type: String,
        },
        city: {
            type: String, 
        },
        landmark: {
            type: String, 
    }},
    paymentMethod: {
        type: String
    },
    orderNotes: {
        type: String
    },
    originalPrice: {
        type: Number,
        default: 0,
    },
    totalPrice:{
        type:Number
    },
    orderDate:{
        type:Date,
        default:Date.now
    },
    coupnUsed: {
        type: String,
        default: '',
    }
});

const orderModel = new mongoose.model( 'Order', orderSchema );
module.exports = orderModel;