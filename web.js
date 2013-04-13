// Express initialization
var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');

// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/scorecenter';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});

app.get('/', function (request, response) {
	/*
		db.collection('NAME_OF_YOUR_COLLECTON_HERE...', function(er, collection) {
			collection.find()...
	*/
	response.set('Content-Type', 'text/html');
	response.send('<p>Hi!</p>');
});

app.get('/data.json', function(request, response) {
	response.set('Content-Type', 'text/json');
	response.send('{"status":"good"}');
});

app.get('/fool', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send(500, 'Something broke!');
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);