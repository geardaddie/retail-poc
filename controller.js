const restify = require('restify');
const assert = require('assert');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Product = mongoose.model('Product');

Promise.promisifyAll(restify.JsonClient.prototype);

exports.getProduct = (request, response, next) => {
  const client = restify.createJsonClient({
    url: 'https://www.tgtappdata.com'
  });
  const id = request.params.id;
  const api = '/v1/products/pdp/TCIN/' + id + '/1375?redsky-api-key=DEV24df89be43a6cca455DEV';

  // let productDescription;
  // client.getAsync(api).then((req) => {
  //   console.log(req);
  //   productDescription = prodDesc[0];
  //   return Product.findOne({id: id}, '-_id');
  // })
  // .then((product) => {
  //   product.name = productDescription.title;
  //   response.send(product);
  //   next();
  // })
  // .catch((err) => {
  //   response.send('I got an error: ' + err);
  //   console.log('I got an error: ' + err);
  //   next();
  //   throw err;
  // });

  client.get(api, (err, req, res, productDescriptions) => {
    assert.ifError(err); // connection error
    Product.findOne({id: id}, '-_id', (error, product) => {
      assert.ifError(error); // connection error
      product.name = productDescriptions[0].title;
      response.send(product);
      next();
    });
  });
};

// TODO: Have this merge product names in as well (promises!!)
exports.listProducts = (request, response, next) => {
  Product.find({}, (error, products) => {
    response.send(products);
    next();
  });
};

exports.updateProductPrice = (req, response, next) => {
  // todo save product
  Product.findOne({id: req.params.id}).then((product) => {
    if (!product) throw new Error("not found!");
    product.current_price = req.body;
    return product.save();
  }).then(() => {
    console.log("Returning");
    response.send(200);
    return next();
  });
};