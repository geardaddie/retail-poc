const config = require('./config');
const Promise = require('bluebird');
const restify = require('restify');

Promise.promisifyAll(restify.JsonClient.prototype);


exports.retrieveProductNameFor = (productId) => {
  'use strict';
  const client = restify.createJsonClient({
    url: config.product_service.url
  });

  const api = config.product_service.path + productId + '?' + config.product_service.api_key;

  return client.getAsync(api).then((x) => {
    const res = x.res;
    const productDescriptions = res.body;
    if (res.statusCode === 200 && productDescriptions && productDescriptions[0]) {
      return productDescriptions[0].title;
    }

    let error;
    if (res.statusCode === 404) {
      error = new restify.errors.NotFoundError(`No product found with id '${productId}'.`);
    } else {
      error = new restify.errors.InternalSystemError('Error Occurred Communciating with External Service');
    }
    throw error;
  });


  // client.get(api, (err, req, res, productDescriptions) => {
  //   if (res.statusCode === 200 && productDescriptions && productDescriptions[0]) {
  //     successCallback(productDescriptions[0].title);
  //   } else {
  //     if (res.statusCode === 404) {
  //       failureCallback(new restify.errors.NotFoundError(`No product found with id '${productId}'.`));
  //     } else {
  //       failureCallback(new restify.errors.InternalSystemError('Error Occurred Communciating with External Service'));
  //     }
  //   }
  // });
};