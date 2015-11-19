require('./model');
const restify = require('restify');
const controller = require('./controller');
const mongoose = require('mongoose');
const config = require('./config');

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
        product.save((error) => {
          if (error) {
            console.log('Unable to save test data');
          }
        });
      });
    }
  });
}

function connectToDB() {
  mongoose.connect(config.database.connection_url, {server: {auto_reconnect: true}});

  const db = mongoose.connection;
  db.on('error', (error) => { throw new Error(error); });
  db.once('open', () => {
    createTestData();
  });
}

function registerRoutes(server) {
  server.get({path: '/products/:id', version: '1.0.0'}, controller.getProduct);
  server.get('/products/v1/:id', controller.getProduct);

  server.put({path: '/products/:id/price', version: '1.0.0'}, controller.updateProductPrice);
  server.put('/products/v1/:id/price', controller.updateProductPrice);

  server.get({path: '/products', version: '1.0.0'}, controller.listProducts);
  server.get('/products/v1', controller.listProducts);
}

exports.startServer = () => {
  const server = restify.createServer();
  server.use(restify.bodyParser());
  server.use(restify.queryParser());

  registerRoutes(server);

  server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
  });

  connectToDB();
  createTestData();
};
