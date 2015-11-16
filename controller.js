restify = require('restify');
assert = require('assert');

require('./model');

const api = '/v1/products/pdp/TCIN/13860428/1375?redsky-api-key=DEV24df89be43a6cca455DEV';

exports.getProduct = (request, response, next) => {
  const client = restify.createJsonClient({
    url: 'https://www.tgtappdata.com'
  });

  client.get(api, (err, req, res, obj) => {
    assert.ifError(err); // connection error
    const pricedProduct = {id: 1, name: obj[0].title, price: {amt: 10, currency: 'USD'}};
    // TODO: Connect to MongoDB and retrieve result

    // TODO: Figure out how to incorporate promises
    // TODO: Consider cashing names in mongoDB w/some sort of "age" config
    // TODO: Consider versioning in the API
    // TODO: Check Content Type and Accept
    response.send(pricedProduct);
    next();
  });
};

exports.updateProduct = (req, res, next) => {
  // todo save product
};