console.log("client");
var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false,
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
	case 32: // space
      movement.fire = true;
	  break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  	case 32: // space
      movement.fire = false;
	  break;
	}
});

socket.emit('new player');
setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60);


var hpColor = {
	100: 'rgb(0, 255, 0)',
	 90: 'rgb(0, 235, 0)',
	 80: 'rgb(0, 215, 0)',
	 70: 'rgb(0, 195, 0)',
	 60: 'rgb(0, 175, 0)',
	 50: 'rgb(0, 155, 0)',
	 40: 'rgb(0, 135, 0)',
	 30: 'rgb(0, 115, 0)',
	 20: 'rgb(0,  95, 0)',
	 10: 'rgb(0,  75, 0)'
};

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(obj) {
	context.clearRect(0, 0, 800, 600);
	for (var id in obj.players) {
		var player = obj.players[id];	
		context.fillStyle = hpColor[player.hp];
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();
	}
	for (var p in obj.projectiles){
		var prj = obj.projectiles[p];
		context.fillStyle = 'black';
		context.beginPath();
		context.arc(prj.x, prj.y, 4, 0, 2 * Math.PI);
		context.fill();
	}
});








