const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String
  },
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Processing' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);