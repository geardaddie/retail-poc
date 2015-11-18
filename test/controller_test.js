require('mocha');
const restify = require('restify');
const server = require('../server');
const assert = require('assert');
const mongoose = require('mongoose');

before(() => {
  server.startServer();
});

describe('Priced Product Server', () => {
  const client = restify.createJsonClient({
    version: '*',
    url: 'http://localhost:8080'
  });

  it("should return a list of all known products at '/products'", (done) => {
    client.get('/products', (err, req, res, data) => {
      if (err) {
        throw new Error(err);
      } else {
        if (res.statusCode !== 200) {
          throw new Error('invalid response from /products');
        }
        assert(data.length > 0); // should have at least one record
        assert(data[0].id); // should have ID
        // TODO verify name is present (mock out calls to TGT?)
        done();
      }
    });
  });

  it('should return a priced product', (done) => {
    client.get('/products/15117729', (err, req, res, data) => {
      if (err) {
        throw new Error(err);
      } else {
        if (res.statusCode !== 200) {
          throw new Error('invalid response from /products');
        }
        assert(data.id); // should have ID
        assert(data.name);
        done();
      }
    });
  });

  it('should return 404 on unknown product', (done) => {
    client.get('/products/8675309', (err, req, res) => {
      assert.equal(404, res.statusCode);
      assert(err);
      done();
    });
  });

  it('should update the price on a product', (done) => {
    const updatedPrice = {
      value: 10.40,
      currency_code: 'EUR'
    };

    client.put('/products/15117729/price', updatedPrice, (serviceErr, req, res) => {
      assert.ifError(serviceErr);
      assert(res.statusCode === 200);
      Product = mongoose.model('Product');
      Product.findOne({
        id: 15117729
      }, (dbErr, product) => {
        assert.ifError(dbErr);
        assert.equal(product.current_price.value, 10.40);
        assert.equal(product.current_price.currency_code, 'EUR');
        done();
      });
    });
  });

  it('should return 404 on unknown product id', (done) => {
    client.put('/products/8675309/price', (err, req, res) => {
      assert.equal(404, res.statusCode);
      assert(err);
      done();
    });
  });

  it('should return 400 on bad price', (done) => {
    const updatedPrice = {
      value: 'FOOBAR',
      currency_code: 'EUR'
    };

    client.put('/products/15117729/price', updatedPrice, (serviceErr, req, res) => {
      assert.equal(res.statusCode, 400);
      done();
    });
  });

  it('should return 400 invalid price', (done) => {
    const updatedPrice = {
      value: -10.40,
      currency_code: 'EUR'
    };

    client.put('/products/15117729/price', updatedPrice, (serviceErr, req, res) => {
      assert.equal(res.statusCode, 400);
      done();
    });
  });

  it('should return 400 non EUR/USD currencycode', (done) => {
    const updatedPrice = {
      value: 10.40,
      currency_code: 'GBP'
    };

    client.put('/products/15117729/price', updatedPrice, (serviceErr, req, res) => {
      assert.equal(res.statusCode, 400);
      done();
    });
  });
});