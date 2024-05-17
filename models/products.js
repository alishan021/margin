
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}); 





const Offers = require('./offerModel');

productSchema.virtual('discountedPrice').get(function() {
    console.log('Inside the product schema virtual offer module');
    return this.price - 100;
});


// productSchema.pre('find', async function () {
//     try {
//         console.log('Inside the product schema virtual offer module 2');
//         // Find active offers for all categories
//         console.log(this);
//         const productItems = this;
//         const currentDate = new Date();
//         const activeOffers = await Offers.find({
//             startDate: { $lte: currentDate },
//             endDate: { $gte: currentDate }
//         });

//         // Apply offer logic to each product
//         productItems.forEach(product => {
//             // Find any active offer for the product's category
//             const activeOffer = activeOffers.find(offer => product.category.equals(offer.category));

//             // Apply offer if found
//             if (activeOffer) {
//                 if (activeOffer.offerType === 'percentage') {
//                     product.price -= (product.price * activeOffer.offerValue) / 100;
//                 } else if (activeOffer.offerType === 'price') {
//                     product.price -= activeOffer.offerValue;
//                 }
//             }
//         });
//     } catch (err) {
//         console.error('Error applying offer to products:', err);
//     }
// });



const productModel = new mongoose.model('Product', productSchema );
module.exports = productModel;
