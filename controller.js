const restify = require('restify');
const Promise = require('bluebird');

const mongoose = Promise.promisifyAll(require('mongoose'));
const productService = require('./product_service');

const Product = mongoose.model('Product');

exports.getProduct = (request, response, next) => {
  const id = request.params.id;

  // TODO: Work out name vs id (should be sending in ID instead of name)
  function retrieveProductFromDb(name) {
    return Product.findOneAsync({
        id: id
      }, '-_id')
      .then((product) => {
        if (product) {
          product.name = name;
          return product;
        }

        throw new restify.errors.NotFoundError(`No product found with id '${id}'.`);
      });
  }

  productService.retrieveProductNameFor(id)
    .then(retrieveProductFromDb)
    .then((product) => {
      response.send(product);
      next();
    }).catch((err) => {
      next(err);
    });
};

// TODO: Have this merge product names in as well (promises!!)
exports.listProducts = (request, response, next) => {
  Product.find({}, (error, products) => {
    response.send(products);
    next();
  });
};

function updateProduct(product, value, currencyCode) {
  if (typeof value !== 'number' || value < 0) {
    throw new restify.errors.BadRequestError(`'${value}' is not a valid value for price`);
  }

  const isValidCurrencyCode = (currencyCode === 'USD' || currencyCode === 'EUR');
  if (!isValidCurrencyCode) {
    throw new restify.errors.BadRequestError(`'${currencyCode}' is not a valid value (only "USD" & "EUR" supported)`);
  }

  product.current_price = {
    value: value,
    currency_code: currencyCode
  };

  return product.save();
}

exports.updateProductPrice = (req, response, next) => {
  const id = req.params.id;
  const value = req.body.value;
  const currencyCode = req.body.currency_code;

  Product.findOneAsync({
    id: id
  }).then((product) => {
    if (product) {
      return updateProduct(product, value, currencyCode);
    }
    throw new restify.errors.NotFoundError("No product found with id '" + id + "'.");
  }).then(() => {
    response.send(200);
    next();
  }).catch((err) => {
    next(err);
  });
};