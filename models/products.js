
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    quantity: {
        type: Number, 
        required: true
    },
    brand: {
        type: String,
        default: '',
    },
    size: {
        type: String, 
    },
    images : {
        type : [String],
    },
    color: [{
        type: String, 
    }],
    description: {
        type: String, 
    },
    details: {
        type: String, 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    modified_at: {
        type: Date, 
        default: Date.now
    },
    deleted_at: {
        type: Date, 
    }
}); 



const productModel = new mongoose.model('Product', productSchema );
module.exports = productModel;