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

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(obj) {
	console.log(obj)
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';
	for (var id in obj.players) {
		var player = obj.players[id];	
		context.fillStyle = player.predator? 'red' : 'green';
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








