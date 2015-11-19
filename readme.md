#myRetail

A [Node](https://nodejs.org/en/)-based Proof-of-Concept REST service that responds to requests for products pricing information for a given Product ID.


## Technical Details
myRetail is written in ES2015 (aka ES6) JavaScript and utilizes the [Restify](http://restify.com) framework to provide the basic infrastructure for REST request handling. It also uses [Mongoose](http://mongoosejs.com) to manage models and communicate with [MongoDB](https://www.mongodb.org/) instance to hold product price information.

As per the requirements, the service also retreives general product information (in this case just the "name" of the product) from an external 3rd-party service.

As an extra feature, the service allows updating the price of _existing products_.  It does not support creating new products at this time.

Being a PoC, the service upon startup will determine if there is data in the MongoDB and if not, it will create a set of known products with prices.

Integration tests are provided and based on the Mocha testing framework.

### Provided HTTP API

*Request*
```
GET /products/{productId}
```

Retrieves a product from the system with name and price

*Sample Response*
```json
{
  "name": "iPhone 6 Plus - AT&T",
  "id": "16483589",
  "__v": 0,
  "current_price": {
    "value": 88.22,
    "currency_code": "USD"
  }
}
```

*Request*
```
PUT /products/{productId}/price
// request body
{
  "value": 3.0,
  "currency_code": "USD"
}

```
*Request*
```
GET /products
```

Returns a list of all known products (product name not provided currently)

*Sample Response*
```json
[
  {
    "__v": 0,
    "_id": "56495645ef7073b32a3b765b",
    "id": "15117729",
    "current_price": {
      "value": 10.4,
      "currency_code": "EUR"
    }
  },
  {
    "id": "16483589",
    "_id": "56495645ef7073b32a3b765c",
    "__v": 0,
    "current_price": {
      "value": 88.22,
      "currency_code": "USD"
    }
  },
  {
    "id": "16696652",
    "_id": "56495645ef7073b32a3b765d",
    "__v": 0,
    "current_price": {
      "value": 93.26,
      "currency_code": "USD"
    }
  },
  {
    "id": "16752456",
    "_id": "56495645ef7073b32a3b765e",
    "__v": 0,
    "current_price": {
      "value": 78.04,
      "currency_code": "USD"
    }
  },
  {
    "id": "15643793",
    "_id": "56495645ef7073b32a3b765f",
    "__v": 0,
    "current_price": {
      "value": 68.71,
      "currency_code": "USD"
    }
  },
  {
    "id": "13860428",
    "_id": "56495645ef7073b32a3b7660",
    "__v": 0,
    "current_price": {
      "value": 68.67,
      "currency_code": "USD"
    }
  }
]
```

_Note:  All APIs are versioned and support ```accept-version: 1.0.0``` header value or ```v1``` in the path (eg: ```GET /products/v1/{productId}```),  but only version 1 is supported._


### Setup

_These instructions are for OS X, steps for installing on UNIX should be similar.  Windows installations steps not provided._

myRetail requires NodeJS version 4.1.X or higher and MongoDB 3.x to be installed.

To install NodeJS I recommend using [NVM - the Node Version Manager](https://github.com/creationix/nvm).

To install MongoDB I recommend using [HomeBrew](http://brew.sh). Please follow the instructions at [MongoDB.org](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

To run the application, from the Project Root directory:

1. Install the dependencies
```npm install```

2. Create location for Mongo to store data files
```mkdir db```

3. Start MongoDB
```mongod --dbpath ./db```

4. Start the Service
```node app.js```

To run the tests, you'll need to install Mocha

```npm install mocha -g```

then run tests from project root by entering
```mocha```

If you wish to generate test coverage reports

```npm install istanbul -g```

then run tests with the following command

```istanbul cover _mocha -R```

_(the reports will be in {project_root}/coverage/lcov-report/index.html)_