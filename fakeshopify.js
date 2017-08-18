var request = require('request');

var counter = 1;
var msgTimer = setInterval(function(){
	// request('http://localhost:8080/order/order'+counter, function (error, response, body) {
	//   console.log('error:', error); // Print the error if one occurred
	//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	//   console.log('body:', body); // Print the HTML for the Google homepage.
	// });

	var options = {
		url: 'http://localhost:8080/order/order'+counter,
		// url: 'https://requestb.in/yd9g73yd',
		body: '{"id":820982911946154508,"email":"jon@doe.ca","closed_at":null,"created_at":"2017-08-18T09:44:52-04:00","updated_at":"2017-08-18T09:44:52-04:00","number":234,"note":null,"token":"123456abcd","gateway":null,"test":true,"total_price":"254.98","subtotal_price":"244.98","total_weight":0,"total_tax":"0.00","taxes_included":false,"currency":"USD","financial_status":"voided","confirmed":false,"total_discounts":"5.00","total_line_items_price":"249.98","cart_token":null,"buyer_accepts_marketing":true,"name":"#9999","referring_site":null,"landing_site":null,"cancelled_at":"2017-08-18T09:44:52-04:00","cancel_reason":"customer","total_price_usd":null,"checkout_token":null,"reference":null,"user_id":null,"location_id":null,"source_identifier":null,"source_url":null,"processed_at":null,"device_id":null,"phone":null,"customer_locale":null,"browser_ip":null,"landing_site_ref":null,"order_number":1234,"discount_codes":[],"note_attributes":[],"payment_gateway_names":["visa","bogus"],"processing_method":"","checkout_id":null,"source_name":"web","fulfillment_status":"pending","tax_lines":[],"tags":"","contact_email":"jon@doe.ca","order_status_url":null,"line_items":[{"id":487817672276298554,"variant_id":null,"title":"Aviator sunglasses","quantity":1,"price":"89.99","grams":100,"sku":"SKU2006-001","variant_title":null,"vendor":null,"fulfillment_service":"manual","product_id":788032119674292922,"requires_shipping":true,"taxable":true,"gift_card":false,"name":"Aviator sunglasses","variant_inventory_management":null,"properties":[],"product_exists":true,"fulfillable_quantity":1,"total_discount":"0.00","fulfillment_status":null,"tax_lines":[]},{"id":976318377106520349,"variant_id":null,"title":"Mid-century lounger","quantity":1,"price":"159.99","grams":10000,"sku":"SKU2006-020","variant_title":null,"vendor":null,"fulfillment_service":"manual","product_id":788032119674292922,"requires_shipping":true,"taxable":true,"gift_card":false,"name":"Mid-century lounger","variant_inventory_management":null,"properties":[],"product_exists":true,"fulfillable_quantity":1,"total_discount":"5.00","fulfillment_status":null,"tax_lines":[]}],"shipping_lines":[{"id":271878346596884015,"title":"Generic Shipping","price":"10.00","code":null,"source":"shopify","phone":null,"requested_fulfillment_service_id":null,"delivery_category":null,"carrier_identifier":null,"tax_lines":[]}],"billing_address":{"first_name":"Bob","address1":"123 Billing Street","phone":"555-555-BILL","city":"Billtown","zip":"K2P0B0","province":"Kentucky","country":"United States","last_name":"Biller","address2":null,"company":"My Company","latitude":null,"longitude":null,"name":"Bob Biller","country_code":"US","province_code":"KY"},"shipping_address":{"first_name":"Steve","address1":"123 Shipping Street","phone":"555-555-SHIP","city":"Shippington","zip":"40003","province":"Kentucky","country":"United States","last_name":"Shipper","address2":null,"company":"Shipping Company","latitude":null,"longitude":null,"name":"Steve Shipper","country_code":"US","province_code":"KY"},"fulfillments":[],"refunds":[],"customer":{"id":115310627314723954,"email":"john@test.com","accepts_marketing":false,"created_at":null,"updated_at":null,"first_name":"John","last_name":"Smith","orders_count":0,"state":"disabled","total_spent":"0.00","last_order_id":null,"note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"phone":null,"tags":"","last_order_name":null,"default_address":{"id":715243470612851245,"customer_id":115310627314723954,"first_name":null,"last_name":null,"company":null,"address1":"123 Elm St.","address2":null,"city":"Ottawa","province":"Ontario","country":"Canada","zip":"K2H7A8","phone":"123-123-1234","name":"","province_code":"ON","country_code":"CA","country_name":"Canada","default":false}}}',
		headers: {
			'Accept':' */*',
			// 'Accept-Encoding':' gzip',
			// 'Host':' requestb.in',
			'Connect-Time':' 2',
			'Cf-Ipcountry':' CA',
			'X-Shopify-Shop-Domain':' test-store-3f4j89jg.myshopify.com',
			'Content-Type':' application/json',
			'Cf-Ray':' 390553d9de5f2450-IAD',
			'X-Shopify-Test':' true',
			'X-Shopify-Hmac-Sha256':' DiRJ3pBSWVQszP7AK3Wp1QvoqShYWpKPnuddAFn7U1E=',
			'Connection':' close',
			'X-Newrelic-Transaction':' PxQHWQQBCwZSUlAADwQOVlwHFB8EBw8RVU4aUgBaVgEGBw9QU1kGW1QOAUNKQQlWCFxRAQNXFTs=',
			'Cf-Visitor':{"scheme":"https"},
			'X-Request-Id':' ec00c731-9c22-47a9-925f-d36395e4d212',
			'Via':' 1.1 vegur',
			'Content-Length':' 3799',
			'User-Agent':' Ruby',
			'X-Shopify-Topic':' orders/paid',
			// 'Cf-Connecting-Ip':' 23.227.55.102',
			'X-Shopify-Order-Id':' 820982911946154508',
			'X-Newrelic-Id':' VQQUUFNS',
			'Total-Route-Time':' 0'
		}
	};

	console.log("sending...");
	request.post(options, function optionalCallback(err, response, body) {
		if (err) {
		  return console.error('upload failed:', err);
		}
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	});	
	console.log("send done");

	counter++;

}, 3000);