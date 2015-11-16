const restify = require('restify');
const controller = require('./controller');
const mongoose = require('mongoose');
require('./model');

const server = restify.createServer();

server.get('/products/:name', controller.getProduct);
server.put('/products/:name', controller.updateProduct);

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});

mongoose.connect('mongodb://localhost/myRetail', {server: {auto_reconnect: true}});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to Mongo!');
});

// insert test data
const Product = mongoose.model('Product');
Product.find({}, (products) => {
  console.log(products);

  if (!products || products.length === 0) {
    const product = new Product({ productId: 100, name: 'FuzzBuzz',
                                  price: { amount: 10, currency: 'USD'}
                                });

    product.save((err, savedProduct) => {
      if (err) {
        console.log('Didnt Save: ' + err);
      } else {
        console.log('Created new product with id: ' + savedProduct._id);
      }
    });
  }
});
