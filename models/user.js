
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  address: [{
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
      alt_phone: { type: String },
      city: { type: String },
      landmark: { type: String }
    }],
  cart: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      count: { type: Number, default: 1 },
      added_at: { type: String, default: Date.now }
    }],
  wishlist: [{
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      added_at: { type: Date, default: Date.now }
    }],
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

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;


userSchema.pre('save', async function (next) {
    console.log('console 1\n')
  const user = this;
  console.log(user);
  console.log(userModel);
  const prevUser = await userModel.findById(user._id);
  console.log(prevUser);
  console.log(prevUser.wallet.amount);
    console.log('console 2\n')

  // Check if the wallet amount has been modified
  if (user.isModified('wallet.amount')) {
    console.log('console 3\n')
    const previousAmount = prevUser.wallet.amount || 0;
    const newAmount = user.get('wallet.amount');
    console.log('console 4\n')
    const transactionType = newAmount > previousAmount ? 'credit' : 'debit';
    const amount = Math.abs(newAmount - previousAmount);
    const balance = newAmount;
    console.log('console 5\n')

    console.log( previousAmount, newAmount, transactionType, amount, balance);
    
    const walletHistory = { amount, balance, transactionType };
    
    console.log(walletHistory);
    
    user.wallet.walletHistory.push(walletHistory);
    user.wallet.modifiedAt = new Date();
    console.log('console 5\n')
  }
  next();
});
