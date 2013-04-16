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
	
	var game_title=request.query('game_title');
	
	db.collection('highscores', function(err, collection){
		collection.find({'game_title':game_title}.toArray(function err, documents){
			documents=documents.sort(function(a,b) {
				 if (a.game_title == b.game_title) {
				 	return(b.score-a.score);
				 else{
				 	return (a.game_title.localeCompare(b.game_title);
				 }
			});
		});
 	});
// 
// //if(a.score>b.score){
// 
// // 				 		return -1
// // 				 	}
// // 				 	else{
// // 				 		return 1;
// // 				 	}
// // 				 }
// // 				 else {
// // 				 	if(a.game_title < b.game_title){
// // 				 		return -1;
// // 				 	}
// // 				 	else {
// // 				 		return 1;
// // 				 	}
// // 				 }
	

	response.set('Content-Type', 'text/json');
	response.send('{"status":"good"}');
});

app.get('/', function (request, response) {
	/*
		db.collection('NAME_OF_YOUR_COLLECTON_HERE...', function(er, collection) {
			collection.find()...
	*/
	response.set('Content-Type', 'text/html');
	response.send('mew');
});

app.get('/usersearch', function(request, response){


});

app.get('/fool', function(request, response) {
	response.set('Content-Type', 'text/html');
	response.send(500, 'Something broke!');
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);