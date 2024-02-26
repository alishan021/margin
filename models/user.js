
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    address: [{
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
        alt_phone: {
            type: String,
        },
        city: {
            type: String, 
        },
        landmark: {
            type: String, 
    }}],
    cart: [{
        product_id: {
            type: Date
        },
        added_at: {
            type: String
        }}],
        wishlist: [{
            product_id: {
                type: String
        },
        added_at: {
            type: Date
    }}],
    wallet: {
        card_no: {
            type: String, 
        },
        cvv: {
            type: String,
        },expiry: {
            type: String,
        },
        amount: {
            type: Number, 
        },
        created_at: {
            type: Date
        },
        modified_at: {
            type: Date
        },
        status: {
            type: Boolean
        }},
    created_at: {
        type: Date
    },
    status: {
        type: Boolean,
        default: true
    }
}); 


const userModel = mongoose.model('Users', userSchema );
module.exports = userModel;