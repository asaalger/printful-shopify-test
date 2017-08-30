// var CUR_SERVER = "localhost";
var CUR_SERVER = "fritzdavenport.com";

var restify = require('restify');
var request = require('request');
var exec = require('child_process').exec;

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
// server.use(restify.plugins.bodyParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));

//setup public image access
server.get(/\/renders\/monster\/?.*/, restify.plugins.serveStatic({
  directory: __dirname+"/renders",
  appendRequestPath: false
}));


server.post('/order/:details', function (req, res, next) {
	console.log("NEW ORDER FROM SHOPIFY\n"+"details--> "+req.params, req.params.email, req.params.total_price);

	res.send(req.params); //response to request

	///  CONSTRUCTING PRINTFUL OBJ
	var printfulObject = {
		// external_id:"820982911946154508",
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
		// var cut = req.params.line_items[i].properties.Cut;
		var cut = getByValue(req.params.line_items[i].properties, "Cut").value;
		// var size = req.params.line_items[i].properties.Size;
		var size = getByValue(req.params.line_items[i].properties, "Size").value;

		// var left_char_id = getCharID(req.params.line_items[i].properties.Left);
		var left_char_id = getCharID(getByValue(req.params.line_items[i].properties, "Left").value);
		// var right_char_id  = getCharID(req.params.line_items[i].properties.Right);
		var right_char_id = getCharID(getByValue(req.params.line_items[i].properties, "Right").value);
		
		var left_variant_id = getVariantID(left_char_id, req.params.line_items[i].properties);
		// var left_variant_id = getByValue(req.params.line_items[i].properties, "Cut").value;

		var right_variant_id = getVariantID(right_char_id, req.params.line_items[i].properties);
		// var right_variant_id = getByValue(req.params.line_items[i].properties, "Cut").value;

		var left_img_url = './src_images/'+left_char_id+'_'+left_variant_id+"_L.png";
		var right_img_url = './src_images/'+right_char_id+'_'+right_variant_id+"_R.png";

		var image_uid = "UNIQUE_STRING"

		var printful_variant_id = getPrintfulCutID(cut, size);

		console.log("cut = "+cut+"\n",
					"size = "+size+"\n",
					"left_char_id = "+left_char_id+"\n",
					"right_char_id = "+right_char_id+"\n",
					"left_variant_id = "+left_variant_id+"\n",
					"right_variant_id = "+right_variant_id+"\n",
					"left_img_url = "+left_img_url+"\n",
					"right_img_url = "+right_img_url+"\n",
					"printful_variant_id = "+printful_variant_id+"\n"
					);

		//GENERATE UNIQUE ID
		var uuidv1;
		uuidv1 = require('uuid/v1');
		image_uid = uuidv1();

		var itemObj = {
	        "variant_id": printful_variant_id,
	        "external_id": req.params.line_items[i].external_id,
	        "quantity": req.params.line_items[i].quantity,
	        "files": [{
	            "url": 'http://fritzdavenport.com:8080/renders/monster/'+image_uid+".png"
	        }]
	    }
		printfulObject.items.push(itemObj);
		
		//CREATING CORRECT IMAGE
		// console.log("making image\n",'magick composite '+left_img_url+' '+right_img_url+' ./renders/composite.png');
		// exec('magick composite '+left_img_url+' '+right_img_url+' ./renders/'+image_uid+'.png', (error, stdout, stderr) => { //local
		exec('composite '+left_img_url+' '+right_img_url+' ./renders/'+image_uid+'.png', (error, stdout, stderr) => { //server
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);

			//FINISH PROCESS
			console.log("made image named "+image_uid+'.png');


			// SENDING PRINTFUL OBJ
			var options = {
				// url: 'http://'+CUR_SERVER+':8090/echo/anOrder',
				url: 'https://api.printful.com/orders/',
				// url: 'https://requestb.in/p1xmogp1',
				body: JSON.stringify(printfulObject),
				headers: {
					'Content-Type':' application/json',
					// 'Content-Length':' 3799',
					'User-Agent':'node',
					'Authorization': 'Basic aGFwMmd5YnYtYW9nMS16cWpzOjZkd2ItZzdmb25tMXE1OHhu'
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
		
	}
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

function getCharID(charString){
	switch(charString){
		case 'Abraham Lincoln':
			return "ABR";
			break;
		case 'Albert Einstein':
			return "EIN";
			break;
		case 'Athena of Olympus':
			return "ATH";
			break;
		case 'Cthulu the Destroyer':
			return "CTH";
			break;
		case 'Genghis Khan':
			return "GEN";
			break;
		case 'Jesus Christ':
			return "JES";
			break;
		case 'King Arthur':
			return "ART";
			break;
		case 'Santa Clause':
			return "SAN";
			break;
	}
}
function getVariantID(charID, JSONobj){
	var variant;

	switch(charID){
		case 'ABR':
			switch(getByValue(JSONobj, "Lincoln").value){
				case 'Mr President':
					variant = '001';
					break;
				case 'Velvet Abe':
					variant = '002';
					break;
				case 'Uncle Sam':
					variant = '003';
					break;
				case 'Rainbow Abe':
					variant = '004';
					break;
			}
			break;
		case 'EIN':
			switch(getByValue(JSONobj, "Albert Einstein").value){
				case 'Dr. Einstein':
					variant = '001';
					break;
				case 'Young Albert':
					variant = '002';
					break;
				case 'The Great Mishap':
					variant = '003';
					break;
				case 'Grandpa Al':
					variant = '004';
					break;
				case 'Power of the Mind':
					variant = '005';
					break;
			}
			break;
		case 'ATH':
			switch(getByValue(JSONobj, "Athena").value){
				case 'Goddess of Wisdom':
					variant = '001';
					break;
				case 'Violet Violence':
					variant = '002';
					break;
				case 'Living Sculpture':
					variant = '003';
					break;
				case 'Recovered Relic':
					variant = '004';
					break;
			}
			break;
		case 'CTH':
			switch(getByValue(JSONobj, "Cthulu").value){
				case 'World Eater':
					variant = '001';
					break;
				case 'Abbadon':
					variant = '002';
					break;
				case 'King Below the Sea':
					variant = '003';
					break;
				case 'Pluton':
					variant = '004';
					break;
			}
			break;
		case 'GEN':
			switch(getByValue(JSONobj, "Genghis Khan").value){
				case 'Temujin':
					variant = '001';
					break;
				case 'The Bloody Butcher':
					variant = '002';
					break;
				case 'Purple People Eater':
					variant = '003';
					break;
			}
			break;
		case 'JES':
			switch(getByValue(JSONobj, "Jesus Christ").value){
				case 'King James':
					variant = '001';
					break;
				case 'Historical':
					variant = '002';
					break;
				case 'Anointed Son':
					variant = '003';
					break;
				case 'Super Jesus':
					variant = '004';
					break;
			}
			break;
		case 'ART':
				switch(getByValue(JSONobj, "King Arthur").value){
				case 'King of Britannia':
					variant = '001';
					break;
				case 'Undead Lord':
					variant = '002';
					break;
				case 'Autumn Warrior':
					variant = '003';
					break;
			}
			break;
		case 'SAN':
			// switch(JSONobj.properties["Santa Clause"]){
			switch(getByValue(JSONobj, "Santa Clause").value){
				case 'Saint Nick':
					variant = '001';
					break;
				case 'After Midnight':
					variant = '002';
					break;
				case 'Hobo Steve':
					variant = '003';
					break;
				case 'Krampus':
					variant = '004';
					break;
			}
			break;
		
	}
	return variant;
}

function getPrintfulCutID(cut, size){
	var printful_id;

	switch(cut){
		case 'Mens Shirt':
			switch(size){
				case 'XS':
					printful_id = '8089';
					break;
				case 'S':
					printful_id = '8082';
					break;
				case 'M':
					printful_id = '8083';
					break;
				case 'L':
					printful_id = '8084';
					break;
				case 'XL':
					printful_id = '8085';
					break;
				case '2XL':
					printful_id = '8086';
					break;
			}
			return printful_id;
			break;
		case 'Womens Shirt':
			switch(size){
				case 'S':
					printful_id = '8077';
					break;
				case 'M':
					printful_id = '8078';
					break;
				case 'L':
					printful_id = '8079';
					break;
				case 'XL':
					printful_id = '8080';
					break;
				case '2XL':
					printful_id = '8081';
					break;
			}
			return printful_id;
			break;
	}
}

function getByValue(arr, value) {

  for (var i=0, iLen=arr.length; i<iLen; i++) {

    if (arr[i].name == value) return arr[i];
  }
}