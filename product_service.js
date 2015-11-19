
const config = require('./config');
const restify = require('restify');

exports.retrieveProductNameFor = (productId, successCallback, failureCallback) => {
  const client = restify.createJsonClient({
    url: config.product_service.url
  });

  const api = config.product_service.path + productId + '?' + config.product_service.api_key;

  client.get(api, (err, req, res, productDescriptions) => {
    if (res.statusCode === 200 && productDescriptions && productDescriptions[0]) {
      successCallback(productDescriptions[0].title);
    } else {
      if (res.statusCode === 404) {
        failureCallback(new restify.errors.NotFoundError(`No product found with id '${productId}'.`));
      } else {
        failureCallback(new restify.errors.InternalSystemError('Error Occurred Communciating with External Service'));
      }
    }
  });
};