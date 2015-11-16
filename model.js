const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  current_price: {
    value: Number,
    currency_code: String
  }
});

mongoose.model('Product', ProductSchema);