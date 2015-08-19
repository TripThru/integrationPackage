var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', function(request, response) {
	console.log(request.body);
	response.send('Hello World!')
})

app.get('/boo', function(request, response) {
	response.send('boo Hello World!')
})

app.post('/boo', function(request, response) {
	console.log(request.body);
	data = request.body;
	for(firstKey in data);
	console.log(firstKey);
	//console.log(data[firstKey]);
	var myjson = JSON.parse(firstKey);
	console.log(myjson.hi);
		
	response.send('111 boo Hello World!');
})

/* actual code... (above is for testing) */
app.get('/quote', function(request, response) {
	console.log("GET /quote");

	var obj = JSON.parse(fs.readFileSync('responses/get_quote_response.js', 'utf8'));

	response.send(obj);
})

app.post('/trip', function(request, response) {
	console.log("POST /trip");
	response.send('POST /trip received');
})

app.put('/tripstatus', function(request, response) {
	console.log("PUT /tripstatus");
	data = request.body;
	console.log(data);
	response.send('PUT /tripstatus received');
})

//---------------------------------------------------------
//  TRIPSTATUS
//---------------------------------------------------------

/*
app.get('/tripstatus', function(request, response) {
	console.log("GET /tripstatus");
	data = request.body;
	console.log(data);
	response.send('GET /tripstatus received');
})
*/

app.put('/tripstatus/:id', function(request, response) {
	console.log("PUT /tripstatus/:id");
	var id = request.params.id;
	console.log("id is: " + id);
	data = request.body;
	var dataStringified = JSON.stringify(data, null, '    ');
	console.log(dataStringified);
	var responseJSON = {"result": "OK", "result_code": 200};
	response.send(responseJSON);
})

//---------------------------------------------------------
//  PAYMENT
//---------------------------------------------------------

/*
app.post('/payment', function(request, response) {
	console.log("POST /payment");
	response.send('POST /payment received');
})
*/

app.post('/payment/:id', function(request, response) {
	console.log("POST /payment/:id");
	var id = request.params.id;
        console.log("id is: " + id);
        data = request.body;
        var dataStringified = JSON.stringify(data, null, '    ');
        console.log(dataStringified);
        var responseJSON = {"result": "OK", "result_code": 200};
        response.send(responseJSON);
})

// print "test" every minute, this is here because some network connections will kick you off 
// if there is no data communcation 

// feel free to comment this out if you don't have a need for it
setInterval(function(){
	console.log('test');
}, 60 * 1000);      

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
	//console.log( server.address().address );
})
