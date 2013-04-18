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
	response.header('Access-Control-Allow-Origin', '*');
	request.header('Access-Control-Allow-Headers', 'X-Requested-With');

	var username=request.body.username;
	var score=request.body.score;
	var game_title=request.body.game_title;
	var created_at=Date();
 	
	db.collection("highscores", function(error, collection){
		collection.insert({'game_title':game_title, 'username': username, 'score':score, 'created_at': created_at});
	});
	response.set('Content-Type', 'text/html');
	response.send();
});
  
app.get('/highscores.json', function(request, response) {
	response.header('Access-Control-Allow-Origin','*');
	request.header('Access-Control-Allow-Headers', 'X-Requested-With');

	var game_title=request.query['game_title'];
	//var score=Number(request.body.score);

	db.collection('highscores', function(err, collection){
		collection.find({'game_title':game_title}).sort({score:-1}).limit(10).toArray(function(err, documents){	
			console.log(documents);	
			response.set('Content-Type', 'text/json');
			response.send(documents);
		});
	});
});

app.get('/', function (request, response) {
	response.header('Access-Control-Allow-Origin','*');
	request.header('Access-Control-Allow-Headers', 'X-Requested-With');
	
	db.collection('highscores', function(err, collection){
		collection.find().toArray(function(err, documents){
			response.set('Content-Type', 'text/json');
			response.send(documents);
		});
	});
});


 app.get('/usersearch', function(request, response){
 	response.header('Access-Control-Allow-Origin','*');
 	request.header('Access-Control-Allow-Headers', 'X-Requested-With');
 	console.log("loosah");
 	
 	
 	//request.set('Content-Type', 'text/html');
 	request.send('<!DOCTYPE html><html><head><title>User Search</title></head><body><form name="search" action="results" method="post">Username: <input type="text" name="username"><input type="submit" value="Submit"></form></body></html>')
 	
 });

app.get('/fool', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send(500, 'Something broke!');
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);