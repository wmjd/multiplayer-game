// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
const PORT = process.env.PORT || 5000;


app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, function() {
	console.log('Starting server on port 5000');
});


var projectiles = {};
var players = {};
predatorId = 0
lastPredatorId = 0
io.on('connection', function(socket) {
	socket.on('disconnect', function(){
		delete players[socket.id];     	
		if(socket.id == lastPredatorId){
			lastPredatorId = drawPlayerId() || 0;
			if(lastPredatorId)
				players[lastPredatorId].lastPredator = true;
		}
		if(socket.id == predatorId){
			predatorId = drawPlayerId() || 0;
			if(predatorId)
				players[predatorId].predator = true;
		}
	})

	socket.on('new player', function() {
		console.log("contents of players, ", players);

		if(isEmpty(players)){
			players[socket.id] = {
				x: 800 * Math.random(),
				y: 600 * Math.random(),
				predator: true,
				lastPredator: false,
				fire: false,
			};
			predatorId = socket.id;
			lastPredatorId = socket.id;
		}else{
			players[socket.id] = {
				x: 800 * Math.random(),
				y: 600 * Math.random(),
				predator: false,
				lastPredator: false,
				fire: false,
			};
		}
	});
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		var proje
		if (data.fire){
			var proj = new Proj()
			if (data.left) {
				player.x -= 5;
				proj.Dy  -= 10;
			}
			if (data.up) {
				player.y -= 5;
				proj.Dy  -= 10
			}
			if (data.right) {
				player.x += 5;
				proj.Dx  += 10;
			}
			if (data.down) {
				player.y += 5;
				proj.Dy  += 10;
			}
			proj.x = player.x;
			proj.y = player.y;
			
		}else{
			if (data.left) {
				player.x -= 5;
			}
			if (data.up) {
				player.y -= 5;
			}
			if (data.right) {
				player.x += 5;
			}
			if (data.down) {
				player.y += 5;
			}
		}
	
	});
});

setInterval(function() {
	for(var preyId in players){
		if(preyId == predatorId) continue //same id, skip
		console.log(
			Math.sqrt(
				Math.pow(players[predatorId].x - players[preyId].x,2) +
				Math.pow(players[predatorId].y - players[preyId].y,2))
			)	 
		if((Math.sqrt(
			Math.pow(players[predatorId].x - players[preyId].x,2) +
			Math.pow(players[predatorId].y - players[preyId].y,2)) < 20)
			&& !players[preyId].lastPredator)
		{
		console.log("INTERSECTION!");	
			players[lastPredatorId].lastPredator = false;
			players[predatorId].predator = false;
			players[predatorId].lastPredator = true;
			players[preyId].predator = true;
			lastPredatorId = predatorId;
			predatorId = preyId;
		} 
	}

	io.sockets.emit('state', players);
}, 1000 / 60);

//////////////////////////////////////////////////////////////
// useful functions....
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function drawPlayerId(){
	for(var randPlayerId in players){
		return randPlayerId;
	} 
}

function Proj(){
	this.x = 0;
	this.y = 0;
	this.Dx = 0;
	this.Dy = 0;
	this.life = 100; 
}


/*projectiles are fired from user like other movement
the server has an projectile object of all projectiles with socketId as key
	and value is object with {Dy, Dx, x, y, lifetime}
every turn

*/
