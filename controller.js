const restify = require('restify');
const assert = require('assert');
const Promise = require('bluebird');
const mongoose = require('mongoose');
// const mongoose = Promise.promisifyAll(require('mongoose'));

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
    if (res.statusCode === 200 && productDescriptions && productDescriptions[0]) {
      Product.findOne({
        id: id
      }, '-_id', (error, product) => {
        assert.ifError(error); // connection error
        product.name = productDescriptions[0].title;
        response.send(product);
        next();
      });
    } else {
      if (res.statusCode === 404) {
        next(new restify.errors.NotFoundError("No product found with id '" + id + "'."));
      } else {
        next(new restify.errors.InternalSystemError('Error Occurred Communciating with External Service'));
      }
    }
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
  const id = req.params.id;
  Product.findOne({ id: id }).then((product) => {
    if (!product) {
      throw new restify.errors.NotFoundError("No product found with id '" + id + "'.");
    }

    const value = req.body.value;
    const currencyCode = req.body.currency_code;

    if (typeof value !== 'number' || value < 0)  {
      throw new restify.errors.BadRequestError(value + ' is not a valid value for price');
    }

    const isValidCurrencyCode = (currencyCode === 'USD' || currencyCode === 'EUR');
    if (!isValidCurrencyCode) {
      throw new restify.errors.BadRequestError(currencyCode + ' is not a valid value (only "USD" & "EUR" supported)');
    }

    product.current_price = {
      value: value,
      currency_code: currencyCode
    };
    return product.save();
  }).then(() => {
    response.send(200);
    return next();
  }).end((err) => {
    return next(err);
  });
};