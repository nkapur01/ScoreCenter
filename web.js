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

app.post('/submit.json', function(request, response){
	response.header['Access-Control-Allow-Origin', '*'];
	request.header['Access-Control-Allow-Headers', 'X-Requested-With'];
	
	var username=request.body.username;
	var score=request.body.score;
	var game_title=request.body.game_title;
	var created_at=request.Date;
	
	db.collection("highscores", function(error, collection){
		db.collection.insert({'game_title'=game_title, 'username': username, 'score'=score, 'created_at': created_at});
	});
	response.set('Content-Type', 'text/html');
	response.send();
});

app.get('/', function (request, response) {
	/*
		db.collection('NAME_OF_YOUR_COLLECTON_HERE...', function(er, collection) {
			collection.find()...
	*/
	response.set('Content-Type', 'text/html');
	response.send('game_title</br>username</br>score</br><created_at');
});

app.get('/highscores.json', function(request, response) {
	response.set('Content-Type', 'text/json');
	response.send('{"status":"good"}');
});

app.get('/usersearch', function(request, response){


});

app.get('/fool', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send(500, 'Something broke!');
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);