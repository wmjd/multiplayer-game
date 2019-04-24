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

var players = {};
io.on('connection', function(socket) {
  
	console.log('an user connected');
  	socket.on('disconnect', function(){
    	console.log('user disconnected');
	})

  socket.on('new player', function() {
    players[socket.id] = {
      x: 800 * Math.random(),
      y: 600 * Math.random()
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
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
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
