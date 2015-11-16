const restify = require('restify');
const assert = require('assert');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');


exports.getProduct = (request, response, next) => {
  const client = restify.createJsonClient({
    url: 'https://www.tgtappdata.com'
  });
  const id = request.params.id;
  const api = '/v1/products/pdp/TCIN/' + id + '/1375?redsky-api-key=DEV24df89be43a6cca455DEV';

  client.get(api, (err, req, res, productDescriptions) => {
    assert.ifError(err); // connection error
    Product.findOne({id: id}, '-_id', (error, product) => {
      assert.ifError(error); // connection error
      product.name = productDescriptions[0].title;
      response.send(product);
      next();
    });

    // TODO: Figure out how to incorporate promises
    // TODO: Consider cashing names in mongoDB w/some sort of "age" config
    // TODO: Consider versioning in the API
    // TODO: Check Content Type and Accept
    // TODO: Externalize Settings (JSON file + ENV overrides)
  });
};

exports.updateProduct = (req, res, next) => {
  // todo save product
};