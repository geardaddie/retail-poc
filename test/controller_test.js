require('mocha');
const restify = require('restify');
const server = require('../server');
const assert = require('assert');
const mongoose = require('mongoose');

before(() => {
   server.startServer();
});

// before((done) => {
//   mongoose.connect('mongodb://localhost/myRetail', {server: {auto_reconnect: true}});
//   const db = mongoose.connection;
//   db.on('error', (err) => { throw new Error(err); });
//   db.once('open', () => {
//     // done();
//   });
// });

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
    assert(false);
    done();
  });

  it('should update the price on a product', (done) => {
    const updatedPrice = {value: 10.40, currency_code: 'USD'};
    client.put('/products/15117729/price', updatedPrice, (err, req, res) => {
      assert.ifError(err);
      assert(res.statusCode === 200);
      // TODO check database
      done();
    });
  });

  it('should return 404 on unknown product id', (done) => {
    assert(false);
    done();
  });

  it('should return 400 on bad price data', (done) => {
    assert(false);
    done();
  });
});