require('mocha');
const restify = require('restify');
const server = require('../server');
const assert = require('assert');

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

  it('should update a priced product', (done) => {
    assert(false);
    done();
  });
});