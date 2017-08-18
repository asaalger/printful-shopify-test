var restify = require('restify');
var request = require('request');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
// server.use(restify.plugins.bodyParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));


server.post('/order/:details', function (req, res, next) {
	console.log("NEW ORDER FROM SHOPIFY\n"+"details--> "+req.params, req.params.email, req.params.total_price);

	res.send(req.params); //response to request


	///  CONSTRUCTING PRINTFUL OBJ
	var printfulObject = {
		external_id:"820982911946154508",
		shipping: "STANDARD",
	    "recipient": {
	        "name": req.params.shipping_address.name,
	        "address1": req.params.shipping_address.address1,
	        "company": req.params.shipping_address.company,
	        "city": req.params.shipping_address.city,
	        "state_code": req.params.shipping_address.province_code,
	        "country_code": req.params.shipping_address.country_code,
	        "zip": req.params.shipping_address.zip,
	        "phone": req.params.shipping_address.phone,
	        "email": req.params.customer.email
	    },
	    items: []
	};

	for(var i = 0; i < req.params.line_items.length; i++){
		var itemObj = {
	        "variant_id": 8083,  //medium sub shirt.  Other id's here https://www.printful.com/products
	        "external_id": req.params.line_items[i].external_id,
	        "quantity": req.params.line_items[i].quantity,
	        "files": [{
	            "url": "http://i0.kym-cdn.com/entries/icons/original/000/000/091/TrollFace.jpg"
	        }]
	    }
		printfulObject.items.push(itemObj);
	}

	//CREATING CORRECT IMAGE
	exec('magick composite ./test_images/left.png ./test_images/right.png ./renders/composite.png');

	/// SENDING PRINTFUL OBJ
	// request.post('http://localhost:8090/echo/anOrder', function (error, response, body) {
	//   console.log('error:', error); // Print the error if one occurred
	//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	//   console.log('body:', body); // Print the HTML for the Google homepage.
	// });

	var options = {
		url: 'http://localhost:8090/echo/anOrder',
		// url: 'https://requestb.in/yd9g73yd',
		body: JSON.stringify(printfulObject),
		headers: {
			'Content-Type':' application/json',
			// 'Content-Length':' 3799',
			'User-Agent':'node',
		}
	};

	console.log("sending...");
	request.post(options, function optionalCallback(err, response, body) {
		if (err) {
		  return console.error('upload failed:', err);
		}
		console.log('Upload successful!  Server responded with:', body);
	});	
	console.log("send done");
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});