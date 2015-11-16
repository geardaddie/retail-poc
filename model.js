const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: Number,
  name: String,
  currentPrice: {
    amount: Number,
    currency: String
  }
});

mongoose.model('Product', ProductSchema);