const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  currentPrice: {
    amount: Number,
    currency: String
  }
});

mongoose.model('Product', ProductSchema);