
// var mongoose = require('mongoose');

// var Schema = mongoose.Schema;

// var userSchema = new Schema({
    
//     username: {
//         type: String, 
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String, 
//         required: true
//     },
//     address: [{
//         name: {
//             type: String
//         },
//         email: {
//             type: String,
//         },
//         phone: {
//             type: String, 
//         },
//         pincode: {
//             type: Number,
//         },
//         state: {
//             type: String, 
//         },
//         country: {
//             type: String,
//         },
//         alt_phone: {
//             type: String,
//         },
//         city: {
//             type: String, 
//         },
//         landmark: {
//             type: String, 
//     }}],
//     cart: [{
//         product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product'
//         },
//         count: {
//             type: Number,
//             default: 1
//         },
//         added_at: {
//             type: String,
//             default: Date.now
//     }}],    
//     wishlist: [{
//         product_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product'

//         },
//         added_at: {
//             type: Date,
//             default: Date.now
//     }}],
//     wallet: {
//         amount: {
//             type: Number,
//             default: 0
//         },
//         created_at: {
//             type: Date
//         },
//         modified_at: {
//             type: Date,
//             default: Date.now
//         },
//         status: {
//             type: Boolean,
//             default: true,
//         },
//         walletHistory: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'walletHistory',
//         }},
//     created_at: {
//         type: Date,
//         default: Date.now
//     },
//     status: {
//         type: Boolean,
//         default: true
//     },
//     referalCode: {
//         type: String,
//         unique: true,
//         default: null,
//         set: function(value) {
//             if(!value || value === "" ){
//                 return this.value;
//             }else {
//                 return value;
//             }
//         }
//     }
// }); 


// const userModel = mongoose.model('Users', userSchema );
// module.exports = userModel;




const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletHistorySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  transactionType: { type: String, enum: ['credit', 'debit'], default: 'credit' },
  createdAt: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  walletHistory: [walletHistorySchema] // Use [] syntax
});

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: [
    {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
      alt_phone: { type: String },
      city: { type: String },
      landmark: { type: String }
    }
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      count: { type: Number, default: 1 },
      added_at: { type: String, default: Date.now }
    }
  ],
  wishlist: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      added_at: { type: Date, default: Date.now }
    }
  ],
  wallet: { type: walletSchema },
  created_at: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  referalCode: {
    type: String,
    unique: true,
    default: null,
    set: function (value) {
      if (!value || value === "") {
        return this.value;
      } else {
        return value;
      }
    }
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  const prevUser = await this.constructor.findById(user._id);
  console.log(prevUser);
  console.log(prevUser.wallet.amount);

  // Check if the wallet amount has been modified
  if (user.isModified('wallet.amount')) {
    const previousAmount = prevUser.wallet.amount || 0;
    const newAmount = user.get('wallet.amount');
    const transactionType = newAmount > previousAmount ? 'credit' : 'debit';
    const amount = Math.abs(newAmount - previousAmount);
    const balance = newAmount;

    
    console.log( previousAmount, newAmount, transactionType, amount, balance);
    
    const walletHistory = {
        amount,
        balance,
        transactionType,
    };
    
    console.log(walletHistory);
    
    user.wallet.walletHistory.push(walletHistory);
    user.wallet.modifiedAt = new Date();

  }
  next();
});

// userSchema.pre('updateOne', async function (next) {
//     const docToUpdate = await this.model.findOne(this.getQuery());
//     const update = this.getUpdate();
  
//     // Check if the wallet amount has been modified
//     if (update.$set && update.$set['wallet.amount']) {
//       const previousAmount = docToUpdate.wallet.amount || 0;
//       const newAmount = update.$set['wallet.amount'];
//       const transactionType = newAmount > previousAmount ? 'credit' : 'debit';
//       const amount = Math.abs(newAmount - previousAmount);
//       const balance = newAmount;

//       const walletHistory = {
//         amount,
//         balance,
//         transactionType,
//       };

//       update.$push = { 'wallet.walletHistory': walletHistory };
//       update.$set = { ...update.$set, 'wallet.modifiedAt': new Date() };
//     }

//     next();
//   });

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;