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
var pid = 0;			//projectile ID
var players = {};		//keys are socketId, values for player are data objects
predatorId = 0
lastPredatorId = 0

io.on('connection', function(socket) {
	console.log(socket.id);
	socket.on('disconnect', function(){
		safeRemove(socket.id)
	})


	socket.on('new player', function() {
		if(isEmpty(players)){
			predatorId = socket.id;
			lastPredatorId = socket.id;
			players[socket.id] = new Play(true); //set predator to this player
		}else{
			players[socket.id] = new Play(false);//set predator false 
		}
	});

	socket.on('movement', function(data) {
		var player = players[socket.id] || {}
		if (data.fire && player.canFire){
			player.canFire = false;		
			var proj = new Proj(socket.id)
			if (data.left) {
				player.x -= 5;
				proj.Dx  -= 10;
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
			projectiles[pid++] = proj;
			//
			setTimeout( (() => player.canFire = true), 1000); 
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
		if(preyId == predatorId) continue //if same id, skip
		/*console.log(					  //log distance for dev
			Math.sqrt(
				Math.pow(players[predatorId].x - players[preyId].x,2) +
				Math.pow(players[predatorId].y - players[preyId].y,2))
			)	 */
		//ask if collision, ie distance < 2*radius
		if((Math.sqrt(
			Math.pow(players[predatorId].x - players[preyId].x,2) +
			Math.pow(players[predatorId].y - players[preyId].y,2)) < 20)
			&& !players[preyId].lastPredator)
		{
			players[lastPredatorId].lastPredator = false;
			players[predatorId].predator = false;
			players[predatorId].lastPredator = true;
			players[preyId].predator = true;
			lastPredatorId = predatorId;
			predatorId = preyId;
		} 
	}
		
	for(var p in projectiles){
		if(projectiles[p].distRem < 10){
			delete projectiles[p];
			break ;
		}
		projectiles[p].distRem -= 10;
		projectiles[p].x += projectiles[p].Dx;
		projectiles[p].y += projectiles[p].Dy; 	
		for(var id in players){
			if(
				(id != projectiles[p].from) &&
				(Math.sqrt(
					Math.pow(players[id].x - projectiles[p].x,2) +
					Math.pow(players[id].y - projectiles[p].y,2)) < 14)
			){
				if(players[id].hp <= 0){
					safeRemove(id);
				}else{
					players[id].hp -=10;
				}
				delete projectiles[p];
				break 
			}
		}
	}
	
	io.sockets.emit('state', {players, projectiles});

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

function Proj(socketId){
	this.from = socketId;
	this.x = 0;
	this.y = 0;
	this.Dx = 0;
	this.Dy = 0;
	this.distRem = 500; 
}
function Play(isPred){
	this.predator = isPred;
	this.lastPredator = false;
	this.x = 800 * Math.random();
	this.y = 600 * Math.random();
	this.fire = false;
	this.hp = 100;
	this.canFire = true;
}



function safeRemove(socketId){
	delete players[socketId];     	
	if(socketId == lastPredatorId){
		lastPredatorId = drawPlayerId() || 0;
		if(lastPredatorId)
			players[lastPredatorId].lastPredator = true;
	}
	if(socketId == predatorId){
		predatorId = drawPlayerId() || 0;
		if(predatorId)
			players[predatorId].predator = true;
	}
}
