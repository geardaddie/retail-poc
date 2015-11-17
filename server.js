require('./model');
const restify = require('restify');
const controller = require('./controller');
const mongoose = require('mongoose');

function createTestData() {
  // insert test data
  const Product = mongoose.model('Product');
  Product.find({}, (err, products) => {
    if (!products || products.length === 0) {
      const sampleIds = ['15117729', '16483589', '16696652', '16752456', '15643793', '13860428'];
      sampleIds.forEach((sampleId) => {
        const price = Math.floor((Math.random() * 10001)) / 100;

        const product = new Product({ id: sampleId,
                                    current_price: { value: price, currency_code: 'USD'}
                                  });
        product.save((error, savedProduct) => {
          if (error) {
            console.log("Didn't save!");
          } else {
            console.log('Saved product: ' + savedProduct.id);
          }
        });
      });
    }
  });
}

function connectToDB() {
  mongoose.connect('mongodb://localhost/myRetail', {server: {auto_reconnect: true}});

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to Mongo!');
    createTestData();
  });
}

exports.startServer = () => {
  const server = restify.createServer();

  server.get('/products/:id', controller.getProduct);
  server.put('/products/:id', controller.updateProduct);
  server.get('/products', controller.listProducts);

  server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
  });

  connectToDB();
  createTestData();
};
