var restify = require('restify');


const server = restify.createServer({
  name: 'fakeprintful',
  version: '1.0.0'
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));


server.post('/echo/:response', function (req, res, next) {
  res.send(req.params);

  console.log("PRINTFUL RECEIVING AN ORDER\n"+"details--> "+req.params, req.params.external_id, req.params.recipient.name, req.params.items[0].quantity);

  return next();
});

server.listen(8090, function () {
  console.log('%s listening at %s', server.name, server.url);
});