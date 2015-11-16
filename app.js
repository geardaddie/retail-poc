const restify = require('restify');
const controller = require('./controller');

const server = restify.createServer();

server.get('/products/:name', controller.getProduct);
server.put('/products/:name', controller.updateProduct);

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});